import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Home, Plus, CheckCircle, Trash2, Filter } from 'lucide-react';

const HouseView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
    const [title, setTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]); // For recurring logic (future), current filter
    const [categoryType, setCategoryType] = useState('cleaning'); // cleaning, shopping, organization

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

    // Filter Logic
    // In a real recurrence system, we'd check if today matches the recurrence.
    // Here we'll just filter regular tasks + custom "house" fields if we add them.
    const houseTasks = tasks.filter(t => t.category === 'house').sort((a, b) => a.completed - b.completed);

    const handleAdd = () => {
        if (!title.trim()) return;

        addTask({
            title: title,
            category: 'house',
            houseCategory: categoryType, // sub-category
            scheduledAt: new Date().toISOString(), // Default to today/now
            periodType: 'day',
            recurrence: selectedDays // Store selected days for reference
        });
        setTitle('');
    };

    const toggleDaySelection = (dayId) => {
        // UI Interaction for "Select days"
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

                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="O que precisa ser feito?"
                        style={{
                            flex: 1, padding: '12px', borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        onClick={handleAdd}
                        className="btn btn-primary"
                        style={{ borderRadius: '12px', width: '48px', padding: 0 }}
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* Days Selection (Optional Recurrence UI) */}
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
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
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                color: cat.color,
                                                backgroundColor: `${cat.color}15`,
                                                padding: '2px 8px', borderRadius: '4px'
                                            }}>
                                                {cat.label}
                                            </span>
                                            {task.scheduledAt && (
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                                    {new Date(task.scheduledAt).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                        </div>
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
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                }
                /* Checkbox styles reused from HomeView or defined globally if moved */
                .checkbox-container {
                    position: relative;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
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
