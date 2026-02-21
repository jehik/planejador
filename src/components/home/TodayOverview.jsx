import React from 'react';
import { CheckCircle2, Circle, Dumbbell, Calendar, Droplet } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const TodayOverview = () => {
    const { userData, tasks, toggleTask, toggleWorkout } = useAppStore();
    const currentUser = userData;

    // Get today's local date string YYYY-MM-DD
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Get day of week (Seg, Ter, Qua...)
    const daysMap = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const currentDayOfWeek = daysMap[now.getDay()];

    // Filter Tasks for Today (using scheduledAt)
    const todayTasks = tasks.filter(t => {
        if (!t.scheduledAt) return false;
        const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);
        const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return taskYMD === today && !t.completed; // Only non-completed for today list
    });

    // Filter Workouts for Today
    const todayWorkouts = currentUser?.workouts?.filter(w => w.days.includes(currentDayOfWeek)) || [];

    const hasNothingToday = todayTasks.length === 0 && todayWorkouts.length === 0;

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header Section */}
            <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '4px', letterSpacing: '-0.03em' }}>Meus Objetivos</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Foque no que é essencial para hoje.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Water Goal - Redesigned Card */}
                <div
                    onClick={() => useAppStore.getState().setActiveTab('nutrition')}
                    className="card"
                    style={{
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        cursor: 'pointer',
                        borderColor: (currentUser?.nutrition?.water || 0) >= 4000 ? 'rgba(52, 199, 89, 0.2)' : 'rgba(0,0,0,0.03)',
                        background: (currentUser?.nutrition?.water || 0) >= 4000 ? 'rgba(52, 199, 89, 0.02)' : 'var(--surface-color)'
                    }}
                >
                    <div style={{
                        backgroundColor: 'rgba(0, 122, 255, 0.1)',
                        padding: '10px',
                        borderRadius: '12px',
                        color: 'var(--primary-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Droplet size={22} strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>Beber 4L de Água</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            {currentUser?.nutrition?.water || 0} de 4000 ml
                        </p>
                    </div>
                    {(currentUser?.nutrition?.water || 0) >= 4000 ? (
                        <CheckCircle2 size={24} color="var(--success-color)" strokeWidth={2.5} />
                    ) : (
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border-color)' }} />
                    )}
                </div>

                {hasNothingToday ? (
                    <div style={{
                        padding: '40px 20px',
                        textAlign: 'center',
                        color: 'var(--text-tertiary)',
                        border: '1px dashed var(--border-color)',
                        borderRadius: '20px'
                    }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '500' }}>Nenhuma tarefa ou treino agendado.</p>
                    </div>
                ) : (
                    <>
                        {/* Workouts Section */}
                        {todayWorkouts.map(workout => {
                            const isCompleted = workout.lastCompleted === today;
                            return (
                                <div key={workout.id}
                                    className="card"
                                    style={{
                                        padding: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        cursor: 'pointer',
                                        borderColor: isCompleted ? 'rgba(52, 199, 89, 0.2)' : 'rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: isCompleted ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 59, 48, 0.1)',
                                        padding: '10px',
                                        borderRadius: '12px',
                                        color: isCompleted ? 'var(--success-color)' : 'var(--danger-color)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <Dumbbell size={22} strokeWidth={2.5} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '700', fontSize: '0.95rem', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                                            {workout.title}
                                        </p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            Treino do Dia
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); toggleWorkout(workout.id); }}
                                        style={{
                                            padding: '8px 16px', borderRadius: '12px',
                                            backgroundColor: isCompleted ? 'rgba(52, 199,  green, 0.1)' : 'var(--primary-color)',
                                            color: isCompleted ? 'var(--success-color)' : 'white',
                                            border: 'none', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {isCompleted ? 'Concluído' : 'Check-in'}
                                    </button>
                                </div>
                            );
                        })}

                        {/* Tasks Section */}
                        {todayTasks.map(task => (
                            <div key={task.id}
                                onClick={() => toggleTask(task.id)}
                                className="card"
                                style={{
                                    padding: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    cursor: 'pointer',
                                    borderColor: 'rgba(0,0,0,0.03)'
                                }}
                            >
                                <div style={{ color: 'var(--border-color)' }}>
                                    <Circle size={24} strokeWidth={2} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                                        {task.title}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default TodayOverview;
