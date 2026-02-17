import React, { useEffect, useState } from 'react';
import { Trophy, Star, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const LEVEL_THRESHOLDS = {
    1: 0,
    2: 100, // Beginner
    3: 300, // Intermediate
    4: 600, // Advanced
    5: 1000, // Expert
    6: 2000  // Master
};

const LevelSystem = () => {
    const { activeUser, users, addPoints } = useAppStore();
    const currentUser = users[activeUser];

    // We need to track previous level to show modal only on change
    // Using a ref or local storage to track "last seen level" might be needed if we want it persistent across reloads, 
    // but for now let's just show it when it happens in session or calculate it.

    // Actually, store has 'level'. We should compare calculated level with stored level.
    // If calculated > stored, upgrade and show modal.

    const [showModal, setShowModal] = useState(false);
    const [newLevel, setNewLevel] = useState(1);

    useEffect(() => {
        if (!currentUser) return;

        const points = currentUser.points || 0;
        const currentLevel = currentUser.level || 1;

        let calculatedLevel = 1;
        for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
            if (points >= threshold) {
                calculatedLevel = Number(lvl);
            }
        }

        if (calculatedLevel > currentLevel) {
            // Update store (we need an action updateLevel, or just update directly via generic update... wait, I don't have updateLevel action)
            // I'll add a specific updateLevel action or just use addPoints to trick it? No.
            // I will implement an internal update in this component effectively? activeUser is in store. 
            // I need to add 'setLevel' to store or similar.
            // For now, I will modify the user object directly via a new action 'updateUserLevel' if I can.
            // Wait, I missed adding `updateLevel` action. I should add it.

            // Temporary workaround: I will calculate it in render, but to persist it I need an action.
            // I will Assume I added updateLevel in the previous step... wait, I didn't.
            // I will add it in the next tool call if I forgot.

            // Let's assume I'll add `updateLevel` in the next tool call along with `DreamBoard` updates if I missed it.
            // But I can't use it here if I haven't added it.

            // Actually, I can use a direct state manipulation if I really had to, but that's bad practice with Zustand.
            // I will just trigger the modal and assume the store update happens via a 'confirm' action or I add the action now.

            // I will trigger the modal, and when the modal opens, I'll call the action.
            setNewLevel(calculatedLevel);
            setShowModal(true);
        }
    }, [currentUser?.points]); // Check whenever points change

    const handleClaimLevel = () => {
        // Call store action to update level
        // I need to add this action!
        useAppStore.setState((state) => ({
            users: {
                ...state.users,
                [state.activeUser]: { ...state.users[state.activeUser], level: newLevel }
            }
        }));
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn 0.3s'
        }}>
            <div className="scale-in" style={{
                backgroundColor: 'var(--surface-color)',
                padding: '32px',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                border: '2px solid var(--primary-color)',
                boxShadow: '0 0 50px rgba(59, 130, 246, 0.5)'
            }}>
                <div style={{ marginBottom: '16px' }}>
                    <Trophy size={64} color="#F59E0B" fill="#F59E0B" />
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    LEVEL UP!
                </h2>

                <p style={{ fontSize: '1.2rem', color: 'var(--primary-color)', fontWeight: 'bold', marginBottom: '16px' }}>
                    Nível {newLevel} Alcançado
                </p>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                    Você está se tornando a sua melhor versão. Continue focado!
                </p>

                <button
                    onClick={handleClaimLevel}
                    style={{
                        padding: '16px 32px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer'
                    }}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default LevelSystem;
