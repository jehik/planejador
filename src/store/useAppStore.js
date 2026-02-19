import { create } from 'zustand';

import { auth, db } from '../firebase.config';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore';

// --- Default Data Structures ---
const initialUserData = {
  name: '',
  points: 0,
  level: 1,
  streak: 0,
  focusCycles: 0,
  tasks: [
    { id: 1, title: 'Planejar o dia', completed: false, date: new Date().toISOString().split('T')[0] },
    { id: 2, title: 'Revisar metas', completed: false, date: new Date().toISOString().split('T')[0] }
  ],
  dailyTask: {
    id: 1,
    title: 'Completar Configuração do Projeto',
    completed: false,
  },
  goals: [],
  workouts: [],
  nutrition: {
    water: 0,
    lastResetDate: null, // Tracks daily reset
    meals: {
      breakfast: false,
      lunch: false,
      snack: false,
      dinner: false
    }
  },
  finance: {
    income: 0,
    expenses: 0,
    savingsGoal: 10000,
    transactions: []
  },
  dreams: [],
  romanticStoryViewed: false
};

// --- Store Implementation ---
const useAppStore = create((set, get) => ({

  // --- 1. Persistent State (Theme Only) ---
  // We handle this manually or via a separate slice if needed, but for simplicity
  // we will sync darkMode to localStorage directly in the toggle action or init.
  // actually, let's keep it simple: initial state read from storage
  darkMode: localStorage.getItem('theme') === 'dark',
  toggleTheme: () => {
    const newMode = !get().darkMode;
    set({ darkMode: newMode });
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  },

  // --- 2. Volatile State (Auth & Data) ---
  currentUser: null,       // Firebase Auth Object
  userData: null,          // The actual user data (tasks, water, etc)
  isHydrated: false,       // True only after initial load from Firestore
  isSyncing: false,        // True during network request
  hasUnsyncedChanges: false, // Dirty flag for AutoSync
  sessionConfirmed: false, // NEW: Prevents auto-entry on refresh

  // Navigation
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Auth Helper for Session Resume
  confirmSession: () => set({ sessionConfirmed: true }),

  // Focus Mode
  focusMode: false,
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

  // --- 3. Authentication Actions ---

  // Initialize Auth Listener
  initializeAuth: () => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Auth State: User detected', user.uid, user.email);
        set({ currentUser: user });
        // NOTE: We do NOT set sessionConfirmed here. 
        // If it was already true (from explicit login), it stays true.
        // If it was false (refresh), it stays false -> showing SessionResumeView.
        await get().loadUserData(user.uid);
      } else {
        console.log('Auth State: No user');
        get().logout(); // Ensure clean state
      }
    });
  },

  login: async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Explicit Login -> Auto Confirm Session
      set({ sessionConfirmed: true });
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error.code, error.message);
      return { success: false, error: error.message };
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      // Reset Store to initial state
      set({
        currentUser: null,
        userData: null,
        isHydrated: false,
        isSyncing: false,
        hasUnsyncedChanges: false,
        sessionConfirmed: false,
        activeTab: 'home'
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },

  // --- 4. Data Loading & Migration ---
  loadUserData: async (uid) => {
    if (!uid) return;
    set({ isSyncing: true });

    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      let dataToLoad = null;

      if (docSnap.exists()) {
        console.log('Data loaded from Firestore');
        dataToLoad = docSnap.data();
      } else {
        console.log('No data in Firestore. Checking for local migration...');
        // Attempt Migration from old localStorage
        const oldStorage = localStorage.getItem('app-storage');
        if (oldStorage) {
          try {
            const parsed = JSON.parse(oldStorage);
            const oldState = parsed.state;
            const email = auth.currentUser?.email;
            let oldUserKey = null;
            if (email?.includes('cassio')) oldUserKey = 'cassio';
            if (email?.includes('debora')) oldUserKey = 'debora';

            if (oldUserKey && oldState.users && oldState.users[oldUserKey]) {
              console.log('Migrating local data for', oldUserKey);
              dataToLoad = oldState.users[oldUserKey];
            }
          } catch (e) {
            console.error("Migration parse error", e);
          }
        }

        // If still no data, use initial template
        if (!dataToLoad) {
          const name = auth.currentUser?.email?.includes('debora') ? 'Débora' : 'Cássio';
          dataToLoad = { ...initialUserData, name };
        }

        // Initial Save (Creation)
        await setDoc(docRef, dataToLoad);
      }

      // Check for Daily Water Reset logic before setting state
      const today = new Date().toISOString().split('T')[0];
      if (dataToLoad.nutrition?.lastResetDate !== today) {
        console.log('Daily Reset Triggered');
        dataToLoad.nutrition = {
          ...dataToLoad.nutrition,
          water: 0,
          meals: { breakfast: false, lunch: false, snack: false, dinner: false },
          lastResetDate: today
        };
        // Mark as unsynced to ensure it saves eventually
        set({ hasUnsyncedChanges: true });
      }

      set({ userData: dataToLoad });
    } catch (error) {
      console.error("Load failed:", error);
      // Fallback to initial data so app doesn't crash and we don't loop
      const name = auth.currentUser?.email?.includes('debora') ? 'Débora' : 'Cássio';
      set({ userData: { ...initialUserData, name } });
    } finally {
      // CRITICAL: Always release the loading screen
      set({ isHydrated: true, isSyncing: false });
    }
  },

  // --- 5. Sync Action ---
  // --- 5. Sync Action (Enhanced Debugging) ---
  syncData: async () => {
    const { userData, currentUser, isHydrated, isSyncing } = get();

    // Safety Guards
    if (!currentUser) {
      console.warn("AutoSync Skipped: No Current User");
      return;
    }
    if (!userData) {
      console.warn("AutoSync Skipped: No User Data");
      return;
    }
    if (!isHydrated) {
      console.warn("AutoSync Skipped: Not Hydrated");
      return;
    }
    if (isSyncing) {
      console.log("AutoSync Skipped: Already Syncing");
      return;
    }

    console.log(`[AutoSync] Starting sync for UID: ${currentUser.uid}`);
    set({ isSyncing: true });

    try {
      // 1. Sanitize Data (Deep Clean)
      // Remove undefined values to prevent Firestore rejection
      const cleanData = JSON.parse(JSON.stringify(userData));

      // 2. Log Payload for Inspection
      console.log("[AutoSync] Payload to Write:", cleanData);

      // 3. Perform Write
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, cleanData, { merge: true });

      // 4. Confirm Success
      console.log("[AutoSync] ✅ Write Confirmed by Firestore");
      set({ hasUnsyncedChanges: false, isSyncing: false });

    } catch (error) {
      console.error("❌ [AutoSync] CRITICAL WRITE ERROR:", error);
      console.error("❌ [AutoSync] Error Code:", error.code);
      console.error("❌ [AutoSync] Error Message:", error.message);

      // Keep hasUnsyncedChanges = true so it might retry later (or user can manually retry)
      // Reset isSyncing so the loop/spinner doesn't freeze the UI forever
      set({ isSyncing: false });

      // Optional: Alert user if it's a permission issue
      if (error.code === 'permission-denied') {
        alert("Erro de Permissão: Não foi possível salvar seus dados. Tente sair e entrar novamente.");
      }
    }
  },


  // --- 6. Helper to modify userData and set dirty ---
  // This reduces boilerplate in every action
  setUserData: (fn) => set((state) => {
    if (!state.userData) return state;
    const newData = fn(state.userData);
    return {
      userData: newData,
      hasUnsyncedChanges: true
    };
  }),


  // --- 7. Domain Actions (Refactored to use setUserData and operate on userData directly) ---

  addPoints: (amount) => get().setUserData(data => ({
    ...data,
    points: (data.points || 0) + amount
  })),

  updateLevel: (newLevel) => get().setUserData(data => ({
    ...data,
    level: newLevel
  })),

  addTask: (task) => get().setUserData(data => ({
    ...data,
    tasks: [...(data.tasks || []), { ...task, id: Date.now(), completed: false }]
  })),

  removeTask: (taskId) => get().setUserData(data => ({
    ...data,
    tasks: data.tasks.filter(t => t.id !== taskId)
  })),

  toggleTask: (taskId) => get().setUserData(data => {
    const tasks = [...data.tasks];
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) return data;

    const isCompleting = !tasks[index].completed;
    tasks[index] = { ...tasks[index], completed: isCompleting };

    return {
      ...data,
      tasks,
      points: (data.points || 0) + (isCompleting ? 5 : 0)
    };
  }),

  // Goals
  addGoal: (goal) => get().setUserData(data => ({
    ...data,
    goals: [...(data.goals || []), { ...goal, id: Date.now(), steps: [] }]
  })),

  removeGoal: (goalId) => get().setUserData(data => ({
    ...data,
    goals: data.goals.filter(g => g.id !== goalId)
  })),

  addGoalStep: (goalId, title) => get().setUserData(data => {
    const goals = [...data.goals];
    const index = goals.findIndex(g => g.id === goalId);
    if (index === -1) return data;

    goals[index] = {
      ...goals[index],
      steps: [...goals[index].steps, { id: Date.now(), title, completed: false }]
    };
    return { ...data, goals };
  }),

  toggleGoalStep: (goalId, stepId) => get().setUserData(data => {
    const goals = [...data.goals];
    const gIndex = goals.findIndex(g => g.id === goalId);
    if (gIndex === -1) return data;

    const steps = [...goals[gIndex].steps];
    const sIndex = steps.findIndex(s => s.id === stepId);
    if (sIndex === -1) return data;

    const isCompleting = !steps[sIndex].completed;
    steps[sIndex] = { ...steps[sIndex], completed: isCompleting };
    goals[gIndex] = { ...goals[gIndex], steps };

    return {
      ...data,
      goals,
      points: (data.points || 0) + (isCompleting ? 15 : 0)
    };
  }),

  // Workouts
  addWorkout: (workout) => get().setUserData(data => ({
    ...data,
    workouts: [...(data.workouts || []), {
      ...workout,
      id: Date.now(),
      streak: 0,
      lastCompleted: null,
      history: []
    }]
  })),

  removeWorkout: (id) => get().setUserData(data => ({
    ...data,
    workouts: data.workouts.filter(w => w.id !== id)
  })),

  toggleWorkout: (id) => get().setUserData(data => {
    const workouts = [...data.workouts];
    const index = workouts.findIndex(w => w.id === id);
    if (index === -1) return data;

    const workout = workouts[index];
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = workout.lastCompleted === today;

    if (isCompletedToday) {
      // Undo
      workouts[index] = {
        ...workout,
        lastCompleted: null,
        streak: Math.max(0, workout.streak - 1)
      };
      return {
        ...data,
        workouts,
        points: Math.max(0, (data.points || 0) - 10)
      };
    } else {
      // Complete
      workouts[index] = {
        ...workout,
        lastCompleted: today,
        streak: (workout.streak || 0) + 1,
        history: [...(workout.history || []), today]
      };
      return {
        ...data,
        workouts,
        points: (data.points || 0) + 10
      };
    }
  }),

  // Nutrition
  addWater: (amount) => get().setUserData(data => {
    const currentWater = data.nutrition?.water || 0;
    return {
      ...data,
      nutrition: {
        ...data.nutrition,
        water: currentWater + amount
      }
    };
  }),

  toggleMeal: (mealId) => get().setUserData(data => {
    const meals = { ...(data.nutrition?.meals || {}) };
    const isCompleting = !meals[mealId];
    meals[mealId] = isCompleting;

    return {
      ...data,
      nutrition: { ...data.nutrition, meals },
      points: (data.points || 0) + (isCompleting ? 5 : 0)
    };
  }),

  // Finance
  setSavingsGoal: (amount) => get().setUserData(data => ({
    ...data,
    finance: { ...data.finance, savingsGoal: amount }
  })),

  addTransaction: (tx) => get().setUserData(data => {
    const finance = data.finance || { income: 0, expenses: 0, transactions: [] };
    const transactions = [...(finance.transactions || []), { ...tx, id: Date.now() }];

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

    return {
      ...data,
      finance: { ...finance, transactions, income, expenses },
      points: (data.points || 0) + 5
    };
  }),

  removeTransaction: (id) => get().setUserData(data => {
    const finance = data.finance || { income: 0, expenses: 0, transactions: [] };
    const transactions = finance.transactions.filter(t => t.id !== id);

    const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

    return {
      ...data,
      finance: { ...finance, transactions, income, expenses }
    };
  }),

  // Dreams
  addDream: (dream) => get().setUserData(data => ({
    ...data,
    dreams: [...(data.dreams || []), { ...dream, id: Date.now() }]
  })),

  removeDream: (id) => get().setUserData(data => ({
    ...data,
    dreams: data.dreams.filter(d => d.id !== id)
  })),

  setRomanticStoryViewed: () => get().setUserData(data => ({
    ...data,
    romanticStoryViewed: true
  })),

  // Danger Zone
  resetData: () => get().setUserData(data => ({
    ...initialUserData,
    name: data.name // Keep name
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
          meals: { breakfast: false, lunch: false, snack: false, dinner: false },
          lastResetDate: today
        }
      };
    }
    return data;
  })
}));

export default useAppStore;
