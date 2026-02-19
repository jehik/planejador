import React from 'react';
import useAppStore from '../../store/useAppStore';
// Icons
import { CheckSquare, Home, LayoutGrid, Utensils, ShoppingCart, Menu as MenuIcon } from 'lucide-react';

const BottomNav = () => {
    const { activeTab, setActiveTab, toggleMenu } = useAppStore();

    const navItems = [
        { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
        { id: 'house', label: 'Casa', icon: Home },
        { id: 'home', label: '', icon: LayoutGrid, isCenter: true }, // Dashboard (Center)
        { id: 'nutrition', label: 'Nutrição', icon: Utensils },
        { id: 'menu', label: 'Menu', icon: MenuIcon, isAction: true }, // Triggers BottomSheet
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'var(--surface-color)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px 0',
            zIndex: 1000,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)',
            height: '80px', // Fixed height
            paddingBottom: 'max(10px, env(safe-area-inset-bottom))'
        }}>
            {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;

                if (item.isCenter) {
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                position: 'relative',
                                top: '-25px',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                border: '6px solid var(--bg-color)', // Creates "cutout" effect
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <Icon size={28} strokeWidth={2.5} />
                        </button>
                    );
                }

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
                            color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            width: '60px'
                        }}
                    >
                        <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                        <span style={{ fontSize: '0.7rem', fontWeight: isActive ? '600' : '400' }}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
