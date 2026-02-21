import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import RomanticStory from '../components/romantic/RomanticStory';
import { User, LogOut, Moon, Sun, Trash2, Heart, Shield, Settings, ArrowRight } from 'lucide-react';
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

    const currentUser = userData;

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
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 className="text-xl">Perfil</h2>
                <p className="text-sm text-secondary">Ajustes e personalização</p>
            </div>

            {/* User Card */}
            <div className="card fade-in" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '32px',
                padding: '24px',
                background: 'linear-gradient(135deg, var(--surface-color) 0%, rgba(124, 92, 255, 0.05) 100%)',
                border: '1px solid rgba(124, 92, 255, 0.1)'
            }}>
                <div style={{
                    width: '72px', height: '72px', borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid white',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    backgroundColor: 'var(--primary-color)'
                }}>
                    {currentUser?.name === 'Cássio' || currentUser?.name === 'Débora' ? (
                        <img
                            src={currentUser?.name === 'Cássio' ? cassioImg : deboraImg}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:white; font-weight:800; fontSize:1.5rem">${currentUser?.name?.charAt(0)}</div>`;
                            }}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <User size={32} />
                        </div>
                    )}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '4px' }}>{currentUser?.name || 'Usuário'}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'var(--primary-color)', color: 'white', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                            Nível {currentUser?.level || 1}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            {currentUser?.points || 0} XP acumulados
                        </span>
                    </div>
                </div>
            </div>

            {/* List Settings Style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

                <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '8px', letterSpacing: '0.05em' }}>Preferências</label>
                    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Theme Toggle */}
                        <div
                            onClick={toggleTheme}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: darkMode ? '#5856D6' : '#FF9500', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    {darkMode ? <Moon size={18} fill="currentColor" /> : <Sun size={18} fill="currentColor" />}
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: '600' }}>Modo Escuro</span>
                            </div>
                            <div style={{
                                width: '48px', height: '28px', borderRadius: '14px',
                                backgroundColor: darkMode ? '#34C759' : '#E9E9EB',
                                position: 'relative', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white',
                                    position: 'absolute', top: '2px', left: darkMode ? '22px' : '2px',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }} />
                            </div>
                        </div>

                        <button className="btn" style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', borderRadius: 0, background: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#007AFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <User size={18} />
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Editar Perfil</span>
                            </div>
                            <ArrowRight size={16} style={{ opacity: 0.3 }} />
                        </button>

                        <button className="btn" style={{ width: '100%', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 0, background: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#FF2D55', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                    <Shield size={18} />
                                </div>
                                <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>Privacidade</span>
                            </div>
                            <ArrowRight size={16} style={{ opacity: 0.3 }} />
                        </button>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '8px', letterSpacing: '0.05em' }}>Ações</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '14px',
                                backgroundColor: 'rgba(255, 59, 48, 0.08)', color: '#FF3B30',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '1rem'
                            }}
                        >
                            <LogOut size={20} />
                            Sair da Conta
                        </button>

                        <button
                            onClick={handleReset}
                            style={{
                                width: '100%', padding: '14px', borderRadius: '14px',
                                backgroundColor: 'transparent', color: 'var(--text-tertiary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                border: '1px dashed var(--border-color)', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem'
                            }}
                        >
                            <Trash2 size={16} />
                            Resetar Todos os Dados
                        </button>
                    </div>
                </div>
            </div>

            {/* Romantic Section */}
            {currentUser?.name === 'Débora' && (
                <div className="fade-in" style={{ marginTop: '48px', padding: '32px 24px', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.02) 100%)', border: '1px solid rgba(236, 72, 153, 0.2)', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(236, 72, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899', margin: '0 auto 16px' }}>
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#EC4899', marginBottom: '8px' }}>Espaço Especial</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>Relembre nossa jornada e cada momento que construímos juntos.</p>
                    <button
                        onClick={() => setShowStory(true)}
                        style={{
                            backgroundColor: '#EC4899', color: 'white', padding: '12px 24px', borderRadius: '16px',
                            border: 'none', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                        }}
                    >
                        Nossa História
                    </button>
                    {showStory && <RomanticStory onClose={() => setShowStory(false)} />}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '64px', opacity: 0.3 }}>
                <p style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Planejador Ultra Premium v2.0</p>
                <p style={{ marginTop: '4px', fontSize: '0.8rem' }}>Feito com ❤️ por Cássio</p>
            </div>
        </div>
    );
};

export default ProfileView;

