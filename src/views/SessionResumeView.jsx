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
            width: '100vw', height: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            padding: '32px', backgroundColor: 'var(--bg-color)',
            position: 'fixed', top: 0, left: 0, zIndex: 9999
        }}>
            {/* Background Decor */}
            <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '40vh', background: `linear-gradient(to bottom, ${isCassio ? 'rgba(79, 70, 229, 0.05)' : 'rgba(236, 72, 153, 0.05)'}, transparent)`, zIndex: -1 }}></div>

            <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 32px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '40px', overflow: 'hidden', border: `3px solid ${isCassio ? '#4F46E5' : '#DB2777'}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                        <img src={userImg} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#34C759', border: '4px solid var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'white' }}></div>
                    </div>
                </div>

                <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-0.06em', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Sessão Ativa
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '48px', lineHeight: '1.4' }}>
                    Você está conectado como <span style={{ color: isCassio ? '#4F46E5' : '#DB2777', fontWeight: '800' }}>{userName}</span>
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <button
                        onClick={confirmSession}
                        style={{
                            width: '100%', padding: '20px', borderRadius: '24px',
                            backgroundColor: 'var(--text-primary)', color: 'white',
                            border: 'none', fontSize: '1.1rem', fontWeight: '800',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.1)', transition: 'transform 0.2s'
                        }}
                    >
                        Continuar Planejamento <ArrowRight size={22} strokeWidth={3} />
                    </button>

                    <button
                        onClick={logout}
                        style={{
                            width: '100%', padding: '18px', borderRadius: '24px',
                            backgroundColor: 'transparent', color: 'var(--text-secondary)',
                            border: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: '700',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                        }}
                    >
                        <LogOut size={20} />
                        Trocar Perfil
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionResumeView;
