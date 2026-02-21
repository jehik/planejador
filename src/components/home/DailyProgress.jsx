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
        <div className="fade-in" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: 'var(--spacing-sm)'
            }}>
                <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)'
                }}>
                    Progresso Diário
                </h3>
                <span style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--primary-color)'
                }}>
                    {progress}%
                </span>
            </div>

            <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: 'var(--border-color)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${progress}%`,
                    height: '100%',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 1s ease-in-out'
                }} />
            </div>
        </div>
    );
};

export default DailyProgress;
