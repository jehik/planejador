import React from 'react';
import Layout from './components/layout/Layout';
import useAppStore from './store/useAppStore';
import LevelSystem from './components/gamification/LevelSystem';
import AutoSync from './components/sync/AutoSync';

import HomeView from './views/HomeView';
import FinanceView from './views/FinanceView';
import TasksView from './views/TasksView';
import UserSelectionView from './views/UserSelectionView';
import GoalsView from './views/GoalsView';
import WorkoutsView from './views/WorkoutsView';
import NutritionView from './views/NutritionView';
import ProfileView from './views/ProfileView';
import HouseView from './views/HouseView';
import ShoppingView from './views/ShoppingView';
import StudiesView from './views/StudiesView';
import TravelView from './views/TravelView';
import SessionResumeView from './views/SessionResumeView';
import RelationshipView from './views/RelationshipView';
import ProjectsView from './views/ProjectsView';

const App = () => {
  const { activeTab, currentUser, isHydrated, initializeAuth, sessionConfirmed } = useAppStore();

  React.useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const handleFocus = () => {
      if (useAppStore.getState().isHydrated) {
        useAppStore.getState().checkDailyReset();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // Show login screen if not authenticated
  if (!currentUser) {
    return <UserSelectionView />;
  }

  // Show Session Resume if authenticated but not confirmed (Page Refresh)
  if (currentUser && !sessionConfirmed) {
    return <SessionResumeView />;
  }

  // Show loading screen if authenticated but not yet hydrated (loading data)
  if (!isHydrated) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        zIndex: 9999,
        color: 'var(--text-primary)'
      }}>
        <div className="spinner" style={{ marginBottom: '16px' }}></div>
        <p>Carregando seus dados...</p>
        <style>{`.spinner { width: 40px; height: 40px; border: 4px solid var(--primary-soft); border-top: 4px solid var(--primary-color); border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'tasks': return <TasksView />;
      case 'house': return <HouseView />;
      case 'nutrition': return <NutritionView />;
      case 'shopping': return <ShoppingView />;
      case 'studies': return <StudiesView />;
      case 'travel': return <TravelView />;
      case 'workouts': return <WorkoutsView />;
      case 'goals': return <GoalsView />;
      case 'profile': return <ProfileView />;
      case 'finance': return <FinanceView />;
      case 'relationship': return <RelationshipView />;
      case 'projects': return <ProjectsView />;
      default: return <HomeView />;
    }
  };

  return (
    <Layout>
      <LevelSystem />
      <AutoSync />
      {renderContent()}
    </Layout>
  );
};

export default App;
