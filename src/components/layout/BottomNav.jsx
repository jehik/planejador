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
        <div className="bottom-nav glass" style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-around',
            paddingTop: '10px',
            paddingBottom: 'calc(10px + var(--safe-area-bottom))',
            zIndex: 1100,
            borderTop: 'none', // handeled by .glass
            boxShadow: '0 -2px 10px rgba(0,0,0,0.02)',
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
                            gap: '2px',
                            color: isActive ? 'var(--primary-color)' : '#9BA1A6',
                            cursor: 'pointer',
                            flex: 1,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isActive ? 'translateY(-2px)' : 'none'
                        }}
                    >
                        <div style={{
                            padding: '6px 16px',
                            borderRadius: '16px',
                            backgroundColor: isActive ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2px'
                        }}>
                            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                        </div>
                        <span style={{
                            fontSize: '0.65rem',
                            fontWeight: isActive ? '700' : '500',
                            letterSpacing: '0.01em'
                        }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
