import React from 'react';
import MotivationalQuote from '../components/home/MotivationalQuote';
import PomodoroTimer from '../components/home/PomodoroTimer';
import DreamBoard from '../components/dream/DreamBoard';
import useAppStore from '../store/useAppStore';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

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

    // Date Header Format: "Quarta-feira, 19 Fevereiro"
    const todayDate = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = todayDate.toLocaleDateString('pt-BR', dateOptions);
    // Capitalize first letter
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    // Filter today's tasks (Aggregation from ALL sources)
    const todayTasks = React.useMemo(() => {
        // Create local date string YYYY-MM-DD
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayYMD = `${year}-${month}-${day}`;

        return tasks.filter(t => {
            if (!t.scheduledAt) return false;

            // Convert task date/timestamp to Date object
            const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);

            // Create local string for task date (to compare only Day/Month/Year)
            const tYear = d.getFullYear();
            const tMonth = String(d.getMonth() + 1).padStart(2, '0');
            const tDay = String(d.getDate()).padStart(2, '0');
            const taskYMD = `${tYear}-${tMonth}-${tDay}`;

            // Return true if same day AND not completed (to "sumir da lista ativa")
            return taskYMD === todayYMD && !t.completed;
        });
    }, [tasks]);

    const getCategoryBadge = (category) => {
        switch (category) {
            case 'nutrition': return { label: 'Nutrição', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)' };
            case 'studies': return { label: 'Estudos', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' };
            case 'work': return { label: 'Trabalho', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' };
            case 'projects': return { label: 'Projeto', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
            case 'house': return { label: 'Casa', color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)' };
            case 'personal': default: return { label: 'Tarefa', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' };
        }
    };

    const handleAdd = () => {
        if (newTaskTitle.trim()) {
            addTask({
                title: newTaskTitle,
                scheduledAt: new Date().toISOString(),
                category: 'personal',
                periodType: 'day'
            });
            setNewTaskTitle('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd();
    };

    return (
        <div className="tasks-section card">
            <h2 style={{ marginBottom: '4px', fontSize: '1.2rem', textTransform: 'capitalize' }}>
                {formattedDate}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)', fontSize: '0.9rem' }}>
                {todayTasks.length} tarefas para hoje
            </p>

            <div className="task-list">
                {todayTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-tertiary)' }}>
                        <p>Nenhuma tarefa pendente. Aproveite o dia!</p>
                    </div>
                )}

                {todayTasks.map(task => {
                    const badge = getCategoryBadge(task.category);
                    return (
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
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className={`task-title ${task.completed ? 'completed' : ''}`}>
                                    {task.title}
                                </span>
                                <span style={{
                                    fontSize: '0.65rem',
                                    color: badge.color,
                                    backgroundColor: badge.bg,
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    alignSelf: 'flex-start',
                                    marginTop: '2px',
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold'
                                }}>
                                    {badge.label}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* Quick Add with Button */}
                <div className="quick-add-container" style={{ display: 'flex', alignItems: 'center', marginTop: '12px', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="+ Adicionar tarefa rápida..."
                        className="quick-add-input"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{ flex: 1 }}
                    />
                    <button
                        onClick={handleAdd}
                        style={{
                            background: 'var(--primary-color)', color: 'white', border: 'none',
                            borderRadius: '8px', padding: '8px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <style>{`
                .task-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 0 8px; /* Added padding */
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
