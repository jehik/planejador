import React, { useState } from 'react';
import { Plus, Trash2, Dumbbell, Flame, CheckCircle, Circle, Repeat } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const WorkoutsView = () => {
    const { userData, addWorkout, removeWorkout, toggleWorkout } = useAppStore();
    const workouts = userData?.workouts || [];
    const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);

    const daysOfWeek = [
        { id: 'Sun', label: 'Dom' },
        { id: 'Mon', label: 'Seg' },
        { id: 'Tue', label: 'Ter' },
        { id: 'Wed', label: 'Qua' },
        { id: 'Thu', label: 'Qui' },
        { id: 'Fri', label: 'Sex' },
        { id: 'Sat', label: 'Sáb' },
    ];

    // Map English day names (from Date object) to Portuguese for checking
    const dayMap = {
        'Sunday': 'Sun', 'Monday': 'Mon', 'Tuesday': 'Tue', 'Wednesday': 'Wed', 'Thursday': 'Thu', 'Friday': 'Fri', 'Saturday': 'Sat',
        'Domingo': 'Sun', 'Segunda': 'Mon', 'Terça': 'Tue', 'Quarta': 'Wed', 'Quinta': 'Thu', 'Sexta': 'Fri', 'Sábado': 'Sat' // Basic fallback
    };

    const todayDate = new Date();
    const todayIndex = todayDate.getDay();
    // Get short name like 'Sun', 'Mon' from array
    const todayShort = daysOfWeek[todayIndex].id;

    // We store days as 'Dom', 'Seg' etc in the backend (from previous logic) OR 'Sun', 'Mon'?
    // Previous code used: `['Dom', 'Seg', 'Ter', ...]` -> `todayName = daysOfWeek[todayIndex]` using Portuguese array.
    // Let's stick to the Portuguese labels stored in DB to avoid migration issues.
    // Re-declare pure strings for storage consistent with existing data:
    const daysOfWeekPT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const todayNamePT = daysOfWeekPT[todayIndex];

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
        const days = selectedDays.length > 0 ? selectedDays : daysOfWeekPT;

        addWorkout({
            title: newWorkoutTitle,
            days: days
        });
        setNewWorkoutTitle('');
        setSelectedDays([]);
    };

    const isToday = (workout) => {
        if (!workout.days || !Array.isArray(workout.days)) return false;
        return workout.days.includes(todayNamePT);
    };

    // Filter "Today's" Workouts
    const todaysWorkouts = workouts.filter(w => isToday(w));
    // Check if completed today. Use local date string YYYY-MM-DD
    const localYear = todayDate.getFullYear();
    const localMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(todayDate.getDate()).padStart(2, '0');
    const todayISO = `${localYear}-${localMonth}-${localDay}`;

    const isCompletedToday = (workout) => workout.lastCompleted === todayISO;

    const sortedAllWorkouts = [...workouts].sort((a, b) => {
        // Sort by Title
        return a.title.localeCompare(b.title);
    });

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Treinos & Saúde</h2>

            {/* Today's Section */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Flame size={20} color="#F59E0B" fill="#F59E0B" /> Treino de Hoje ({todayNamePT})
                </h3>

                {todaysWorkouts.length === 0 ? (
                    <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>Nenhum treino específico para hoje. Que tal um descanso ou alongamento?</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {todaysWorkouts.map(workout => (
                            <div key={workout.id} className="card" style={{
                                padding: '20px',
                                display: 'flex', alignItems: 'center', gap: '16px',
                                borderLeft: isCompletedToday(workout) ? '4px solid var(--success-color)' : '4px solid var(--primary-color)'
                            }}>
                                <button
                                    onClick={() => toggleWorkout(workout.id)}
                                    style={{
                                        border: 'none', background: 'none', cursor: 'pointer',
                                        color: isCompletedToday(workout) ? 'var(--success-color)' : 'var(--text-secondary)'
                                    }}
                                >
                                    {isCompletedToday(workout) ? <CheckCircle size={32} fill="currentColor" /> : <Circle size={32} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '4px', textDecoration: isCompletedToday(workout) ? 'line-through' : 'none' }}>
                                        {workout.title}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-color)', padding: '2px 8px', borderRadius: '4px' }}>
                                            {workout.days.join(', ')}
                                        </span>
                                        {workout.streak > 0 && (
                                            <span style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Flame size={12} fill="currentColor" /> {workout.streak} dias
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '32px 0' }} />

            {/* All Workouts List */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Repeat size={20} /> Todos os Treinos
            </h3>

            {sortedAllWorkouts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Adicione sua rotina de exercícios abaixo.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sortedAllWorkouts.map(workout => (
                        <div key={workout.id} className="card" style={{
                            padding: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                        }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{workout.title}</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                                    {daysOfWeekPT.map(day => (
                                        <span key={day} style={{
                                            fontSize: '0.7rem',
                                            color: workout.days.includes(day) ? 'var(--primary-color)' : 'var(--text-tertiary)',
                                            fontWeight: workout.days.includes(day) ? 'bold' : 'normal',
                                            opacity: workout.days.includes(day) ? 1 : 0.5
                                        }}>
                                            {day.charAt(0)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => removeWorkout(workout.id)} style={{ color: 'var(--text-secondary)', opacity: 0.5, border: 'none', background: 'none', cursor: 'pointer' }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Workout Form */}
            <div style={{ backgroundColor: 'var(--surface-color)', padding: '20px', borderRadius: '16px', marginTop: '32px' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '16px', fontWeight: 'bold' }}>Novo Treino</h3>

                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        {daysOfWeekPT.map(day => (
                            <button
                                key={day}
                                onClick={() => toggleDay(day)}
                                style={{
                                    width: '32px', height: '32px', borderRadius: '50%',
                                    backgroundColor: selectedDays.includes(day) ? 'var(--primary-color)' : 'var(--bg-color)',
                                    color: selectedDays.includes(day) ? 'white' : 'var(--text-secondary)',
                                    border: 'none', fontSize: '0.75rem', fontWeight: 'bold',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer'
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
                            opacity: newWorkoutTitle.trim() ? 1 : 0.5,
                            cursor: 'pointer'
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
