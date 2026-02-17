import React from 'react';
import useAppStore from '../store/useAppStore';
import { User } from 'lucide-react';

const UserSelectionView = () => {
    const { setActiveUser } = useAppStore();

    const handleSelect = (user) => {
        setActiveUser(user);
    };

    return (
        <div className="fade-in" style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)', // Premium Purple/Indigo Gradient
            color: 'white',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999
        }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '40px 30px',
                borderRadius: '30px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    marginBottom: '8px',
                    color: '#FFF',
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}>
                    Antigravity
                </h1>
                <p style={{
                    marginBottom: '40px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '1.1rem',
                    fontWeight: '500'
                }}>
                    Quem está focando hoje?
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                    <button
                        onClick={() => handleSelect('cassio')}
                        style={{
                            padding: '18px 24px',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            padding: '12px',
                            borderRadius: '16px',
                            backgroundColor: '#EEF2FF',
                            color: '#4F46E5'
                        }}>
                            <User size={24} />
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1F2937' }}>Cássio</span>
                    </button>

                    <button
                        onClick={() => handleSelect('debora')}
                        style={{
                            padding: '18px 24px',
                            borderRadius: '20px',
                            backgroundColor: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            width: '100%'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            padding: '12px',
                            borderRadius: '16px',
                            backgroundColor: '#FDF2F8',
                            color: '#DB2777'
                        }}>
                            <User size={24} />
                        </div>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1F2937' }}>Débora</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserSelectionView;
