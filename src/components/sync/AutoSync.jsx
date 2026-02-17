import React, { useEffect, useRef, useState } from 'react';
import useAppStore from '../../store/useAppStore';
import { Cloud, CheckCircle, RefreshCw } from 'lucide-react';

const AutoSync = () => {
    const { activeUser, syncToCloud } = useAppStore();
    const [status, setStatus] = useState('idle'); // idle, syncing, saved, error
    const timeoutRef = useRef(null);
    const lastSavedData = useRef(null);

    useEffect(() => {
        // Subscribe to store changes specifically for the active user
        const unsubscribe = useAppStore.subscribe(
            (state) => state.users[activeUser],
            (currentUserData) => {
                if (!activeUser || !currentUserData) return;

                // Simple check to avoid saving if data hasn't actually changed 
                // (Zustand might trigger reference updates, JSON stringify is a quick way to check deep equality for this scale)
                const currentString = JSON.stringify(currentUserData);
                if (lastSavedData.current === currentString) return;

                setStatus('pending');

                // Debounce save (wait 5 seconds of inactivity)
                if (timeoutRef.current) clearTimeout(timeoutRef.current);

                timeoutRef.current = setTimeout(async () => {
                    setStatus('syncing');
                    try {
                        const success = await syncToCloud();
                        if (success) {
                            setStatus('saved');
                            lastSavedData.current = currentString;
                            // Reset to idle after a few seconds so the "Saved" icon fades out
                            setTimeout(() => setStatus('idle'), 3000);
                        } else {
                            setStatus('error');
                        }
                    } catch (e) {
                        setStatus('error');
                    }
                }, 5000);
            }
        );

        return () => {
            unsubscribe();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [activeUser, syncToCloud]);

    if (status === 'idle') return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '80px', // Above bottom nav
            right: '20px',
            backgroundColor: 'var(--surface-color)',
            padding: '8px 12px',
            borderRadius: '20px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            zIndex: 1000,
            transition: 'opacity 0.3s ease',
            border: '1px solid var(--border-color)'
        }}>
            {status === 'pending' && (
                <>
                    <RefreshCw size={14} style={{ opacity: 0.5 }} />
                    <span>Aguardando...</span>
                </>
            )}
            {status === 'syncing' && (
                <>
                    <RefreshCw size={14} className="spin" />
                    <span>Salvando...</span>
                </>
            )}
            {status === 'saved' && (
                <>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ color: '#10b981' }}>Salvo</span>
                </>
            )}
            {status === 'error' && (
                <>
                    <Cloud size={14} color="#ef4444" />
                    <span style={{ color: '#ef4444' }}>Erro Sync</span>
                </>
            )}
            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AutoSync;
