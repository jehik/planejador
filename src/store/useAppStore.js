import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  goals: [
    {
      id: 1,
      title: 'Ler um livro',
      type: 'growth',
      deadline: '2026-12-31',
      steps: [
        { id: 1, title: 'Comprar livro', completed: false },
        { id: 2, title: 'Ler cap 1', completed: false },
        { id: 3, title: 'Ler cap 2', completed: false }
      ]
    }
  ],
  workouts: [
    { id: 1, title: 'Caminhada 30min', days: ['Seg', 'Qua', 'Sex'], streak: 2, lastCompleted: '2026-02-16' }
  ],
  nutrition: {
    water: 0,
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

const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme State
      darkMode: false,
      toggleTheme: () => set((state) => {
        const newMode = !state.darkMode;
        document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
        return { darkMode: newMode };
      }),

      // Navigation State
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Focus Mode State
      focusMode: false,
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),

      // User Data System
      activeUser: null,
      users: {
        cassio: { ...initialUserData, name: 'Cássio' },
        debora: { ...initialUserData, name: 'Débora' }
      },

      setActiveUser: (userId) => set({ activeUser: userId }),

      // Actions (operate on active user)
      addPoints: (amount) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: { ...currentUser, points: (currentUser.points || 0) + amount }
          }
        };
      }),

      addTask: (task) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              tasks: [...(currentUser.tasks || []), { ...task, id: Date.now(), completed: false }]
            }
          }
        };
      }),

      removeTask: (taskId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              tasks: currentUser.tasks.filter(t => t.id !== taskId)
            }
          }
        };
      }),

      toggleTask: (taskId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];

        const taskIndex = currentUser.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return state;

        const updatedTasks = [...currentUser.tasks];
        const isCompleting = !updatedTasks[taskIndex].completed;
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed: isCompleting };

        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              tasks: updatedTasks,
              points: (currentUser.points || 0) + (isCompleting ? 5 : 0)
            }
          }
        };
      }),

      // Goals Actions
      addGoal: (goal) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              goals: [...(currentUser.goals || []), { ...goal, id: Date.now(), steps: [] }]
            }
          }
        };
      }),

      removeGoal: (goalId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              goals: currentUser.goals.filter(g => g.id !== goalId)
            }
          }
        };
      }),

      addGoalStep: (goalId, stepTitle) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];

        const goalIndex = currentUser.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return state;

        const updatedGoals = [...currentUser.goals];
        updatedGoals[goalIndex] = {
          ...updatedGoals[goalIndex],
          steps: [...updatedGoals[goalIndex].steps, { id: Date.now(), title: stepTitle, completed: false }]
        };

        return {
          users: {
            ...state.users,
            [userId]: { ...currentUser, goals: updatedGoals }
          }
        };
      }),

      toggleGoalStep: (goalId, stepId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];

        const goalIndex = currentUser.goals.findIndex(g => g.id === goalId);
        if (goalIndex === -1) return state;

        const updatedGoals = [...currentUser.goals];
        const activeGoal = updatedGoals[goalIndex];
        const stepIndex = activeGoal.steps.findIndex(s => s.id === stepId);

        if (stepIndex === -1) return state;

        const updatedSteps = [...activeGoal.steps];
        const isCompleting = !updatedSteps[stepIndex].completed;
        updatedSteps[stepIndex] = { ...updatedSteps[stepIndex], completed: isCompleting };

        activeGoal.steps = updatedSteps;

        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              goals: updatedGoals,
              points: (currentUser.points || 0) + (isCompleting ? 15 : 0) // +15 points per step
            }
          }
        };
      }),

      // Workout Actions
      addWorkout: (workout) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              workouts: [...(currentUser.workouts || []), {
                ...workout,
                id: Date.now(),
                streak: 0,
                lastCompleted: null,
                history: [] // dates completed
              }]
            }
          }
        };
      }),

      removeWorkout: (workoutId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              workouts: currentUser.workouts.filter(w => w.id !== workoutId)
            }
          }
        };
      }),
      toggleWorkout: (workoutId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];

        const workoutIndex = currentUser.workouts.findIndex(w => w.id === workoutId);
        if (workoutIndex === -1) return state;

        const updatedWorkouts = [...currentUser.workouts];
        const workout = updatedWorkouts[workoutIndex];

        const today = new Date().toISOString().split('T')[0];
        const isCompletedToday = workout.lastCompleted === today;

        if (isCompletedToday) {
          // Undo completion
          updatedWorkouts[workoutIndex] = {
            ...workout,
            lastCompleted: null, // simplistic undo, usually would check history
            streak: Math.max(0, workout.streak - 1)
          };
          return {
            users: {
              ...state.users,
              [userId]: {
                ...currentUser,
                workouts: updatedWorkouts,
                points: Math.max(0, (currentUser.points || 0) - 10) // Remove points
              }
            }
          };
        } else {
          // Complete workout
          updatedWorkouts[workoutIndex] = {
            ...workout,
            lastCompleted: today,
            streak: (workout.streak || 0) + 1,
            history: [...(workout.history || []), today]
          };
          return {
            users: {
              ...state.users,
              [userId]: {
                ...currentUser,
                workouts: updatedWorkouts,
                points: (currentUser.points || 0) + 10 // +10 points per workout
              }
            }
          };
        }
      }),

      // Nutrition Actions
      addWater: (amount) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        const currentWater = currentUser.nutrition?.water || 0;
        const newWater = Math.min(4000, currentWater + amount); // Cap at 4L visual target? No, allow more but target is 4000.

        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              nutrition: { ...currentUser.nutrition, water: newWater }
            }
          }
        };
      }),

      toggleMeal: (mealId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        const currentMeals = currentUser.nutrition?.meals || {};
        const isCompleting = !currentMeals[mealId];

        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              nutrition: {
                ...currentUser.nutrition,
                meals: { ...currentMeals, [mealId]: isCompleting }
              },
              points: (currentUser.points || 0) + (isCompleting ? 5 : 0) // +5 points per healthy meal check
            }
          }
        };
      }),

      // Finance Actions
      setSavingsGoal: (amount) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              finance: { ...currentUser.finance, savingsGoal: amount }
            }
          }
        };
      }),

      addTransaction: (transaction) => set((state) => { // transaction: { type: 'expense'|'income', amount, description, date }
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        const currentFinance = currentUser.finance || { income: 0, expenses: 0, transactions: [] };

        const newTransactions = [...(currentFinance.transactions || []), { ...transaction, id: Date.now() }];

        // Recalculate totals
        const newIncome = newTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const newExpenses = newTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              finance: {
                ...currentFinance,
                income: newIncome,
                expenses: newExpenses,
                transactions: newTransactions
              },
              points: (currentUser.points || 0) + 5 // +5 points for tracking finances
            }
          }
        };
      }),

      removeTransaction: (transactionId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        const currentFinance = currentUser.finance || { income: 0, expenses: 0, transactions: [] };

        const newTransactions = currentFinance.transactions.filter(t => t.id !== transactionId);

        // Recalculate totals
        const newIncome = newTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const newExpenses = newTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              finance: {
                ...currentFinance,
                income: newIncome,
                expenses: newExpenses,
                transactions: newTransactions
              }
            }
          }
        };
      }),

      // Dream Actions
      addDream: (dream) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              dreams: [...(currentUser.dreams || []), { ...dream, id: Date.now() }]
            }
          }
        };
      }),

      removeDream: (dreamId) => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: {
              ...currentUser,
              dreams: currentUser.dreams.filter(d => d.id !== dreamId)
            }
          }
        };
      }),

      setRomanticStoryViewed: () => set((state) => {
        const userId = state.activeUser;
        if (!userId) return state;
        const currentUser = state.users[userId];
        return {
          users: {
            ...state.users,
            [userId]: { ...currentUser, romanticStoryViewed: true }
          }
        };
      }),

      resetData: () => set(() => ({
        activeUser: null,
        users: {
          cassio: { ...initialUserData, name: 'Cássio' },
          debora: { ...initialUserData, name: 'Débora' }
        }
      })),

      // Cloud Sync
      syncToCloud: async () => {
        const state = get();
        const userId = state.activeUser;
        if (!userId) return false;

        const currentUserData = state.users[userId];
        try {
          // Dynamically import to avoid circular dependencies if any, though explicit import is better
          const { saveUserToCloud } = await import('../services/cloudSyncService');
          const success = await saveUserToCloud(userId, currentUserData);
          return success;
        } catch (error) {
          console.error("Sync failed:", error);
          return false;
        }
      }
    }),
    {
      name: 'app-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useAppStore;
