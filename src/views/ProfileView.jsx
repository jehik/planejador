import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import RomanticStory from '../components/romantic/RomanticStory';
import { User, LogOut, Moon, Sun, Trash2, Heart, Shield, Settings } from 'lucide-react';
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
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '24px' }}>Meu Perfil</h2>

            {/* User Card */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    overflow: 'hidden',
                    border: '2px solid var(--primary-color)',
                    boxShadow: '0 0 10px rgba(124, 92, 255, 0.2)'
                }}>
                    {/* Fallback if images fail, or use icons */}
                    {currentUser?.name === 'Cássio' || currentUser?.name === 'Débora' ? (
                        <img
                            src={currentUser?.name === 'Cássio' ? cassioImg : deboraImg}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = 'var(--primary-color)'; e.target.parentNode.innerHTML = '<span style="font-size:1.5rem; color:white; font-weight:bold; display:flex; align-items:center; justify-content:center; width:100%; height:100%">' + (currentUser?.name?.charAt(0) || 'U') + '</span>'; }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>
                            {currentUser?.name?.charAt(0) || <User />}
                        </div>
                    )}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentUser?.name || 'Usuário'}</h3>
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
                    className="card btn"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px', width: '100%', textAlign: 'left'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                        <span style={{ fontSize: '1rem', fontWeight: '500' }}>{darkMode ? 'Modo Escuro' : 'Modo Claro'}</span>
                    </div>
                    <div style={{
                        width: '40px', height: '22px', borderRadius: '11px',
                        backgroundColor: darkMode ? 'var(--primary-color)' : 'var(--border-color)',
                        position: 'relative', transition: 'background 0.3s'
                    }}>
                        <div style={{
                            width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white',
                            position: 'absolute', top: '2px', left: darkMode ? '20px' : '2px',
                            transition: 'left 0.3s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                        }} />
                    </div>
                </button>

                {/* Account Settings (Mock) */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <button className="btn btn-ghost" style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', borderRadius: 0 }}>
                        <User size={20} /> <span>Editar Dados</span>
                    </button>
                    <button className="btn btn-ghost" style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid var(--border-color)', borderRadius: 0 }}>
                        <Shield size={20} /> <span>Privacidade</span>
                    </button>
                    <button className="btn btn-ghost" style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: 0 }}>
                        <Settings size={20} /> <span>Preferências</span>
                    </button>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="btn"
                    style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                        padding: '16px', borderRadius: '16px',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)',
                        border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: '600'
                    }}
                >
                    <LogOut size={20} />
                    <span>Sair da Conta</span>
                </button>

                {/* Danger Zone */}
                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={handleReset}
                        className="btn"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            padding: '12px', width: '100%',
                            backgroundColor: 'transparent', color: 'var(--text-secondary)',
                            border: '1px dashed var(--border-color)', fontSize: '0.9rem'
                        }}
                    >
                        <Trash2 size={16} />
                        <span>Resetar Dados (Zona de Perigo)</span>
                    </button>
                </div>
            </div>

            {/* Romantic Replay (Only for Debora) */}
            {currentUser?.name === 'Débora' && (
                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <button
                        onClick={() => setShowStory(true)}
                        className="btn"
                        style={{
                            background: 'rgba(236, 72, 153, 0.1)', color: '#EC4899',
                            border: '1px solid rgba(236, 72, 153, 0.2)',
                            borderRadius: '20px', padding: '10px 20px',
                            display: 'inline-flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <Heart size={16} fill="currentColor" />
                        <span>Nossa História</span>
                    </button>
                    {showStory && <RomanticStory onClose={() => setShowStory(false)} />}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                <p>Planejador Ultra Premium v2.0</p>
                <p style={{ marginTop: '4px' }}>Feito com ❤️ para você</p>
            </div>
        </div>
    );
};

export default ProfileView;

