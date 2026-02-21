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

    const todayDate = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = todayDate.toLocaleDateString('pt-BR', dateOptions);
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    const todayTasks = React.useMemo(() => {
        const now = new Date();
        const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        return tasks.filter(t => {
            if (!t.scheduledAt) return false;
            const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);
            const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return taskYMD === todayYMD && !t.completed;
        });
    }, [tasks]);

    const getCategoryBadge = (category) => {
        switch (category) {
            case 'nutrition': return { label: 'Nutrição', color: '#007AFF', bg: 'rgba(0, 122, 255, 0.08)' };
            case 'studies': return { label: 'Estudos', color: '#5856D6', bg: 'rgba(88, 86, 214, 0.08)' };
            case 'work': return { label: 'Trabalho', color: '#FF9500', bg: 'rgba(255, 149, 0, 0.08)' };
            case 'projects': return { label: 'Projeto', color: '#34C759', bg: 'rgba(52, 199, 89, 0.08)' };
            case 'house': return { label: 'Casa', color: '#FF2D55', bg: 'rgba(255, 45, 85, 0.08)' };
            case 'personal': default: return { label: 'Tarefa', color: '#8E8E93', bg: 'rgba(142, 142, 147, 0.08)' };
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

    return (
        <div className="card" style={{ padding: '24px', borderColor: 'rgba(0,0,0,0.03)' }}>
            <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em', textTransform: 'capitalize', marginBottom: '4px' }}>
                    {formattedDate}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>
                    {todayTasks.length === 0 ? 'Tudo pronto para hoje!' : `${todayTasks.length} pendentes`}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {todayTasks.map(task => {
                    const badge = getCategoryBadge(task.category);
                    return (
                        <div key={task.id}
                            onClick={() => toggleTask(task.id, task.completed)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                padding: '12px 14px',
                                borderRadius: '14px',
                                backgroundColor: 'rgba(0,0,0,0.015)',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                border: '2px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'transparent'
                            }}>
                                <CheckCircle2 size={14} strokeWidth={3} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                                    {task.title}
                                </div>
                                <span style={{
                                    fontSize: '0.65rem',
                                    color: badge.color,
                                    backgroundColor: badge.bg,
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.02em'
                                }}>
                                    {badge.label}
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    padding: '4px 4px 4px 16px',
                    borderRadius: '14px'
                }}>
                    <input
                        type="text"
                        placeholder="Adicionar tarefa..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            padding: '10px 0',
                            outline: 'none',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        onClick={handleAdd}
                        style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={20} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeView;
