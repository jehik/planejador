import React from 'react';
import { Home, Target, DollarSign, User, ListTodo, Dumbbell, Utensils } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const BottomNav = () => {
    const { activeTab, setActiveTab, darkMode } = useAppStore();

    const navItems = [
        { id: 'home', icon: Home, label: 'Início' },
        { id: 'tasks', icon: ListTodo, label: 'Tarefas' }, // New Item
        { id: 'workouts', icon: Dumbbell, label: 'Treinos' }, // New Item
        { id: 'nutrition', icon: Utensils, label: 'Dieta' }, // New Item
        { id: 'goals', icon: Target, label: 'Metas' },
        { id: 'finance', icon: DollarSign, label: 'Finanças' },
        { id: 'profile', icon: User, label: 'Perfil' },
    ];

    return (
        <nav style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '70px',
            backgroundColor: darkMode ? 'var(--surface-color)' : '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            borderTop: '1px solid var(--border-color)',
            boxShadow: '0 -2px 10px rgba(0,0,0,0.02)',
            zIndex: 20
        }}>
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                            transition: 'color 0.2s ease',
                            padding: '8px'
                        }}
                    >
                        <Icon
                            size={24}
                            strokeWidth={isActive ? 2.5 : 2}
                        />
                        {isActive && (
                            <span style={{
                                fontSize: '10px',
                                fontWeight: '600'
                            }}>
                                {item.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
