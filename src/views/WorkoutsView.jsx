import React, { useState } from 'react';
import { Plus, Trash2, Dumbbell, Flame, CheckCircle, Circle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const WorkoutsView = () => {
    const { userData, addWorkout, removeWorkout, toggleWorkout } = useAppStore();
    const workouts = userData?.workouts || [];
    const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const today = new Date().toISOString().split('T')[0];
    const todayIndex = new Date().getDay();
    const todayName = daysOfWeek[todayIndex];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleAddWorkout = (e) => {
        e.preventDefault();
        if (!newWorkoutTitle.trim()) return;

        // If no days selected, assume everyday or flexible
        const days = selectedDays.length > 0 ? selectedDays : daysOfWeek;

        addWorkout({
            title: newWorkoutTitle,
            days: days
        });
        setNewWorkoutTitle('');
        setSelectedDays([]);
    };

    const isToday = (workout) => {
        return workout.days.includes(todayName);
    };

    const sortedWorkouts = [...workouts].sort((a, b) => {
        // Prioritize today's workouts
        const aToday = isToday(a);
        const bToday = isToday(b);
        if (aToday && !bToday) return -1;
        if (!aToday && bToday) return 1;
        return 0;
    });

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Treinos & Saúde</h2>

            {sortedWorkouts.length === 0 ? (
                <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--surface-color)',
                        margin: '0 auto 16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Dumbbell size={40} color="var(--primary-color)" />
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Movimento é vida. Adicione sua rotina de exercícios.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {sortedWorkouts.map(workout => {
                        const completedToday = workout.lastCompleted === today;
                        const scheduledToday = isToday(workout);

                        return (
                            <div key={workout.id} style={{
                                backgroundColor: 'var(--surface-color)',
                                padding: '16px',
                                borderRadius: '16px',
                                border: scheduledToday ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                opacity: !scheduledToday && !completedToday ? 0.8 : 1
                            }}>
                                <button
                                    onClick={() => toggleWorkout(workout.id)}
                                    style={{
                                        color: completedToday ? 'var(--success-color)' : (scheduledToday ? 'var(--primary-color)' : 'var(--text-secondary)')
                                    }}
                                >
                                    {completedToday ? <CheckCircle size={28} fill="currentColor" color="white" /> : <Circle size={28} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{workout.title}</h3>
                                        {workout.streak > 0 && (
                                            <div style={{
                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                backgroundColor: '#FEF3C7', color: '#D97706',
                                                padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                                            }}>
                                                <Flame size={12} fill="currentColor" /> {workout.streak}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                        {daysOfWeek.map(day => (
                                            <span key={day} style={{
                                                fontSize: '0.7rem',
                                                color: workout.days.includes(day) ? (day === todayName ? 'var(--primary-color)' : 'var(--text-secondary)') : 'var(--border-color)',
                                                fontWeight: workout.days.includes(day) ? 'bold' : 'normal'
                                            }}>
                                                {day.charAt(0)}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={() => removeWorkout(workout.id)} style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add Workout Form */}
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '20px', borderRadius: '16px', marginTop: 'auto' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold' }}>Novo Treino</h3>

                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        {daysOfWeek.map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: selectedDays.includes(day) ? 'var(--primary-color)' : 'var(--bg-color)',
                                    color: selectedDays.includes(day) ? 'white' : 'var(--text-secondary)',
                                    border: 'none', fontSize: '0.75rem', fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                {day.charAt(0)}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleAddWorkout} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={newWorkoutTitle}
                        onChange={(e) => setNewWorkoutTitle(e.target.value)}
                        placeholder="Ex: Corrida, Yoga, Academia..."
                        style={{
                            flex: 1,
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newWorkoutTitle.trim()}
                        style={{
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            opacity: newWorkoutTitle.trim() ? 1 : 0.5
                        }}
                    >
                        <Plus size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WorkoutsView;
