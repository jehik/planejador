import React from 'react';
import useAppStore from '../../store/useAppStore';
import {
    X, LayoutGrid, CheckSquare, Home, Utensils,
    ShoppingCart, BookOpen, Plane, Settings, LogOut
} from 'lucide-react';

const BottomSheetMenu = () => {
    const { isMenuOpen, closeMenu, setActiveTab, logout } = useAppStore();

    if (!isMenuOpen) return null;

    const menuItems = [
        { id: 'home', label: 'Dashboard', icon: LayoutGrid, color: '#6366F1' },
        { id: 'tasks', label: 'Tarefas', icon: CheckSquare, color: '#10B981' },
        { id: 'house', label: 'Casa', icon: Home, color: '#F59E0B' },
        { id: 'nutrition', label: 'Nutrição', icon: Utensils, color: '#EC4899' },
        { id: 'shopping', label: 'Compras', icon: ShoppingCart, color: '#3B82F6' },
        { id: 'studies', label: 'Estudos', icon: BookOpen, color: '#8B5CF6' },
        { id: 'trip', label: 'Viagem', icon: Plane, color: '#06B6D4' },
        // { id: 'finance', label: 'Finanças', icon: DollarSign, color: '#14B8A6' }, // Only if needed based on Prompt
        { id: 'profile', label: 'Configurações', icon: Settings, color: '#6B7280' },
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={closeMenu}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 2000,
                    backdropFilter: 'blur(4px)',
                    animation: 'fadeIn 0.2s ease-out'
                }}
            />

            {/* Sheet */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'var(--surface-color)',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                padding: '24px',
                zIndex: 2001,
                animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.2)',
                maxHeight: '80vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Menu</h3>
                    <button onClick={closeMenu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginBottom: '32px'
                }}>
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                closeMenu();
                            }}
                            style={{
                                background: 'var(--bg-color)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '16px',
                                padding: '16px 8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                transition: 'transform 0.1s'
                            }}
                        >
                            <div style={{
                                color: item.color,
                                backgroundColor: `${item.color}20`,
                                padding: '10px',
                                borderRadius: '12px'
                            }}>
                                <item.icon size={24} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                {item.label}
                            </span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--bg-color)',
                        border: '1px solid var(--danger-color)',
                        color: 'var(--danger-color)',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={20} />
                    Sair do App
                </button>

                <div style={{ height: '20px' }} /> {/* Padding for safe area */}
            </div>

            <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
        </>
    );
};

export default BottomSheetMenu;
