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
        <div className="fade-in">
            <h3 style={{
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Calendar size={20} color="var(--primary-color)" />
                O que você deve fazer hoje
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Water Goal - ALWAYS VISIBLE */}
                <div
                    onClick={() => useAppStore.getState().setActiveTab('nutrition')}
                    style={{
                        backgroundColor: 'var(--surface-color)',
                        padding: '16px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        border: (currentUser?.nutrition?.water || 0) >= 4000 ? '1px solid var(--success-color)' : '1px solid var(--border-color)',
                        opacity: (currentUser?.nutrition?.water || 0) >= 4000 ? 0.7 : 1
                    }}
                >
                    <div style={{
                        backgroundColor: (currentUser?.nutrition?.water || 0) >= 4000 ? 'var(--success-color)' : '#3b82f6', // Blue for water
                        padding: '10px',
                        borderRadius: '12px',
                        color: 'white'
                    }}>
                        <Droplet size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600' }}>
                            Beber 4L de Água
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {currentUser?.nutrition?.water || 0} / 4000 ml
                        </p>
                    </div>
                    {(currentUser?.nutrition?.water || 0) >= 4000 ? (
                        <CheckCircle2 size={24} color="var(--success-color)" />
                    ) : (
                        <Circle size={24} color="var(--text-secondary)" />
                    )}
                </div>

                {hasNothingToday ? (
                    <div style={{
                        padding: '20px',
                        marginTop: '10px',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        border: '1px dashed var(--border-color)'
                    }}>
                        <p>Nenhuma tarefa ou treino agendado. Foco na hidratação! 💧</p>
                    </div>
                ) : (
                    <>
                        {/* Workouts First (Priority) */}
                        {todayWorkouts.map(workout => {
                            const isCompleted = workout.lastCompleted === today;
                            return (
                                <div key={workout.id}
                                    onClick={() => toggleWorkout(workout.id)}
                                    style={{
                                        backgroundColor: 'var(--surface-color)',
                                        padding: '16px',
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        border: isCompleted ? '1px solid var(--success-color)' : '1px solid var(--border-color)',
                                        opacity: isCompleted ? 0.7 : 1
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: isCompleted ? 'var(--success-color)' : 'var(--primary-soft)', // Orange/Amber for Workout
                                        padding: '10px',
                                        borderRadius: '12px',
                                        color: isCompleted ? 'white' : 'var(--primary-color)'
                                    }}>
                                        <Dumbbell size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                                            {workout.title}
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Treino de Hoje
                                        </p>
                                    </div>
                                    {isCompleted && <CheckCircle2 size={24} color="var(--success-color)" />}
                                </div>
                            );
                        })}

                        {/* Tasks */}
                        {todayTasks.map(task => (
                            <div key={task.id}
                                onClick={() => toggleTask(task.id)}
                                style={{
                                    backgroundColor: 'var(--surface-color)',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    cursor: 'pointer',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{
                                    color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)'
                                }}>
                                    {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        fontWeight: '500',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                                    }}>
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
