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

const App = () => {
  const { activeTab, activeUser } = useAppStore();

  if (!activeUser) {
    return <UserSelectionView />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView />;
      case 'tasks': return <TasksView />;
      case 'workouts': return <WorkoutsView />;
      case 'nutrition': return <NutritionView />;
      case 'goals': return <GoalsView />;
      case 'finance':
        return <FinanceView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
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
