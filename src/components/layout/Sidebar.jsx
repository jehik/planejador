import React from 'react';
import {
  X, Home, CheckSquare, Home as HomeIcon, BookOpen,
  Plane, DollarSign, Briefcase, Coffee, Dumbbell, Heart, User, LogOut
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Sidebar = () => {
  const { isMenuOpen, closeMenu, activeTab, setActiveTab, logout } = useAppStore();

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'tasks', label: 'Tarefas do Dia', icon: CheckSquare },
    { id: 'house', label: 'Casa', icon: HomeIcon },
    { id: 'studies', label: 'Estudos', icon: BookOpen },
    { id: 'travel', label: 'Viagem', icon: Plane },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'projects', label: 'Projetos', icon: Briefcase }, // New
    { id: 'nutrition', label: 'Nutrição', icon: Coffee },
    { id: 'workouts', label: 'Treino', icon: Dumbbell },
    { id: 'relationship', label: 'Relacionamento', icon: Heart }, // New
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  const handleNavigation = (tabId) => {
    setActiveTab(tabId);
    closeMenu();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={closeMenu}
      />

      {/* Sidebar Panel */}
      <aside className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button onClick={closeMenu} className="btn btn-ghost icon-btn">
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavigation(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item logout" onClick={() => { closeMenu(); logout(); }}>
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          right: -280px; /* Hidden by default */
          width: 280px;
          height: 100vh;
          background-color: var(--surface-color);
          border-left: 1px solid var(--border-color);
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          padding: var(--spacing-lg);
          box-shadow: -5px 0 25px rgba(0,0,0,0.5);
        }

        .sidebar.open {
          transform: translateX(-280px);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 90;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }

        .sidebar-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          flex: 1;
          overflow-y: auto;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          transition: all 0.2s;
          position: relative;
          background: transparent;
          border: none;
          font-size: var(--text-base);
          cursor: pointer;
          width: 100%;
          text-align: left;
        }

        .sidebar-item:hover {
          background-color: var(--surface-hover);
          color: var(--text-primary);
        }

        .sidebar-item.active {
          background-color: rgba(124, 92, 255, 0.1);
          color: var(--primary-color);
        }

        .active-indicator {
          position: absolute;
          right: var(--spacing-md);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: var(--primary-color);
          box-shadow: 0 0 8px var(--primary-color);
        }

        .sidebar-footer {
            border-top: 1px solid var(--border-color);
            padding-top: var(--spacing-md);
        }
        
        .sidebar-item.logout:hover {
            color: var(--danger-color);
            background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
