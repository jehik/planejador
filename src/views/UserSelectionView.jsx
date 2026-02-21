import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { auth } from '../firebase.config';
import { signOut } from 'firebase/auth';
import { User, Lock, ArrowRight, Loader } from 'lucide-react';

// Assets (User must place these in public folder or src/assets)
// Using absolute paths if in public, or imports if in src/assets
// Let's assume they might be in src/assets/
import cassioImg from '../assets/cassio.jpeg';
import deboraImg from '../assets/debora.jpeg';

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
                width: '100vw', height: '100vh',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                padding: '32px',
                backgroundColor: 'var(--bg-color)',
                position: 'fixed', top: 0, left: 0, zIndex: 9999
            }}>
                {/* Background Decor */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 92, 255, 0.05) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }}></div>

                <div style={{ width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '48px' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.06em', color: 'var(--text-primary)', lineHeight: '1' }}>
                            Bem-vindo de volta
                        </h1>
                        <p style={{ marginTop: '12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '1rem' }}>
                            Escolha seu perfil para continuar
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%' }}>
                        <div
                            onClick={async () => {
                                if (auth.currentUser) { await signOut(auth); useAppStore.getState().logout(); }
                                setSelectedUser('cassio');
                            }}
                            className="card fade-in"
                            style={{
                                cursor: 'pointer', padding: '24px 16px', borderRadius: '32px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                                border: '1px solid var(--border-color)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
                            }}
                        >
                            <div style={{ width: '80px', height: '80px', borderRadius: '28px', overflow: 'hidden', border: '2px solid rgba(79, 70, 229, 0.1)', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.1)' }}>
                                <img src={cassioImg} alt="Cássio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#EEF2FF' }} />
                                {!cassioImg && <User size={40} color="#4F46E5" />}
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Cássio</span>
                        </div>

                        <div
                            onClick={async () => {
                                if (auth.currentUser) { await signOut(auth); useAppStore.getState().logout(); }
                                setSelectedUser('debora');
                            }}
                            className="card fade-in"
                            style={{
                                cursor: 'pointer', padding: '24px 16px', borderRadius: '32px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
                                border: '1px solid var(--border-color)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
                            }}
                        >
                            <div style={{ width: '80px', height: '80px', borderRadius: '28px', overflow: 'hidden', border: '2px solid rgba(219, 39, 119, 0.1)', boxShadow: '0 10px 20px rgba(219, 39, 119, 0.1)' }}>
                                <img src={deboraImg} alt="Débora" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.style.backgroundColor = '#FDF2F8' }} />
                                {!deboraImg && <User size={40} color="#DB2777" />}
                            </div>
                            <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Débora</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isCassio = selectedUser === 'cassio';

    return (
        <div className="fade-in" style={{
            width: '100vw', height: '100vh',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            padding: '32px', backgroundColor: 'var(--bg-color)',
            position: 'fixed', top: 0, left: 0, zIndex: 9999
        }}>
            <div style={{ width: '100%', maxWidth: '340px', textAlign: 'center' }}>
                <button
                    onClick={resetSelection}
                    style={{ position: 'fixed', top: '32px', left: '32px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} /> Voltar
                </button>

                <div style={{ width: '100px', height: '100px', borderRadius: '36px', overflow: 'hidden', margin: '0 auto 24px', border: `3px solid ${isCassio ? '#4F46E5' : '#DB2777'}`, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                    <img src={isCassio ? cassioImg : deboraImg} alt={selectedUser} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '8px' }}>
                    Olá, {isCassio ? 'Cássio' : 'Débora'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '40px' }}>
                    Digite sua senha mestra
                </p>

                <form onSubmit={handleLogin}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        backgroundColor: 'var(--surface-color)', borderRadius: '20px', padding: '16px 20px',
                        marginBottom: '24px', border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                    }}>
                        <Lock size={20} color="var(--text-secondary)" style={{ marginRight: '16px', opacity: 0.5 }} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Sua senha"
                            autoFocus
                            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', width: '100%', outline: 'none', fontWeight: '600' }}
                        />
                    </div>

                    {error && <p style={{ color: 'var(--danger-color)', marginBottom: '24px', fontSize: '0.9rem', fontWeight: '700' }}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '18px', borderRadius: '20px',
                            backgroundColor: 'var(--text-primary)', color: 'white',
                            border: 'none', fontSize: '1.1rem', fontWeight: '800',
                            cursor: loading ? 'wait' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                            opacity: loading ? 0.7 : 1, boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                        }}
                    >
                        {loading ? <Loader className="spin" size={24} /> : <>Entrar <ArrowRight size={24} strokeWidth={3} /></>}
                    </button>
                    {loading && <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>}
                </form>
            </div>
        </div>
    );
};

export default UserSelectionView;
