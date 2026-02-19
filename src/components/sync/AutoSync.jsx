import React, { useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { Cloud, RefreshCw } from 'lucide-react';

const AutoSync = () => {
    const { hasUnsyncedChanges, isSyncing, isHydrated, syncData } = useAppStore();

    useEffect(() => {
        if (hasUnsyncedChanges && isHydrated && !isSyncing) {
            const timer = setTimeout(() => {
                syncData();
            }, 2000); // 2 second debounce

            return () => clearTimeout(timer);
        }
    }, [hasUnsyncedChanges, isHydrated, isSyncing, syncData]);

    // Visual Feedback Logic
    if (!hasUnsyncedChanges && !isSyncing) return null;

    return (
        <div className="fade-in" style={{
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
            border: '1px solid var(--border-color)'
        }}>
            {isSyncing ? (
                <>
                    <RefreshCw size={14} className="spin" />
                    <span>Salvando...</span>
                </>
            ) : (
                <>
                    <Cloud size={14} style={{ opacity: 0.5 }} />
                    <span>Alterações pendentes...</span>
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
