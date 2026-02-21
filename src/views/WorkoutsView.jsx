import React, { useState } from 'react';
import { Plus, X, Trash2, Dumbbell, Flame, CheckCircle2, Repeat } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const WorkoutsView = () => {
    const { userData, addWorkout, removeWorkout, toggleWorkout } = useAppStore();
    const workouts = userData?.workouts || [];
    const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [isAdding, setIsAdding] = useState(false);

    const daysOfWeekPT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const todayIndex = new Date().getDay();
    const todayNamePT = daysOfWeekPT[todayIndex];

    const toggleDay = (day) => {
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    const handleAddWorkout = (e) => {
        if (e) e.preventDefault();
        if (!newWorkoutTitle.trim()) return;

        const days = selectedDays.length > 0 ? selectedDays : daysOfWeekPT;

        addWorkout({
            title: newWorkoutTitle,
            days: days
        });
        setNewWorkoutTitle('');
        setSelectedDays([]);
        setIsAdding(false);
    };

    const todayDate = new Date();
    const localYear = todayDate.getFullYear();
    const localMonth = String(todayDate.getMonth() + 1).padStart(2, '0');
    const localDay = String(todayDate.getDate()).padStart(2, '0');
    const todayISO = `${localYear}-${localMonth}-${localDay}`;

    const isToday = (workout) => workout.days?.includes(todayNamePT);
    const isCompletedToday = (workout) => workout.lastCompleted === todayISO;

    const todaysWorkouts = workouts.filter(w => isToday(w));
    const allWorkouts = [...workouts].sort((a, b) => a.title.localeCompare(b.title));

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Treinos</h2>
                    <p className="text-sm text-secondary">Acompanhe sua evolução</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        width: '44px', height: '44px',
                        borderRadius: '14px',
                        backgroundColor: isAdding ? 'var(--text-primary)' : 'rgba(255, 45, 85, 0.08)',
                        color: isAdding ? 'white' : '#FF2D55',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                    {isAdding ? <X size={20} /> : <Plus size={24} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Quick Add Form */}
            {isAdding && (
                <div className="card fade-in" style={{ marginBottom: '32px', border: '1px solid rgba(255, 45, 85, 0.1)' }}>
                    <form onSubmit={handleAddWorkout}>
                        <input
                            type="text"
                            placeholder="Nome do treino..."
                            value={newWorkoutTitle}
                            onChange={(e) => setNewWorkoutTitle(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '0 0 16px 0',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--border-color)',
                                marginBottom: '20px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />

                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                            Dias da semana
                        </label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', gap: '6px' }}>
                            {daysOfWeekPT.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    style={{
                                        flex: 1, height: '40px', borderRadius: '10px',
                                        backgroundColor: selectedDays.includes(day) ? '#FF2D55' : 'rgba(0,0,0,0.03)',
                                        color: selectedDays.includes(day) ? 'white' : 'var(--text-secondary)',
                                        border: 'none', fontSize: '0.8rem', fontWeight: '800',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {day.charAt(0)}
                                </button>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#FF2D55', boxShadow: '0 4px 12px rgba(255, 45, 85, 0.2)' }}
                        >
                            Salvar Treino
                        </button>
                    </form>
                </div>
            )}

            {/* Today's Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Flame size={20} color="#FF9500" fill="#FF9500" />
                    <h3 className="text-lg">Hoje • {todayNamePT}</h3>
                </div>

                {todaysWorkouts.length === 0 ? (
                    <div className="card" style={{ padding: '32px 24px', textAlign: 'center', opacity: 0.6 }}>
                        <p style={{ fontWeight: '600' }}>Nenhum treino agendado hoje.</p>
                        <p className="text-sm">Dia de descanso e recuperação?</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {todaysWorkouts.map(workout => (
                            <div key={workout.id} className="card fade-in" style={{
                                padding: '20px',
                                display: 'flex', alignItems: 'center', gap: '20px',
                                opacity: isCompletedToday(workout) ? 0.7 : 1,
                                borderColor: isCompletedToday(workout) ? 'transparent' : 'rgba(0,0,0,0.03)'
                            }}>
                                <button
                                    onClick={() => toggleWorkout(workout.id)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%',
                                        border: `2px solid ${isCompletedToday(workout) ? '#FF2D55' : 'var(--border-color)'}`,
                                        backgroundColor: isCompletedToday(workout) ? '#FF2D55' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                    }}
                                >
                                    {isCompletedToday(workout) && <CheckCircle2 size={20} strokeWidth={3} />}
                                </button>

                                <div style={{ flex: 1 }}>
                                    <h4 style={{
                                        fontSize: '1.1rem', fontWeight: '700',
                                        color: isCompletedToday(workout) ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        textDecoration: isCompletedToday(workout) ? 'line-through' : 'none'
                                    }}>
                                        {workout.title}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {daysOfWeekPT.map(d => (
                                                <span key={d} style={{
                                                    fontSize: '0.6rem', fontWeight: '800',
                                                    color: workout.days.includes(d) ? '#FF2D55' : 'var(--text-tertiary)',
                                                    opacity: workout.days.includes(d) ? 1 : 0.3
                                                }}>{d.charAt(0)}</span>
                                            ))}
                                        </div>
                                        {workout.streak > 0 && (
                                            <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: 'rgba(255, 149, 0, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                                <Flame size={10} color="#FF9500" fill="#FF9500" />
                                                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#FF9500' }}>{workout.streak}d</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <Dumbbell size={24} color="#FF2D55" opacity={isCompletedToday(workout) ? 0.2 : 0.4} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* All Workouts */}
            <div>
                <h3 className="text-lg" style={{ marginBottom: '16px' }}>Sua Rotina</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
                    {allWorkouts.map(workout => (
                        <div key={workout.id} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '100px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', lineHeight: '1.2', flex: 1, marginRight: '8px' }}>{workout.title}</h4>
                                <button
                                    onClick={() => removeWorkout(workout.id)}
                                    style={{ padding: '4px', color: 'var(--danger-color)', opacity: 0.3, border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '3px', marginTop: '12px' }}>
                                {daysOfWeekPT.map(d => (
                                    <div key={d} style={{
                                        width: '4px', height: '4px', borderRadius: '50%',
                                        backgroundColor: workout.days.includes(d) ? '#FF2D55' : 'var(--border-color)',
                                        opacity: workout.days.includes(d) ? 1 : 0.5
                                    }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkoutsView;
