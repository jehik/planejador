import React from 'react';
import { Moon, Sun } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const Header = () => {
    const { darkMode, toggleTheme, userData } = useAppStore();
    const user = userData || { name: 'Visitante' }; // Safety fallback

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <header style={{
            padding: 'var(--spacing-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-color)',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div>
                <h1 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-primary)'
                }}>
                    {getGreeting()}, {user.name}
                </h1>
                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-secondary)'
                }}>
                    Pronto para focar?
                </p>
            </div>

            <button
                onClick={toggleTheme}
                aria-label="Alternar Modo Escuro"
                style={{
                    padding: 'var(--spacing-sm)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: darkMode ? 'var(--surface-color)' : 'var(--primary-soft)',
                    color: darkMode ? 'var(--primary-color)' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </header>
    );
};

export default Header;
