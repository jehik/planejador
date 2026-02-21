import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';

import { Plus, Calendar, Clock, Filter, Sun, Sunset, Moon, AlignLeft, CheckCircle, Trash2 } from 'lucide-react';

const TasksView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();

    // New Task State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');
    const [notes, setNotes] = useState('');
    const [period, setPeriod] = useState(null); // 'morning', 'afternoon', 'night'

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Construct Date ensuring local time (avoid UTC conversion shifts)
        const [year, month, day] = date.split('-');
        const [hours, minutes] = time.split(':');
        const scheduledAt = new Date(year, month - 1, day, hours, minutes);

        addTask({
            title: title,
            category: 'personal',
            scheduledAt: scheduledAt, // Use Date object directly
            periodType: 'day',
            period: period, // New field
            description: notes // Using description field for notes
        });

        setTitle('');
        setNotes('');
        setPeriod(null);
        // Keep date/time for convenience
    };

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        if (task.category === 'nutrition') return false;
        if (task.category === 'house') return false;
        return true;
    }).sort((a, b) => {
        // Sort by completion (pending first)
        if (a.completed !== b.completed) return a.completed - b.completed;
        // Then by date
        return new Date(a.scheduledAt) - new Date(b.scheduledAt);
    });

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#F59E0B' },
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#F97316' },
        { id: 'night', label: 'Noite', icon: Moon, color: '#8B5CF6' }
    ];

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Minhas Tarefas</h2>
                <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--surface-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border-color)'
                }}>
                    <Filter size={20} color="var(--text-secondary)" />
                </div>
            </div>

            {/* Quick Add Card - Replicated from HouseView logic */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: '600' }}>Adicionar Tarefa</h4>

                <form onSubmit={handleAddTask}>
                    <input
                        type="text"
                        placeholder="O que você precisa fazer?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'var(--bg-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            fontSize: '1rem',
                            color: 'var(--text-primary)'
                        }}
                    />

                    {/* Period Selection */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        {periods.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setPeriod(period === p.id ? null : p.id)}
                                className={`btn`}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: `1px solid ${period === p.id ? p.color : 'var(--border-color)'}`,
                                    backgroundColor: period === p.id ? `${p.color}20` : 'transparent',
                                    color: period === p.id ? p.color : 'var(--text-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    fontSize: '0.85rem'
                                }}
                            >
                                <p.icon size={16} />
                                <span>{p.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Date/Time Row */}
                    <div style={{ display: 'flex', justifyItems: 'stretch', gap: '10px', marginBottom: '12px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }}><Calendar size={16} /></div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 10px 10px 32px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }}><Clock size={16} /></div>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 10px 10px 32px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                    </div>

                    {/* Notes Field */}
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                        <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }}><AlignLeft size={16} /></div>
                        <textarea
                            placeholder="Anotações (opcional)..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            style={{
                                width: '100%', padding: '10px 10px 10px 32px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem',
                                minHeight: '60px', resize: 'vertical', fontFamily: 'inherit'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                    >
                        <Plus size={20} style={{ marginRight: '8px' }} /> Adicionar Tarefa
                    </button>
                </form>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <p>Nenhuma tarefa pendente.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => {
                        const taskPeriod = periods.find(p => p.id === task.period);
                        return (
                            <div key={task.id} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                                <button
                                    onClick={() => toggleTask(task.id, task.completed)}
                                    style={{
                                        marginTop: '2px', color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)',
                                        background: 'none', border: 'none', cursor: 'pointer'
                                    }}
                                >
                                    <CheckCircle size={24} fill={task.completed ? "currentColor" : "none"} />
                                </button>

                                <div style={{ flex: 1 }}>
                                    <span style={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        fontWeight: '500', display: 'block'
                                    }}>
                                        {task.title}
                                    </span>

                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                                        {/* Date/Time */}
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Calendar size={12} />
                                            {new Date(task.scheduledAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                                        </span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <Clock size={12} />
                                            {new Date(task.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>

                                        {/* Period Badge */}
                                        {taskPeriod && (
                                            <span style={{
                                                fontSize: '0.7rem', color: taskPeriod.color,
                                                backgroundColor: `${taskPeriod.color}15`,
                                                padding: '2px 8px', borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', gap: '4px'
                                            }}>
                                                <taskPeriod.icon size={10} /> {taskPeriod.label}
                                            </span>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    {task.description && (
                                        <div style={{ marginTop: '8px', padding: '8px', backgroundColor: 'var(--bg-color)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                            {task.description}
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => deleteTask(task.id)} style={{ color: 'var(--text-secondary)', opacity: 0.5, border: 'none', background: 'none', cursor: 'pointer' }}>
                                    <Trash2 size={18} />
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
