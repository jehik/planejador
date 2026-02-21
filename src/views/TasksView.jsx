import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { X, Plus, Trash2, CheckCircle2, Sun, Sunset, Moon } from 'lucide-react';

const TasksView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();

    // New Task State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');
    const [notes, setNotes] = useState('');
    const [period, setPeriod] = useState(null); // 'morning', 'afternoon', 'night'
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        const scheduledAt = new Date(year, month - 1, day, hours, minutes);

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
    };

    const filteredTasks = tasks.filter(task => {
        if (task.category === 'nutrition') return false;
        if (task.category === 'house') return false;
        return true;
    }).sort((a, b) => {
        if (a.completed !== b.completed) return a.completed - b.completed;
        return new Date(a.scheduledAt) - new Date(b.scheduledAt);
    });

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#FF9500' }, // Orange
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#FF2D55' }, // Pink/Red
        { id: 'night', label: 'Noite', icon: Moon, color: '#5856D6' } // Indigo
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
                            placeholder="Título da tarefa..."
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
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: 'var(--text-primary)',
                                outline: 'none'
                            }}
                        />

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

                        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Data</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                        backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', outline: 'none'
                                    }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Hora</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                        backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <textarea
                            placeholder="Adicione notas aqui..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem',
                                minHeight: '80px', resize: 'none', fontFamily: 'inherit', outline: 'none', marginBottom: '24px'
                            }}
                        />

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', padding: '16px', borderRadius: '14px' }}
                        >
                            Salvar Tarefa
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
                                    onClick={() => toggleTask(task.id, task.completed)}
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
                                    <span style={{
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        display: 'block',
                                        marginBottom: '6px'
                                    }}>
                                        {task.title}
                                    </span>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                                            {new Date(task.scheduledAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} • {new Date(task.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
