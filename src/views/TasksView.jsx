import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { X, Plus, Trash2, CheckCircle2, Sun, Sunset, Moon, Calendar as CalendarIcon } from 'lucide-react';

const TasksView = () => {
    const { tasks, addTask, toggleTask, deleteTask, userData, toggleWorkout } = useAppStore();

    const todayStr = new Date().toLocaleDateString('en-CA'); // yyyy-mm-dd local

    // New Task State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(todayStr);
    const [isChangingDate, setIsChangingDate] = useState(false);
    const [notes, setNotes] = useState('');
    const [period, setPeriod] = useState(null); // 'morning', 'afternoon', 'night'
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    // Memory for custom date within the current session/view mount
    const [memoDate, setMemoDate] = useState(null);

    useEffect(() => {
        if (memoDate) {
            setDate(memoDate);
        }
    }, [isAddFormOpen, memoDate]);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const [year, month, day] = date.split('-');
        // Default to midday to avoid timezone shifts near midnight
        const scheduledAt = new Date(year, month - 1, day, 12, 0, 0);

        addTask({
            title: title,
            category: 'personal',
            scheduledAt: scheduledAt,
            periodType: 'day',
            period: period,
            description: notes
        });

        setTitle('');
        setNotes('');
        setPeriod(null);
        setIsAddFormOpen(false);
        setIsChangingDate(false);
        // We keep the memoDate if it was changed
    };

    const handleDateChange = (newDate) => {
        setDate(newDate);
        setMemoDate(newDate);
    };

    const filteredTasks = React.useMemo(() => {
        const now = new Date();
        const todayYMD = todayStr;
        const dayNamesEN = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const dayNamesPT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const currentDayEN = dayNamesEN[now.getDay()];
        const currentDayPT = dayNamesPT[now.getDay()];

        // 1. Filtrar tarefas normais e recorrentes
        const normalTasks = tasks.filter(t => {
            // Se for específica de hoje
            if (t.scheduledAt) {
                const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);
                const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (taskYMD === todayYMD) return true;
            }

            // Se for recorrente para hoje
            if (t.recurrence && t.recurrence.includes(currentDayEN)) return true;

            return false;
        });

        // 2. Incluir treinos
        const workoutTasks = (userData?.workouts || [])
            .filter(w => w.days?.includes(currentDayPT))
            .map(w => ({
                id: w.id,
                title: w.title,
                category: 'workouts',
                isWorkout: true,
                completed: w.lastCompleted === todayYMD,
                scheduledAt: new Date().toISOString()
            }));

        const combined = [...normalTasks, ...workoutTasks];

        return combined.sort((a, b) => {
            if (a.completed !== b.completed) return a.completed - b.completed;
            return new Date(a.scheduledAt) - new Date(b.scheduledAt);
        });
    }, [tasks, userData?.workouts, todayStr]);

    const getCategoryBadge = (category) => {
        switch (category) {
            case 'nutrition': return { label: 'Nutrição', color: '#FF2D55' };
            case 'studies': return { label: 'Estudos', color: '#5856D6' };
            case 'work': return { label: 'Trabalho', color: '#FF9500' };
            case 'projects': return { label: 'Projeto', color: '#34C759' };
            case 'house': return { label: 'Casa', color: '#AF52DE' };
            case 'travel': return { label: 'Viagem', color: '#007AFF' };
            case 'finance': return { label: 'Finanças', color: '#34C759' };
            case 'relationship': return { label: 'Nós', color: '#FF2D78' };
            case 'restrictions': return { label: 'Foco', color: '#8E8E93' };
            case 'workouts': return { label: 'Treino', color: '#FF2D55' };
            case 'shopping': case 'compras': return { label: 'Mercado', color: '#34C759' };
            case 'personal': default: return { label: 'Tarefa', color: '#8E8E93' };
        }
    };

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#FF9500' }, // Orange
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#FF2D55' }, // Pink/Red
        { id: 'night', label: 'Noite', icon: Moon, color: '#5856D6' } // Indigo
    ];

    const daysOfWeek = [
        { id: 'sun', label: 'Dom' },
        { id: 'mon', label: 'Seg' },
        { id: 'tue', label: 'Ter' },
        { id: 'wed', label: 'Qua' },
        { id: 'thu', label: 'Qui' },
        { id: 'fri', label: 'Sex' },
        { id: 'sat', label: 'Sáb' }
    ];

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Tarefas</h2>
                    <p className="text-sm text-secondary">Organize seu dia</p>
                </div>
                <button
                    onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                    style={{
                        width: '44px', height: '44px',
                        borderRadius: '14px',
                        backgroundColor: isAddFormOpen ? 'var(--text-primary)' : 'rgba(0, 122, 255, 0.08)',
                        color: isAddFormOpen ? 'white' : 'var(--primary-color)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                    {isAddFormOpen ? <X size={20} /> : <Plus size={24} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Premium Add Task Card */}
            {isAddFormOpen && (
                <div className="card fade-in" style={{ marginBottom: '32px', border: '1px solid rgba(0, 122, 255, 0.1)' }}>
                    <form onSubmit={handleAddTask}>
                        <input
                            type="text"
                            placeholder="O que precisa ser feito?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '0 0 16px 0',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderBottom: '1px solid var(--border-color)',
                                marginBottom: '20px',
                                fontSize: '1.2rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />

                        {/* Date Selection Control */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CalendarIcon size={14} />
                                    {date === todayStr ? 'Para Hoje' : new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingDate(!isChangingDate)}
                                    style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                >
                                    {isChangingDate ? 'Manter' : 'Trocar dia?'}
                                </button>
                            </div>

                            {isChangingDate && (
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                        backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', outline: 'none'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {periods.map(p => (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => setPeriod(period === p.id ? null : p.id)}
                                    style={{
                                        padding: '10px 16px',
                                        borderRadius: '12px',
                                        border: '1px solid transparent',
                                        backgroundColor: period === p.id ? p.color : 'rgba(0,0,0,0.03)',
                                        color: period === p.id ? 'white' : 'var(--text-secondary)',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    <p.icon size={14} strokeWidth={2.5} />
                                    <span>{p.label}</span>
                                </button>
                            ))}
                        </div>

                        <textarea
                            placeholder="Alguma nota importante?"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem',
                                minHeight: '60px', resize: 'none', fontFamily: 'inherit', outline: 'none', marginBottom: '24px'
                            }}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', borderRadius: '14px', fontWeight: '800' }}
                        >
                            Confirmar Tarefa
                        </button>
                    </form>
                </div>
            )}

            {/* Tasks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '64px 24px', opacity: 0.5 }}>
                        <CheckCircle2 size={48} strokeWidth={1} style={{ marginBottom: '16px', color: 'var(--text-tertiary)' }} />
                        <p style={{ fontWeight: '600' }}>Nada para fazer por aqui.</p>
                        <p className="text-sm">Aproveite seu tempo livre!</p>
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        const taskPeriod = periods.find(p => p.id === task.period);
                        const taskDate = new Date(task.scheduledAt);
                        const isTaskToday = taskDate.toLocaleDateString('en-CA') === todayStr;
                        const badge = getCategoryBadge(task.category);

                        return (
                            <div key={task.id}
                                className="card fade-in"
                                style={{
                                    padding: '16px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    opacity: task.completed ? 0.6 : 1,
                                    borderColor: task.completed ? 'transparent' : 'rgba(0,0,0,0.03)'
                                }}>
                                <button
                                    onClick={() => task.isWorkout ? toggleWorkout(task.id) : toggleTask(task.id, task.completed)}
                                    style={{
                                        width: '26px', height: '26px',
                                        borderRadius: '50%',
                                        border: `2px solid ${task.completed ? 'var(--success-color)' : 'var(--border-color)'}`,
                                        backgroundColor: task.completed ? 'var(--success-color)' : 'transparent',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'white', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                    }}
                                >
                                    {task.completed && <CheckCircle2 size={16} strokeWidth={3} />}
                                </button>

                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <span style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {task.title}
                                        </span>
                                        <span style={{
                                            fontSize: '0.6rem',
                                            color: badge.color,
                                            backgroundColor: `${badge.color}15`,
                                            padding: '2px 8px',
                                            borderRadius: '6px',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            flexShrink: 0
                                        }}>
                                            {badge.label}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                            {isTaskToday ? 'Hoje' : taskDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                        </span>

                                        {taskPeriod && (
                                            <span style={{
                                                fontSize: '0.65rem', color: taskPeriod.color,
                                                backgroundColor: `${taskPeriod.color}08`,
                                                padding: '2px 8px', borderRadius: '6px',
                                                fontWeight: '800', textTransform: 'uppercase',
                                                display: 'flex', alignItems: 'center', gap: '4px'
                                            }}>
                                                <taskPeriod.icon size={10} strokeWidth={3} /> {taskPeriod.label}
                                            </span>
                                        )}

                                        {task.recurrence && task.recurrence.length > 0 && (
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                {task.recurrence.map(d => (
                                                    <span key={d} style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-tertiary)', backgroundColor: 'rgba(0,0,0,0.03)', padding: '2px 4px', borderRadius: '4px' }}>
                                                        {daysOfWeek.find(day => day.id === d)?.label.charAt(0)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {task.description && !task.completed && (
                                        <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                            {task.description}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => deleteTask(task.id)}
                                    style={{ padding: '8px', color: 'var(--danger-color)', opacity: 0.3, border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} strokeWidth={2} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default TasksView;
