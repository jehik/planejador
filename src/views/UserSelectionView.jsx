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
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--bg-color)',
            color: 'var(--text-primary)'
        }}>
            <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: 'var(--spacing-md)',
                color: 'var(--primary-color)'
            }}>
                Bem-vindo
            </h1>
            <p style={{
                marginBottom: '40px',
                color: 'var(--text-secondary)',
                fontSize: '1.2rem'
            }}>
                Quem está focando hoje?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '300px' }}>
                <button
                    onClick={() => handleSelect('cassio')}
                    style={{
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-color)',
                        border: '2px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <div style={{
                        padding: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-soft)',
                        color: 'var(--primary-color)'
                    }}>
                        <User size={24} />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Cássio</span>
                </button>

                <button
                    onClick={() => handleSelect('debora')}
                    style={{
                        padding: '20px',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--surface-color)',
                        border: '2px solid var(--border-color)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <div style={{
                        padding: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#FCE7F3', // Pink-soft
                        color: '#DB2777' // Pink-600
                    }}>
                        <User size={24} />
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Débora</span>
                </button>
            </div>
        </div>
    );
};

export default UserSelectionView;
