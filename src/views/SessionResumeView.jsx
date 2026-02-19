import React from 'react';
import useAppStore from '../store/useAppStore';
import { LogOut, ArrowRight } from 'lucide-react';
import cassioImg from '../assets/cassio.jpeg';
import deboraImg from '../assets/debora.jpeg';

const SessionResumeView = () => {
    const { currentUser, logout, confirmSession } = useAppStore();

    // Determine user name based on email for display
    const userName = currentUser?.email?.includes('debora') ? 'Débora' : 'Cássio';
    const isCassio = userName === 'Cássio';
    const userImg = isCassio ? cassioImg : deboraImg;

    return (
        <div className="fade-in" style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-primary)',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '24px',
                    boxShadow: 'var(--shadow-md)',
                    border: `3px solid ${isCassio ? '#4F46E5' : '#DB2777'}`
                }}>
                    <img src={userImg} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center', color: 'var(--text-primary)' }}>
                    Sessão Ativa
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'center', lineHeight: '1.5' }}>
                    Você já está conectado como<br />
                    <strong style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}>{userName}</strong>
                </p>

                <button
                    onClick={confirmSession}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--success-color)', // Green for go
                        color: 'white',
                        border: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        marginBottom: '16px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                >
                    Continuar <ArrowRight size={20} />
                </button>

                <button
                    onClick={logout}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-color)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                >
                    <LogOut size={20} />
                    Trocar Usuário
                </button>

            </div>
        </div>
    );
};

export default SessionResumeView;
