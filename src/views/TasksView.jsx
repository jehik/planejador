import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import TaskItem from '../components/tasks/TaskItem';
import { Plus, Calendar, Clock, Filter } from 'lucide-react';

const TasksView = () => {
    const { tasks, addTask } = useAppStore();
    const [filter, setFilter] = useState('all'); // 'all', 'today', 'week'

    // New Task State
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('12:00');

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const scheduledAt = new Date(`${date}T${time}:00`);

        addTask({
            title: title,
            category: 'personal', // Default for this view
            scheduledAt: scheduledAt,
            periodType: 'day'
        });

        setTitle('');
        // Keep date/time as is for quick next entry or reset? Resetting is cleaner.
    };

    // Filter Logic
    const filteredTasks = tasks.filter(task => {
        // Filter out specific categories if this view is ONLY for 'Tarefas' (Personal)?
        // Prompt: "Tarefas" (Lateral) -> Likely general tasks.
        // Let's include 'personal' and maybe others if not shown elsewhere?
        // Or just show ALL excluding specific ones like 'nutrition'?
        if (task.category === 'nutrition') return false;
        if (task.category === 'house') return false; // Shown in HouseView
        // So this view matches "Tarefas" (General)

        return true;
    }).sort((a, b) => a.completed - b.completed); // Pending first

    return (
        <div style={{ padding: '20px 20px 100px 20px' }}>
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

            {/* Input Form (Quick Add) */}
            <form onSubmit={handleAddTask} className="fade-in" style={{ marginBottom: '24px' }}>
                <div style={{
                    backgroundColor: 'var(--surface-color)',
                    padding: '16px',
                    borderRadius: '20px',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <input
                        type="text"
                        placeholder="O que você precisa fazer?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: 'var(--bg-color)',
                            border: 'none',
                            borderRadius: '12px',
                            marginBottom: '12px',
                            fontSize: '1rem',
                            color: 'var(--text-primary)'
                        }}
                    />

                    <div style={{ display: 'flex', justifyItems: 'stretch', gap: '10px' }}>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }}><Calendar size={16} /></div>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                style={{
                                    width: '100%', padding: '8px 8px 8px 32px', borderRadius: '12px', border: '1px solid var(--border-color)',
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
                                    width: '100%', padding: '8px 8px 8px 32px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem'
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '40px',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer'
                            }}
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>
            </form>

            {/* List */}
            <div>
                {filteredTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <p>Nenhuma tarefa geral encontrada.</p>
                    </div>
                ) : (
                    filteredTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksView;
