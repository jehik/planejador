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
    const { userData, addPoints, updateLevel } = useAppStore();
    const currentUser = userData;

    // ... (logic remains)

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
            setNewLevel(calculatedLevel);
            setShowModal(true);
        }
    }, [currentUser?.points]);

    const handleClaimLevel = () => {
        updateLevel(newLevel);
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
