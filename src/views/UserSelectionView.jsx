import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { auth } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { User, Lock, ArrowRight, Loader } from 'lucide-react';

// Assets (User must place these in public folder or src/assets)
// Using absolute paths if in public, or imports if in src/assets
// Let's assume they might be in src/assets/
import cassioImg from '../assets/cassio.jpg';
import deboraImg from '../assets/debora.jpg';

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
                backgroundColor: 'var(--bg-color)', // Dashboard Match
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
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '8px',
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        lineHeight: '1.2'
                    }}>
                        Planejador<br />
                        <span style={{ color: 'var(--primary-color)' }}>Cássio / Débora</span>
                    </h1>
                    <p style={{
                        marginBottom: '40px',
                        color: 'var(--text-secondary)',
                        fontSize: '1rem',
                        textAlign: 'center'
                    }}>
                        Quem está focando hoje?
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
                        <button
                            onClick={async () => {
                                if (auth.currentUser) {
                                    await signOut(auth);
                                    useAppStore.getState().logout();
                                }
                                setSelectedUser('cassio');
                            }}
                            className="selection-btn"
                            style={{
                                padding: '16px',
                                borderRadius: '20px',
                                backgroundColor: 'var(--surface-color)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: 'var(--shadow-sm)',
                                width: '100%'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid #EEF2FF'
                            }}>
                                <img src={cassioImg} alt="Cássio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#EEF2FF' }} />
                            </div>
                            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Cássio</span>
                        </button>

                        <button
                            onClick={async () => {
                                if (auth.currentUser) {
                                    await signOut(auth);
                                    useAppStore.getState().logout();
                                }
                                setSelectedUser('debora');
                            }}
                            className="selection-btn"
                            style={{
                                padding: '16px',
                                borderRadius: '20px',
                                backgroundColor: 'var(--surface-color)',
                                border: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: 'var(--shadow-sm)',
                                width: '100%'
                            }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '2px solid #FDF2F8'
                            }}>
                                <img src={deboraImg} alt="Débora" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#FDF2F8' }} />
                            </div>
                            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Débora</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Login Form View
    const isCassio = selectedUser === 'cassio';

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
                <button
                    onClick={resetSelection}
                    style={{
                        alignSelf: 'flex-start',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        marginBottom: '20px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}
                >
                    ← Voltar
                </button>

                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    marginBottom: '20px',
                    boxShadow: 'var(--shadow-md)',
                    border: `3px solid ${isCassio ? '#4F46E5' : '#DB2777'}`
                }}>
                    <img
                        src={isCassio ? cassioImg : deboraImg}
                        alt={selectedUser}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Olá, {isCassio ? 'Cássio' : 'Débora'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    Digite sua senha para entrar
                </p>

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        padding: '16px',
                        marginBottom: '20px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Lock size={20} color="var(--text-secondary)" style={{ marginRight: '12px' }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Senha"
                            autoFocus
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                width: '100%',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--danger-color)', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
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
                            backgroundColor: isCassio ? '#4F46E5' : '#DB2777',
                            color: 'white',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            opacity: loading ? 0.7 : 1,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
