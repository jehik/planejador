import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { auth, db } from '../firebase.config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// --- Default Data Structures ---
// Only for "Profile" data. Tasks are now in subcollection.
const initialUserData = {
  name: '',
  points: 0,
  level: 1,
  streak: 0,
  focusCycles: 0,
  // tasks: [], // REMOVED: Now in subcollection
  goals: [], // Keep for now
  workouts: [],
  nutrition: {
    water: 0,
    lastResetDate: null,
  },
  finance: {
    income: 0,
    expenses: 0,
    savingsGoal: 10000,
    transactions: []
  },
  dreams: [],
  projects: [], // [{ id, title, description, progress, tasks: [] }]
  travel: [], // [{ id, destination, date, flight, hotel, notes, packingList: [] }]
  studies: [], // [{ id, title, color }]
  checklists: {}, // Generic checklists if needed
  romanticStoryViewed: false
};

const useAppStore = create(persist((set, get) => ({
  // --- 1. Persistent State (Local) ---
  darkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => {
    const newMode = !get().darkMode;
    set({ darkMode: newMode });
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  },

  // --- 2. Volatile State ---
  currentUser: null,
  userData: null,
  tasks: [], // NEW: Subcollection Data
  tasksUnsubscribe: null, // Listener cleanup function
  userDataUnsubscribe: null,

  isHydrated: false,
  isSyncing: false,
  hasUnsyncedChanges: false,
  sessionConfirmed: false,

  // Menu State
  isMenuOpen: false,
  toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),

  // Navigation
  // Tabs: 'home' (Dashboard), 'tasks', 'house', 'nutrition', 'shopping', 'studies', 'trip', 'profile', 'finance'
  activeTab: 'home',
  setActiveTab: (tab) => {
    set({ activeTab: tab, isMenuOpen: false }); // Auto-close menu on nav
  },

  // Auth Helper
  confirmSession: () => set({ sessionConfirmed: true }),
  focusMode: false,
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

  // --- 3. Authentication & Init ---
  initializeAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Auth: User detected', user.email);
        set({ currentUser: user });
        await get().loadUserData(user.uid);
        get().subscribeToTasks(user.uid); // Start Real-time Listener
        get().subscribeToUserData(user.uid); // Start Real-time UserData Listener
      } else {
        console.log('Auth: No user');
        get().logout();
      }
    });
  },

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      set({ sessionConfirmed: true });
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      // Unsubscribe from Firestore
      const unsubTasks = get().tasksUnsubscribe;
      if (unsubTasks) unsubTasks();

      const unsubUser = get().userDataUnsubscribe;
      if (unsubUser) unsubUser();

      await signOut(auth);
      set({
        currentUser: null,
        userData: null,
        tasks: [],
        tasksUnsubscribe: null,
        userDataUnsubscribe: null,
        isHydrated: false,
        isSyncing: false,
        hasUnsyncedChanges: false,
        sessionConfirmed: false,
        activeTab: 'home',
        isMenuOpen: false
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // --- 4. User Data Management (Profile/Hydration) ---
  loadUserData: async (uid) => {
    if (!uid) return;
    set({ isSyncing: true });

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      let dataToLoad = null;

      if (docSnap.exists()) {
        dataToLoad = docSnap.data();
      } else {
        // Init new user
        const name = auth.currentUser?.email?.includes('debora') ? 'Débora' : 'Cássio';
        dataToLoad = { ...initialUserData, name };
        await setDoc(docRef, dataToLoad);
      }

      // Check for Daily Reset (Water)
      const today = new Date().toISOString().split('T')[0];
      if (dataToLoad.nutrition?.lastResetDate !== today) {
        dataToLoad.nutrition = {
          ...dataToLoad.nutrition,
          water: 0,
          lastResetDate: today
        };
        // Daily reset applied
      }

      set({ userData: dataToLoad });

      // MIGRATION CHECK: OLD TASKS ARRAY
      if (dataToLoad.tasks && Array.isArray(dataToLoad.tasks) && dataToLoad.tasks.length > 0) {
        await get().migrateLegacyTasks(uid, dataToLoad.tasks);
      }

    } catch (error) {
      console.error("Load UserData failed:", error);
      // Fallback
      set({ userData: { ...initialUserData, name: 'Usuário' } });
    } finally {
      set({ isHydrated: true, isSyncing: false });
    }
  },

  // --- 5. TASKS SUBCOLLECTION LOGIC (Real-time) ---
  subscribeToTasks: (uid) => {
    // Avoid double subscription
    if (get().tasksUnsubscribe) return;

    const q = query(
      collection(db, 'users', uid, 'tasks'),
      orderBy('scheduledAt', 'asc') // Prompt requirement: "Ordenar por scheduledAt crescente"
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasks = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          ...data,
          scheduledAt: data.scheduledAt?.toDate ? data.scheduledAt.toDate() : new Date(data.scheduledAt) // Handle Timestamp or String
        });
      });
      set({ tasks });
    }, (error) => {
      console.error("Task Subscription Error:", error);
    });

    set({ tasksUnsubscribe: unsubscribe });
  },

  subscribeToUserData: (uid) => {
    if (get().userDataUnsubscribe) return;

    const unsub = onSnapshot(doc(db, 'users', uid), (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data();
        const currentData = get().userData;

        // Only update if we don't have local unsynced changes to avoid overwrite race conditions
        if (!get().hasUnsyncedChanges) {
          set({ userData: remoteData });
        }
      }
    });

    set({ userDataUnsubscribe: unsub });
  },

  addTask: async (task) => {
    // task: { title, category, scheduledAt, periodType, description, etc }
    const { currentUser } = get();
    if (!currentUser) return;

    // Validation: Prompt "Obrigatório: Title, ScheduledAt"
    if (!task.title || !task.scheduledAt) {
      console.error("Validation Error: Missing title or date");
      return;
    }

    const newTask = {
      ...task,
      completed: false,
      createdAt: serverTimestamp(),
      // Ensure scheduledAt is a valid Date or ISO string for Firestore
      scheduledAt: task.scheduledAt instanceof Date ? task.scheduledAt : new Date(task.scheduledAt)
    };

    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'tasks'), newTask);
      // Points for creating?
    } catch (error) {
      console.error("Add Task Failed:", error);
      alert(`Erro ao adicionar tarefa: ${error.message}`);
    }
  },

  updateTask: async (taskId, updates) => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      const taskRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
      await updateDoc(taskRef, updates);
    } catch (error) {
      console.error("Update Task Failed:", error);
    }
  },

  deleteTask: async (taskId) => {
    const { currentUser } = get();
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'tasks', taskId));
    } catch (error) {
      console.error("Delete Task Failed:", error);
    }
  },

  toggleTask: async (taskId, currentStatus) => {
    const { currentUser, setUserData } = get();
    if (!currentUser) return;

    try {
      const taskRef = doc(db, 'users', currentUser.uid, 'tasks', taskId);
      await updateDoc(taskRef, { completed: !currentStatus });

      // Award Points on user profile (Optimistic update via sync logic or direct)
      if (!currentStatus) { // If completing
        setUserData(data => ({
          ...data,
          points: (data.points || 0) + 5
        }));
      }
    } catch (error) {
      console.error("Toggle Task Failed:", error);
    }
  },

  // --- Checklist Items (Subcollection: tasks/{id}/checklist) ---
  addChecklistItem: async (taskId, title) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'tasks', taskId, 'checklist'), {
        name: title,
        checked: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Add Checklist Item Failed:", error);
    }
  },

  toggleChecklistItem: async (taskId, itemId, currentChecked) => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid, 'tasks', taskId, 'checklist', itemId), {
        checked: !currentChecked
      });
    } catch (error) {
      console.error("Toggle Item Failed", error);
    }
  },

  // --- 6. MIGRATION LOGIC ---
  migrateLegacyTasks: async (uid, legacyTasks) => {
    try {
      const batchPromises = legacyTasks.map(t => {
        // Map old format to new format
        const newTask = {
          title: t.title || 'Tarefa sem título',
          category: t.category || 'personal', // Default mapping
          description: '',
          scheduledAt: t.date ? new Date(t.date) : new Date(),
          periodType: 'day',
          completed: t.completed || false,
          createdAt: serverTimestamp()
        };
        return addDoc(collection(db, 'users', uid, 'tasks'), newTask);
      });

      await Promise.all(batchPromises);

      // Clean up old array
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { tasks: [] });

      // Update local state to reflect removal
      set(state => ({
        userData: { ...state.userData, tasks: [] }
      }));
    } catch (error) {
      console.error("Migration Failed:", error);
    }
  },

  // --- 7. AUTO SYNC (For UserData Only) ---
  syncData: async () => {
    const { userData, currentUser, isHydrated, isSyncing } = get();

    if (!currentUser || !userData || !isHydrated || isSyncing) return;

    set({ isSyncing: true });

    try {
      const cleanData = JSON.parse(JSON.stringify(userData));
      delete cleanData.tasks; // Ensure we never accidentally save tasks array

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, cleanData, { merge: true });

      set({ hasUnsyncedChanges: false, isSyncing: false });
    } catch (error) {
      console.error("[AutoSync] Error", error);
      set({ isSyncing: false });
    }
  },

  // --- Helper Helpers ---
  setUserData: (fn) => set((state) => {
    if (!state.userData) return state;
    const newData = fn(state.userData);
    return {
      userData: newData,
      hasUnsyncedChanges: true
    };
  }),

  // --- Nutrition (Water Logic) ---
  // Meals are now Tasks with category='nutrition'
  addWater: (amount) => get().setUserData(data => ({
    ...data,
    nutrition: {
      ...data.nutrition,
      water: (data.nutrition?.water || 0) + amount
    }
  })),

  checkDailyReset: () => get().setUserData(data => {
    const today = new Date().toISOString().split('T')[0];
    if (data.nutrition?.lastResetDate !== today) {
      console.log('Daily Reset Triggered (Focus)');
      return {
        ...data,
        nutrition: {
          ...data.nutrition,
          water: 0,
          lastResetDate: today
        }
      };
    }
    return data;
  }),

  // --- Goals Actions ---
  addGoal: (goal) => get().setUserData(data => ({
    ...data,
    goals: [...(data.goals || []), { ...goal, id: Date.now().toString(), steps: [] }]
  })),
  removeGoal: (id) => get().setUserData(data => ({
    ...data,
    goals: (data.goals || []).filter(g => g.id !== id)
  })),
  addGoalStep: (goalId, stepTitle) => get().setUserData(data => ({
    ...data,
    goals: (data.goals || []).map(g => g.id === goalId ? {
      ...g,
      steps: [...(g.steps || []), { id: Date.now().toString(), title: stepTitle, completed: false }]
    } : g)
  })),
  toggleGoalStep: (goalId, stepId) => get().setUserData(data => ({
    ...data,
    goals: (data.goals || []).map(g => g.id === goalId ? {
      ...g,
      steps: (g.steps || []).map(s => s.id === stepId ? { ...s, completed: !s.completed } : s)
    } : g)
  })),

  // --- Shopping Actions ---
  addShoppingItem: (item) => get().setUserData(data => ({
    ...data,
    shopping: [...(data.shopping || []), { ...item, id: Date.now().toString() }]
  })),
  removeShoppingItem: (id) => get().setUserData(data => ({
    ...data,
    shopping: (data.shopping || []).filter(item => item.id !== id)
  })),
  toggleShoppingItem: (id) => get().setUserData(data => ({
    ...data,
    shopping: (data.shopping || []).map(item => item.id === id ? { ...item, completed: !item.completed } : item)
  })),

  // --- Finance Actions ---
  addTransaction: (tx) => get().setUserData(data => ({
    ...data,
    finance: {
      ...data.finance,
      transactions: [...(data.finance.transactions || []), { ...tx, id: Date.now().toString() }]
    }
  })),
  removeTransaction: (id) => get().setUserData(data => ({
    ...data,
    finance: {
      ...data.finance,
      transactions: (data.finance.transactions || []).filter(t => t.id !== id)
    }
  })),

  // --- Projects Actions ---
  addProject: (project) => get().setUserData(data => ({
    ...data,
    projects: [...(data.projects || []), { ...project, id: Date.now().toString(), createdAt: new Date().toISOString() }]
  })),
  deleteProject: (id) => get().setUserData(data => ({
    ...data,
    projects: (data.projects || []).filter(p => p.id !== id)
  })),
  updateProject: (id, updates) => get().setUserData(data => ({
    ...data,
    projects: (data.projects || []).map(p => p.id === id ? { ...p, ...updates } : p)
  })),

  // --- Travel Actions ---
  addTravel: (trip) => get().setUserData(data => ({
    ...data,
    travel: [...(data.travel || []), { ...trip, id: Date.now().toString() }]
  })),
  deleteTravel: (id) => get().setUserData(data => ({
    ...data,
    travel: (data.travel || []).filter(t => t.id !== id)
  })),
  updateTravel: (id, updates) => get().setUserData(data => ({
    ...data,
    travel: (data.travel || []).map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  // --- Studies Actions ---
  addStudy: (study) => get().setUserData(data => ({
    ...data,
    studies: [...(data.studies || []), { ...study, id: Date.now().toString() }]
  })),
  deleteStudy: (id) => get().setUserData(data => ({
    ...data,
    studies: (data.studies || []).filter(s => s.id !== id)
  })),

  // --- Workout Actions ---
  addWorkout: (workout) => get().setUserData(data => ({
    ...data,
    workouts: [...(data.workouts || []), { ...workout, id: Date.now().toString(), lastCompleted: null, streak: 0 }]
  })),
  removeWorkout: (id) => get().setUserData(data => ({
    ...data,
    workouts: (data.workouts || []).filter(w => w.id !== id)
  })),
  toggleWorkout: (id) => get().setUserData(data => {
    const today = new Date().toISOString().split('T')[0];
    return {
      ...data,
      workouts: (data.workouts || []).map(w => {
        if (w.id !== id) return w;
        const isCompletedToday = w.lastCompleted === today;
        return {
          ...w,
          lastCompleted: isCompletedToday ? null : today,
          streak: isCompletedToday ? Math.max(0, w.streak - 1) : w.streak + 1
        };
      })
    };
  }),

  // --- Relationship Actions ---
  addDateIdea: (text) => get().setUserData(data => ({
    ...data,
    dateIdeas: [...(data.dateIdeas || []), { id: Date.now().toString(), text, checked: false }]
  })),
  toggleDateIdea: (id) => get().setUserData(data => ({
    ...data,
    dateIdeas: (data.dateIdeas || []).map(i => i.id === id ? { ...i, checked: !i.checked } : i)
  })),
  removeDateIdea: (id) => get().setUserData(data => ({
    ...data,
    dateIdeas: (data.dateIdeas || []).filter(i => i.id !== id)
  })),

}), {
  name: 'planejador-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({
    userData: state.userData,
    activeTab: state.activeTab,
    darkMode: state.darkMode
  }),
  onRehydrateStorage: () => (state) => {
    if (state) state.isHydrated = true;
  }
}));

export default useAppStore;
