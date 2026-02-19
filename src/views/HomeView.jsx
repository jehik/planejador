import React from 'react';
import MotivationalQuote from '../components/home/MotivationalQuote';
import PomodoroTimer from '../components/home/PomodoroTimer';
import DreamBoard from '../components/home/DreamBoard';
import useAppStore from '../store/useAppStore';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const HomeView = () => {
    // We can reuse DailyProgress or build a minimalist task list here.
    // For now, let's build the "Daily Tasks" section as requested in the prompt.
    // "Lista minimalista, Checkbox suave animado, Campo de anotação rápida"

    return (
        <div className="home-view fade-in">
            {/* 1. Motivational Quote */}
            <MotivationalQuote />

            {/* 2. Pomodoro Timer (Central Card) */}
            <section style={{ margin: 'var(--spacing-xl) 0', display: 'flex', justifyContent: 'center' }}>
                <PomodoroTimer />
            </section>

            {/* 3. Daily Tasks (Condensed) */}
            <SimpleTaskList />

            {/* 4. Dream Board */}
            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                <DreamBoard />
            </div>

            {/* Spacing for bottom scrolling */}
            <div style={{ height: '100px' }}></div>
        </div>
    );
};

// Sub-component for tasks to keep HomeView clean
const SimpleTaskList = () => {
    const { tasks, toggleTask, addTask } = useAppStore();
    const [newTaskTitle, setNewTaskTitle] = React.useState('');

    // Filter today's tasks
    const todayTasks = React.useMemo(() => {
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0));
        const end = new Date(now.setHours(23, 59, 59, 999));

        return tasks.filter(t => {
            const d = new Date(t.scheduledAt);
            return d >= start && d <= end;
        });
    }, [tasks]);

    const handleAdd = (e) => {
        if (e.key === 'Enter' && newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle,
                scheduledAt: new Date().toISOString(),
                category: 'personal',
                periodType: 'day'
            });
            setNewTaskTitle('');
        }
    };

    return (
        <div className="tasks-section card">
            <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.2rem' }}>Tarefas do Dia</h2>

            <div className="task-list">
                {todayTasks.length === 0 && (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                        Nenhuma tarefa para hoje.
                    </p>
                )}

                {todayTasks.map(task => (
                    <div key={task.id} className="task-item">
                        <label className="checkbox-container">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => toggleTask(task.id, task.completed)}
                            />
                            <span className="checkmark">
                                <CheckCircle size={16} className="check-icon" />
                            </span>
                        </label>
                        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                            {task.title}
                        </span>
                    </div>
                ))}

                {/* Quick Add */}
                <input
                    type="text"
                    placeholder="+ Adicionar tarefa rápida..."
                    className="quick-add-input"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={handleAdd}
                />
            </div>

            <style>{`
                .task-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .task-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid var(--border-color);
                }
                .task-item:last-child {
                    border-bottom: none;
                }
                
                /* Animated Checkbox */
                .checkbox-container {
                    position: relative;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                }
                .checkbox-container input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 24px;
                    width: 24px;
                    background-color: var(--surface-hover);
                    border-radius: 50%;
                    border: 2px solid var(--text-secondary);
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .checkbox-container input:checked ~ .checkmark {
                    background-color: var(--success-color);
                    border-color: var(--success-color);
                }
                .check-icon {
                    opacity: 0;
                    color: white;
                    transform: scale(0.5);
                    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .checkbox-container input:checked ~ .checkmark .check-icon {
                    opacity: 1;
                    transform: scale(1);
                }

                .task-title {
                    font-size: 1rem;
                    color: var(--text-primary);
                    transition: all 0.2s;
                }
                .task-title.completed {
                    color: var(--text-secondary);
                    text-decoration: line-through;
                }

                .quick-add-input {
                    background: transparent;
                    border: none;
                    color: var(--text-primary);
                    padding: 12px 0;
                    width: 100%;
                    font-family: inherit;
                    font-size: 0.95rem;
                    border-bottom: 2px solid transparent;
                    transition: border-color 0.2s;
                }
                .quick-add-input:focus {
                    outline: none;
                    border-bottom-color: var(--primary-color);
                }
            `}</style>
        </div>
    );
};

export default HomeView;
