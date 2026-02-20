import React from 'react';
import useAppStore from '../../store/useAppStore';
import { Home, Folder, Plane, Menu as MenuIcon } from 'lucide-react';

const BottomNav = () => {
    const { activeTab, setActiveTab, toggleMenu } = useAppStore();

    const navItems = [
        { id: 'home', label: 'Início', icon: Home },
        { id: 'projects', label: 'Projetos', icon: Folder },
        { id: 'travel', label: 'Viagem', icon: Plane },
        { id: 'menu', label: 'Menu', icon: MenuIcon, isAction: true },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'var(--bg-color)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: '12px',
            paddingBottom: 'calc(12px + var(--safe-area-bottom))',
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.03)',
        }}>
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                return (
                    <button
                        key={item.id}
                        onClick={() => item.isAction ? toggleMenu() : setActiveTab(item.id)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            color: isActive ? 'var(--primary-color)' : 'var(--text-tertiary)',
                            cursor: 'pointer',
                            flex: 1,
                            paddingBottom: '4px'
                        }}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{ fontSize: '0.7rem', fontWeight: isActive ? '600' : '500' }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
