import React from 'react';
import useAppStore from '../store/useAppStore';
import { User, LogOut, ArrowRight } from 'lucide-react';

const SessionResumeView = () => {
    const { currentUser, logout, confirmSession } = useAppStore();

    // Determine user name based on email for display
    const userName = currentUser?.email?.includes('debora') ? 'Débora' : 'Cássio';
    const isCassio = userName === 'Cássio';

    return (
        <div className="fade-in" style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--spacing-lg)',
            background: isCassio
                ? 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)' // Cassio Theme
                : 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', // Debora Theme (or Dark) - actually let's match UserSelect
            // Wait, UserSelect uses one gradient for background, and buttons have specific colors.
            // Let's use a neutralized premium dark gradient for the resume screen to match the "system" feel.
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '40px 30px',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: isCassio ? '#EEF2FF' : '#FDF2F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '24px',
                    boxShadow: '0 0 20px rgba(255,255,255,0.1)'
                }}>
                    <User size={40} color={isCassio ? '#4F46E5' : '#DB2777'} />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', textAlign: 'center' }}>
                    Sessão Ativa
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', textAlign: 'center', lineHeight: '1.5' }}>
                    Você já está conectado como<br />
                    <strong style={{ color: 'white', fontSize: '1.1rem' }}>{userName}</strong> ({currentUser?.email})
                </p>

                <button
                    onClick={confirmSession}
                    style={{
                        width: '100%',
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: '#10B981', // Success Green
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
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
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
