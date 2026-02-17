import React, { useState } from 'react';
import { User, LogOut, Moon, Sun, Trash2, ShieldAlert, Heart, Cloud, CloudDownload } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import RomanticStory from '../components/romantic/RomanticStory';

const ProfileView = () => {
    const [showStory, setShowStory] = useState(false);
    const {
        activeUser,
        users,
        toggleTheme,
        darkMode,
        setActiveUser,
        resetData
    } = useAppStore();

    const currentUser = users[activeUser];

    const handleLogout = () => {
        if (window.confirm('Tem certeza que deseja trocar de usuário?')) {
            setActiveUser(null);
        }
    };

    const handleReset = () => {
        const confirmText = prompt('Esta ação apagará TODOS os dados de TODOS os usuários. Digite "DELETAR" para confirmar:');
        if (confirmText === 'DELETAR') {
            resetData();
            alert('Dados resetados com sucesso.');
            window.location.reload();
        }
    };

    const handleSync = async () => {
        if (!confirm('Deseja salvar seus dados atuais na nuvem? Isso substituirá o backup anterior.')) return;
        const success = await useAppStore.getState().syncToCloud();
        if (success) alert('Dados salvos na nuvem com sucesso! ☁️');
        else alert('Erro ao salvar. Verifique sua conexão.');
    };

    const handleLoad = async () => {
        if (!confirm('Deseja carregar os dados da nuvem? Isso substituirá seus dados locais atuais.')) return;
        const success = await useAppStore.getState().loadFromCloud();
        if (success) {
            alert('Dados carregados com sucesso! 🔄');
            window.location.reload();
        }
        else alert('Erro ao carregar ou nenhum backup encontrado.');
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
                    backgroundColor: 'var(--primary-soft)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <User size={32} color="var(--primary-color)" />
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{currentUser?.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Nível {currentUser?.level || 1} • {currentUser?.points || 0} XP
                    </p>
                </div>
            </div>

            {/* Romantic Replay for Debora */}
            {currentUser?.name === 'Débora' && currentUser?.romanticStoryViewed && (
                <div style={{ marginBottom: '24px' }}>
                    <button
                        onClick={() => window.location.href = '/?story=true'} // Hacky way to trigger story? No, better use store or local state lifted. 
                    // Wait, I can't easily lift state to App without props drilling or store.
                    // Ideally I should put the story renderer in App.jsx or Layout.
                    // For simplicity, I will duplicate the renderer here or keep it simple.
                    // Actually, let's make it a local state here too. logic needs to be consistent.
                    // Okay, I will implement a local state toggle here for re-watching.
                    // I need to import RomanticStory here too.
                    />
                </div>
            )}

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
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        border: 'none',
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <LogOut size={20} />
                    <span>Trocar de Usuário</span>
                </button>

                {/* Cloud Sync */}
                <div style={{ marginTop: '16px' }}>
                    <h4 style={{
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px',
                        fontWeight: '600'
                    }}>
                        Backup & Sincronização
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <button
                            onClick={handleSync}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '16px',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                borderRadius: '16px',
                                border: '1px solid #a7f3d0',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            <Cloud size={24} />
                            <span>Salvar</span>
                        </button>
                        <button
                            onClick={handleLoad}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '16px',
                                backgroundColor: '#eff6ff',
                                color: '#2563eb',
                                borderRadius: '16px',
                                border: '1px solid #bfdbfe',
                                fontSize: '0.9rem',
                                fontWeight: '600'
                            }}
                        >
                            <CloudDownload size={24} />
                            <span>Carregar</span>
                        </button>
                    </div>
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        textAlign: 'center'
                    }}>
                        Use para sincronizar entre PC e Celular.
                    </p>
                </div>

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
                        <span>Apagar Todos os Dados</span>
                    </button>
                    <p style={{
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        textAlign: 'center'
                    }}>
                        Isso removerá todo o progresso de Cássio e Débora.
                    </p>
                </div>
            </div>

            {/* Romantic Replay (Only for Debora) */}
            {currentUser?.name === 'Débora' && (
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
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
