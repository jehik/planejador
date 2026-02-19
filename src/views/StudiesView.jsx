import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { BookOpen, ChevronDown, ChevronUp, Plus, CheckCircle, Trash2 } from 'lucide-react';

const StudiesView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();

    // Sample subjects (could be dynamic later)
    const [subjects] = useState([
        { id: 'math', name: 'Matemática', color: '#3B82F6' },
        { id: 'dev', name: 'Programação', color: '#10B981' },
        { id: 'english', name: 'Inglês', color: '#F59E0B' },
        { id: 'design', name: 'Design UX/UI', color: '#8B5CF6' }
    ]);

    const [expandedSubject, setExpandedSubject] = useState(null);
    const [newTask, setNewTask] = useState('');

    const toggleAccordion = (id) => {
        setExpandedSubject(expandedSubject === id ? null : id);
    };

    const handleAddTask = (subjectId) => {
        if (!newTask.trim()) return;
        addTask({
            title: newTask,
            category: 'studies',
            subjectId: subjectId, // Custom field
            scheduledAt: new Date().toISOString(),
            periodType: 'day'
        });
        setNewTask('');
    };

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>Meus Estudos</h2>

            <div className="subjects-list">
                {subjects.map(subject => {
                    const isExpanded = expandedSubject === subject.id;
                    const subjectTasks = tasks.filter(t => t.category === 'studies' && t.subjectId === subject.id);

                    return (
                        <div key={subject.id} className="subject-card card" style={{ padding: 0, overflow: 'hidden', marginBottom: '16px' }}>
                            {/* Accordion Header */}
                            <div
                                onClick={() => toggleAccordion(subject.id)}
                                style={{
                                    padding: '20px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    background: isExpanded ? 'var(--surface-hover)' : 'transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px',
                                        backgroundColor: `${subject.color}20`, color: subject.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>{subject.name}</h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            {subjectTasks.length} tarefas
                                        </p>
                                    </div>
                                </div>
                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="subject-content fade-in">
                                    {/* Task List */}
                                    <div className="study-tasks">
                                        {subjectTasks.map(task => (
                                            <div key={task.id} className="study-task-item">
                                                <label className="checkbox-container mini">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.completed}
                                                        onChange={() => toggleTask(task.id, task.completed)}
                                                    />
                                                    <span className="checkmark mini">
                                                        <CheckCircle size={14} className="check-icon" />
                                                    </span>
                                                </label>
                                                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                                                    {task.title}
                                                </span>
                                                <button onClick={() => deleteTask(task.id)} className="delete-icon">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Add Task Input */}
                                    <div className="add-study-task">
                                        <input
                                            placeholder="Nova tarefa..."
                                            value={newTask}
                                            onChange={e => setNewTask(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddTask(subject.id)}
                                        />
                                        <button onClick={() => handleAddTask(subject.id)}>
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                .subject-content {
                    padding: 0 20px 20px 20px;
                    border-top: 1px solid var(--border-color);
                }
                .study-tasks {
                    margin-top: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .study-task-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px;
                    border-radius: 8px;
                    background-color: var(--bg-color);
                }
                .add-study-task {
                    margin-top: 16px;
                    display: flex;
                    gap: 8px;
                }
                .add-study-task input {
                    flex: 1;
                    background: var(--bg-color);
                    border: 1px solid var(--border-color);
                    padding: 8px 12px;
                    border-radius: 8px;
                    color: var(--text-primary);
                }
                .add-study-task button {
                    background: var(--surface-hover);
                    color: var(--primary-color);
                    width: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .delete-icon {
                    margin-left: auto;
                    color: var(--text-secondary);
                    opacity: 0.5;
                }
                .delete-icon:hover {
                    opacity: 1;
                    color: var(--danger-color);
                }
            `}</style>
        </div>
    );
};

export default StudiesView;
