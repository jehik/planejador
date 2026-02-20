import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Home, Plus, CheckCircle, Trash2, Filter, Sun, Sunset, Moon, AlignLeft } from 'lucide-react';

const HouseView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
    const [title, setTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [categoryType, setCategoryType] = useState('cleaning');
    const [period, setPeriod] = useState(null);
    const [notes, setNotes] = useState('');

    const daysOfWeek = [
        { id: 'sun', label: 'D' },
        { id: 'mon', label: 'S' },
        { id: 'tue', label: 'T' },
        { id: 'wed', label: 'Q' },
        { id: 'thu', label: 'Q' },
        { id: 'fri', label: 'S' },
        { id: 'sat', label: 'S' }
    ];

    const categories = [
        { id: 'cleaning', label: 'Limpeza', color: '#10B981' },
        { id: 'shopping', label: 'Compras', color: '#F59E0B' },
        { id: 'organization', label: 'Organização', color: '#8B5CF6' }
    ];

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#F59E0B' },
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#F97316' },
        { id: 'night', label: 'Noite', icon: Moon, color: '#8B5CF6' }
    ];

    // Filter regular tasks + custom "house" fields
    const houseTasks = tasks.filter(t => t.category === 'house').sort((a, b) => a.completed - b.completed);

    const handleAdd = () => {
        if (!title.trim()) return;

        addTask({
            title: title,
            category: 'house',
            houseCategory: categoryType,
            scheduledAt: new Date().toISOString(),
            periodType: 'day',
            recurrence: selectedDays,
            period: period,
            description: notes
        });
        setTitle('');
        setNotes('');
        setPeriod(null);
    };

    const toggleDaySelection = (dayId) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    padding: '10px', borderRadius: '12px',
                    color: '#D97706'
                }}>
                    <Home size={28} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Minha Casa</h2>
            </div>

            {/* Quick Add Card */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: '600' }}>Adicionar Tarefa</h4>

                {/* Category Selection */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoryType(cat.id)}
                            className={`btn ${categoryType === cat.id ? 'btn-primary' : 'btn-ghost'}`}
                            style={{
                                flex: 1,
                                fontSize: '0.85rem',
                                border: `1px solid ${categoryType === cat.id ? cat.color : 'var(--border-color)'}`,
                                backgroundColor: categoryType === cat.id ? `${cat.color}20` : 'transparent',
                                color: categoryType === cat.id ? cat.color : 'var(--text-secondary)'
                            }}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <input
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="O que precisa ser feito?"
                        style={{
                            flex: 1, padding: '12px', borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                        }}
                    />
                </div>

                {/* Period Selection */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    {periods.map(p => (
                        <button
                            key={p.id}
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
                                fontSize: '0.8rem'
                            }}
                        >
                            <p.icon size={14} />
                            <span>{p.label}</span>
                        </button>
                    ))}
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

                {/* Days Selection */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    {daysOfWeek.map(day => (
                        <button
                            key={day.id}
                            onClick={() => toggleDaySelection(day.id)}
                            style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                fontSize: '0.75rem', fontWeight: '600',
                                border: '1px solid var(--border-color)',
                                backgroundColor: selectedDays.includes(day.id) ? 'var(--primary-color)' : 'transparent',
                                color: selectedDays.includes(day.id) ? 'white' : 'var(--text-secondary)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            {day.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleAdd}
                    className="btn btn-primary"
                    style={{ borderRadius: '12px', width: '100%', justifyContent: 'center' }}
                >
                    <Plus size={20} style={{ marginRight: '8px' }} /> Adicionar Tarefa
                </button>
            </div>

            {/* Task List */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Tarefas</h3>
                    <button className="btn btn-ghost" style={{ padding: '8px' }}>
                        <Filter size={18} />
                    </button>
                </div>

                <div className="house-task-list">
                    {houseTasks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <p>Tudo limpo e organizado!</p>
                        </div>
                    ) : (
                        houseTasks.map(task => {
                            const cat = categories.find(c => c.id === task.houseCategory) || categories[0];
                            const taskPeriod = periods.find(p => p.id === task.period);
                            return (
                                <div key={task.id} className="house-task-item card">
                                    <label className="checkbox-container">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id, task.completed)}
                                        />
                                        <span className="checkmark" style={{
                                            borderColor: task.completed ? 'var(--success-color)' : 'var(--text-secondary)',
                                            backgroundColor: task.completed ? 'var(--success-color)' : 'transparent'
                                        }}>
                                            <CheckCircle size={14} className="check-icon" />
                                        </span>
                                    </label>

                                    <div style={{ flex: 1 }}>
                                        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                                            {task.title}
                                        </span>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: cat.color,
                                                backgroundColor: `${cat.color}15`,
                                                padding: '2px 8px', borderRadius: '4px'
                                            }}>
                                                {cat.label}
                                            </span>

                                            {taskPeriod && (
                                                <span style={{
                                                    fontSize: '0.7rem', color: taskPeriod.color,
                                                    backgroundColor: `${taskPeriod.color}15`,
                                                    padding: '2px 8px', borderRadius: '4px',
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    <taskPeriod.icon size={10} /> {taskPeriod.label}
                                                </span>
                                            )}
                                        </div>
                                        {task.description && (
                                            <div style={{ marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                {task.description}
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={() => deleteTask(task.id)} className="delete-icon">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <style>{`
                .house-task-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .house-task-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                }
                .checkbox-container {
                    position: relative;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    margin-top: 2px;
                }
                .checkbox-container input { opacity: 0; width: 0; height: 0; }
                .checkmark {
                    position: absolute; top: 0; left: 0;
                    height: 24px; width: 24px;
                    border-radius: 50%;
                    border: 2px solid;
                    display: flex; alignItems: center; justifyContent: center;
                    transition: all 0.2s;
                }
                .check-icon { opacity: 0; color: white; transform: scale(0.5); transition: all 0.2s; }
                .checkbox-container input:checked ~ .checkmark .check-icon { opacity: 1; transform: scale(1); }
                
                .task-title.completed {
                    color: var(--text-secondary);
                    text-decoration: line-through;
                }
                .delete-icon {
                    color: var(--text-secondary);
                    opacity: 0.5;
                    transition: all 0.2s;
                    background: none;
                    border: none;
                    cursor: pointer;
                }
                .delete-icon:hover {
                    opacity: 1;
                    color: var(--danger-color);
                }
            `}</style>
        </div>
    );
};

export default HouseView;
