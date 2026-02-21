import React from 'react';
import useAppStore from '../../store/useAppStore';

const DailyProgress = () => {
    const { userData, tasks } = useAppStore();
    const currentUser = userData;

    // 1. Get Today's Date and Day
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const currentDayOfWeek = daysMap[now.getDay()];

    // 2. Filter Items for Today
    const todayTasks = tasks.filter(t => {
        if (!t.scheduledAt) return false;
        const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);
        const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return taskYMD === today;
    });
    const todayWorkouts = currentUser?.workouts?.filter(w => w.days.includes(currentDayOfWeek)) || [];
    const waterLevel = currentUser?.nutrition?.water || 0;

    // 3. Configure Totals
    const totalTasks = todayTasks.length;
    const totalWorkouts = todayWorkouts.length;
    const totalWater = 1; // Water goal is always 1 "task"

    const grandTotal = totalTasks + totalWorkouts + totalWater;

    // 4. Configure Completed
    const completedTasks = todayTasks.filter(t => t.completed).length;
    const completedWorkouts = todayWorkouts.filter(w => w.lastCompleted === today).length;
    const completedWater = waterLevel >= 4000 ? 1 : 0;

    const grandCompleted = completedTasks + completedWorkouts + completedWater;

    // 5. Calculate Percentage
    const progress = grandTotal === 0 ? 0 : Math.round((grandCompleted / grandTotal) * 100);

    return (
        <div className="card" style={{ padding: '24px', marginBottom: 'var(--spacing-lg)', borderColor: 'rgba(0,0,0,0.03)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '16px'
            }}>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '700',
                    letterSpacing: '-0.02em'
                }}>
                    Progresso Diário
                </h3>
                <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    color: 'var(--primary-color)',
                    letterSpacing: '-0.03em'
                }}>
                    {progress}%
                </span>
            </div>

            <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'rgba(0,0,0,0.03)',
                borderRadius: '4px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '4px',
                    transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
            </div>

            <p style={{
                marginTop: '12px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
            }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: progress === 100 ? 'var(--success-color)' : 'var(--primary-color)' }} />
                {progress === 100 ? 'Todas as metas concluídas!' : `${grandCompleted} de ${grandTotal} objetivos finalizados`}
            </p>
        </div>
    );
};

export default DailyProgress;
