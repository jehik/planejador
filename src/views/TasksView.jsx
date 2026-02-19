import React, { useState } from 'react';
import { Plus, Trash2, Calendar, CheckCircle, Circle } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const TasksView = () => {
    const { userData, addTask, removeTask, toggleTask } = useAppStore();
    const tasks = userData?.tasks || [];
    const [activeTab, setActiveTab] = useState('today'); // 'today', 'tomorrow', 'soon'
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const getTabDate = (tab) => {
        const today = new Date();
        if (tab === 'today') return today.toISOString().split('T')[0];
        if (tab === 'tomorrow') {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow.toISOString().split('T')[0];
        }
        return 'soon';
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        addTask({
            title: newTaskTitle,
            date: getTabDate(activeTab),
            type: activeTab
        });
        setNewTaskTitle('');
    };

    const filteredTasks = tasks.filter(task => {
        const date = getTabDate(activeTab);
        if (activeTab === 'soon') return task.type === 'soon' || (task.date !== getTabDate('today') && task.date !== getTabDate('tomorrow'));
        return task.date === date;
    });

    const completedCount = filteredTasks.filter(t => t.completed).length;
    const progress = filteredTasks.length > 0 ? (completedCount / filteredTasks.length) * 100 : 0;

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Tarefas</h2>

            {/* Warning for overload */}
            {filteredTasks.length > 5 && activeTab === 'today' && (
                <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger-color)',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    ⚠️ Muitos planos para hoje. Que tal mover algo para amanhã?
                </div>
            )}

            {/* Progress Bar (Today Only) */}
            {activeTab === 'today' && (
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '0.9rem' }}>
                        <span>Progresso Diário</span>
                        <span>{completedCount}/{filteredTasks.length}</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary-color)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {['today', 'tomorrow', 'soon'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            backgroundColor: activeTab === tab ? 'var(--primary-color)' : 'var(--surface-color)',
                            color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                            border: '1px solid var(--border-color)',
                            fontWeight: activeTab === tab ? '600' : '400',
                            transition: 'all 0.2s',
                            flex: 1
                        }}
                    >
                        {tab === 'today' ? 'Hoje' : tab === 'tomorrow' ? 'Amanhã' : 'Em breve'}
                    </button>
                ))}
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Adicionar nova tarefa..."
                    style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--text-primary)'
                    }}
                />
                <button
                    type="submit"
                    disabled={!newTaskTitle.trim()}
                    style={{
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        opacity: newTaskTitle.trim() ? 1 : 0.5
                    }}
                >
                    <Plus size={24} />
                </button>
            </form>

            {/* Task List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {filteredTasks.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '20px' }}>
                        Nenhuma tarefa para este período.
                    </p>
                ) : (
                    filteredTasks.map(task => (
                        <div key={task.id} style={{
                            backgroundColor: 'var(--surface-color)',
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.2s'
                        }}>
                            <button onClick={() => toggleTask(task.id)} style={{ color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}>
                                {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                            </button>
                            <span style={{
                                flex: 1,
                                textDecoration: task.completed ? 'line-through' : 'none',
                                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                            }}>
                                {task.title}
                            </span>
                            <button onClick={() => removeTask(task.id)} style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TasksView;
