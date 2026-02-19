import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import TaskItem from '../components/tasks/TaskItem';
import { Home, Plus, Calendar } from 'lucide-react';

const HouseView = () => {
    const { tasks, addTask } = useAppStore();
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    // Filter for House Tasks
    const houseTasks = tasks.filter(t => t.category === 'house').sort((a, b) => a.completed - b.completed);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        addTask({
            title: title,
            category: 'house',
            scheduledAt: new Date(date),
            periodType: 'day'
        });
        setTitle('');
    };

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
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

            {/* Quick Add House Task */}
            <form onSubmit={handleAdd} style={{ marginBottom: '24px' }}>
                <div style={{
                    backgroundColor: 'var(--surface-color)',
                    padding: '16px', borderRadius: '20px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--border-color)'
                }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        Nova Tarefa Doméstica
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                            value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Lavar roupas, Limpar cozinha..."
                            style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', width: '100%' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                                <input
                                    type="date" value={date} onChange={e => setDate(e.target.value)}
                                    style={{ padding: '10px 10px 10px 36px', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', width: '100%' }}
                                />
                            </div>
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#F59E0B',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    width: '48px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {houseTasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                        <p>Nenhuma tarefa doméstica pendente.</p>
                        <p style={{ fontSize: '0.8rem' }}>Aproveite o descanso!</p>
                    </div>
                ) : (
                    houseTasks.map(task => (
                        <TaskItem key={task.id} task={task} showCategory={false} />
                    ))
                )}
            </div>
        </div>
    );
};

export default HouseView;
