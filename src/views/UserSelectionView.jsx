import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { auth } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { User, Lock, ArrowRight, Loader } from 'lucide-react';

const UserSelectionView = () => {
    const { login } = useAppStore();
    const [selectedUser, setSelectedUser] = useState(null); // 'cassio' | 'debora'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = selectedUser === 'cassio' ? 'cassio@app.com' : 'debora@app.com';

        const result = await login(email, password);

        if (!result.success) {
            setError('Senha incorreta ou erro de conexão.');
            setLoading(false);
        }
        // If success, App.jsx will automatically switch view due to currentUser change
    };

    const resetSelection = () => {
        setSelectedUser(null);
        setPassword('');
        setError('');
    };

    if (!selectedUser) {
        return (
            <div className="fade-in" style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 'var(--spacing-lg)',
                background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
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
                            onClick={async () => {
                                // Force logout if session exists to prevent race conditions
                                if (auth.currentUser) {
                                    console.log('Cleaning up previous session...');
                                    await signOut(auth);
                                    useAppStore.getState().logout();
                                }
                                setSelectedUser('cassio');
                            }}
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
                            onClick={async () => {
                                // Force logout if session exists
                                if (auth.currentUser) {
                                    console.log('Cleaning up previous session...');
                                    await signOut(auth);
                                    useAppStore.getState().logout();
                                }
                                setSelectedUser('debora');
                            }}
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
    }

    return (
        <div className="fade-in" style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--spacing-lg)',
            background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)',
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
                <button
                    onClick={resetSelection}
                    style={{
                        alignSelf: 'flex-start',
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.6)',
                        marginBottom: '20px',
                        cursor: 'pointer'
                    }}
                >
                    ← Voltar
                </button>

                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: selectedUser === 'cassio' ? '#EEF2FF' : '#FDF2F8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                }}>
                    <User size={40} color={selectedUser === 'cassio' ? '#4F46E5' : '#DB2777'} />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px' }}>
                    Olá, {selectedUser === 'cassio' ? 'Cássio' : 'Débora'}
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>
                    Digite sua senha para entrar
                </p>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Lock size={20} color="rgba(255,255,255,0.5)" style={{ marginRight: '12px' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            autoFocus
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '1rem',
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#ef4444', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '16px',
                            backgroundColor: selectedUser === 'cassio' ? '#4F46E5' : '#DB2777',
                            color: 'white',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? <Loader className="spin" size={20} /> : <>Entrar <ArrowRight size={20} /></>}
                    </button>
                </form>
                <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        </div>
    );
};

export default UserSelectionView;
