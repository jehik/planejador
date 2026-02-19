import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import RomanticStory from '../components/romantic/RomanticStory';
import { User, LogOut, Moon, Sun, Trash2, Heart } from 'lucide-react';
import cassioImg from '../assets/cassio.jpeg';
import deboraImg from '../assets/debora.jpeg';

const ProfileView = () => {
    const [showStory, setShowStory] = useState(false);
    const {
        userData,
        toggleTheme,
        darkMode,
        logout,
        resetData
    } = useAppStore();

    const currentUser = userData; // Mapped from store

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja sair?')) {
            logout();
        }
    };

    const handleReset = () => {
        const confirmText = prompt('Esta ação apagará TODOS os SEUS dados. Digite "DELETAR" para confirmar:');
        if (confirmText === 'DELETAR') {
            resetData();
            alert('Seus dados foram resetados.');
        }
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Meu Perfil</h2>

            {/* User Card */}
            <div style={{
                backgroundColor: 'var(--surface-color)',
                padding: '24px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    backgroundColor: 'var(--primary-soft)',
                    border: '2px solid var(--primary-color)'
                }}>
                    <img
                        src={currentUser?.name === 'Cássio' ? cassioImg : deboraImg}
                        alt="Profile"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentUser?.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Nível {currentUser?.level || 1} • {currentUser?.points || 0} XP
                    </p>
                </div>
            </div>

            {/* Settings */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        border: 'none',
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        <span>{darkMode ? 'Modo Claro' : 'Modo Escuro'}</span>
                    </div>
                    <div style={{
                        width: '40px',
                        height: '24px',
                        backgroundColor: darkMode ? 'var(--primary-color)' : '#cbd5e1',
                        borderRadius: '12px',
                        position: 'relative',
                        transition: 'background-color 0.3s'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: darkMode ? '18px' : '2px',
                            transition: 'left 0.3s'
                        }} />
                    </div>
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '16px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        borderRadius: '16px',
                        border: '1px solid #dbeafe',
                        fontSize: '1rem',
                        boxShadow: 'var(--shadow-sm)',
                        fontWeight: '600'
                    }}
                >
                    <LogOut size={20} />
                    <span>Sair da Conta</span>
                </button>

                {/* Danger Zone */}
                <div style={{ marginTop: '32px' }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        Zona de Perigo
                    </h4>
                    <button
                        onClick={handleReset}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px',
                            backgroundColor: '#fee2e2', // Red soft
                            color: '#dc2626', // Red dark
                            borderRadius: '16px',
                            border: '1px solid #fca5a5',
                            fontSize: '1rem',
                            fontWeight: '600',
                            width: '100%'
                        }}
                    >
                        <Trash2 size={20} />
                        <span>Apagar Meus Dados</span>
                    </button>
                    <p style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        textAlign: 'center'
                    }}>
                        Isso removerá todo o progresso da sua conta.
                    </p>
                </div>
            </div>

            {/* Romantic Replay (Only for Debora) */}
            {currentUser?.name === 'Débora' && (
                <div style={{ marginTop: '60px', textAlign: 'center' }}>
                    <button
                        onClick={() => setShowStory(true)}
                        style={{
                            background: 'none',
                            border: '1px solid var(--primary-color)',
                            color: 'var(--primary-color)',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <Heart size={14} />
                        Para Você
                    </button>
                    {showStory && <RomanticStory onClose={() => setShowStory(false)} />}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <p>Planejador TDAH/Autismo v1.0</p>
                <p>Feito com ❤️ pelo amor da sua vida (Cássio)</p>
            </div>
        </div>
    );
};

export default ProfileView;
