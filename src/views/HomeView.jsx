import React from 'react';
import MotivationalQuote from '../components/home/MotivationalQuote';
import PomodoroTimer from '../components/home/PomodoroTimer';
import MentorCard from '../components/home/MentorCard';
import DreamBoard from '../components/dream/DreamBoard';
import useAppStore from '../store/useAppStore';
import { CheckCircle2, Plus, AlertTriangle, ArrowRight } from 'lucide-react';

const HomeView = () => {
    return (
        <div className="fade-in" style={{
            paddingBottom: '120px',
            paddingTop: '80px',
            paddingLeft: '24px',
            paddingRight: '24px'
        }}>
            <div style={{ marginBottom: '32px' }}>
                <MotivationalQuote />
            </div>

            {/* Main Interactive Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '24px',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {/* Mentor AI Advice Section */}
                <div style={{ width: '100%' }}>
                    <MentorCard />
                </div>

                {/* 1. Pomodoro Timer Section */}
                <section style={{ width: '100%' }}>
                    <div className="card fade-in" style={{
                        padding: '24px',
                        width: '100%',
                        background: 'linear-gradient(135deg, var(--surface-color) 0%, rgba(124, 92, 255, 0.03) 100%)',
                        border: '1px solid rgba(124, 92, 255, 0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <PomodoroTimer />
                    </div>
                </section>

                {/* 2. Daily Tasks Section */}
                <section style={{ width: '100%' }}>
                    <SimpleTaskList />
                </section>

                {/* 3. Dream Board Section */}
                <section style={{ width: '100%' }}>
                    <div style={{ marginBottom: '16px', paddingLeft: '8px' }}>
                        <h3 className="text-xl">Quadro de Sonhos</h3>
                        <p className="text-sm text-secondary">Visualize seu futuro</p>
                    </div>
                    <div className="card fade-in" style={{
                        padding: '0',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }}>
                        <DreamBoard />
                    </div>
                </section>
            </div>
        </div>
    );
};

// Sub-component for tasks to keep HomeView clean
const SimpleTaskList = () => {
    const { tasks, toggleTask, addTask, setActiveTab, userData, toggleWorkout } = useAppStore();
    const [newTaskTitle, setNewTaskTitle] = React.useState('');

    const todayDate = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateString = todayDate.toLocaleDateString('pt-BR', dateOptions);
    const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

    const todayTasks = React.useMemo(() => {
        const now = new Date();
        const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const dayNamesEN = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        const dayNamesPT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const currentDayEN = dayNamesEN[now.getDay()];
        const currentDayPT = dayNamesPT[now.getDay()];

        // 1. Filtrar tarefas normais e recorrentes
        const normalTasks = tasks.filter(t => {
            if (t.completed) return false;

            // Checar data específica
            if (t.scheduledAt) {
                const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);
                const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (taskYMD === todayYMD) return true;
            }

            // Checar recorrência
            if (t.recurrence && t.recurrence.includes(currentDayEN)) return true;

            return false;
        });

        // 2. Incluir treinos se houver
        const workoutTasks = (userData?.workouts || [])
            .filter(w => w.days?.includes(currentDayPT) && w.lastCompleted !== todayYMD)
            .map(w => ({
                id: w.id,
                title: w.title,
                category: 'workouts',
                isWorkout: true,
                completed: false
            }));

        return [...normalTasks, ...workoutTasks];
    }, [tasks, userData?.workouts]);

    const getCategoryBadge = (category) => {
        switch (category) {
            case 'nutrition': return { label: 'Nutrição', color: '#FF2D55', tab: 'nutrition' };
            case 'studies': return { label: 'Estudos', color: '#5856D6', tab: 'studies' };
            case 'work': return { label: 'Trabalho', color: '#FF9500', tab: 'tasks' };
            case 'projects': return { label: 'Projeto', color: '#34C759', tab: 'projects' };
            case 'house': return { label: 'Casa', color: '#AF52DE', tab: 'house' };
            case 'travel': return { label: 'Viagem', color: '#007AFF', tab: 'travel' };
            case 'finance': return { label: 'Finanças', color: '#34C759', tab: 'finance' };
            case 'relationship': return { label: 'Nós', color: '#FF2D78', tab: 'relationship' };
            case 'restrictions': return { label: 'Foco', color: '#8E8E93', tab: 'restrictions' };
            case 'workouts': return { label: 'Treino', color: '#FF2D55', tab: 'workouts' };
            case 'shopping': case 'compras': return { label: 'Mercado', color: '#34C759', tab: 'shopping' };
            case 'personal': default: return { label: 'Tarefa', color: '#8E8E93', tab: 'tasks' };
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
        <div className="card fade-in" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                        {formattedDate}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>
                        {todayTasks.length === 0 ? 'Tudo em dia por aqui!' : `${todayTasks.length} pendentes para hoje`}
                    </p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={24} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {todayTasks.length > 0 ? (
                    todayTasks.map(task => {
                        const badge = getCategoryBadge(task.category);
                        return (
                            <div key={task.id}
                                onClick={() => task.isWorkout ? toggleWorkout(task.id) : toggleTask(task.id, task.completed)}
                                className="fade-in"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    backgroundColor: 'var(--bg-color)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: '2px solid var(--border-color)',
                                    transition: 'all 0.3s',
                                    flexShrink: 0
                                }}>
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        marginBottom: '4px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {task.title}
                                    </div>
                                    <span style={{
                                        fontSize: '0.65rem',
                                        color: badge.color,
                                        backgroundColor: `${badge.color}15`,
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {badge.label}
                                    </span>
                                </div>
                                <ArrowRight
                                    size={16}
                                    onClick={(e) => {
                                        e.stopPropagation(); // IMPORTANTE: Impede marcar como concluído
                                        if (badge.tab) setActiveTab(badge.tab);
                                    }}
                                    style={{
                                        color: 'var(--text-tertiary)',
                                        opacity: 0.6,
                                        flexShrink: 0,
                                        padding: '8px',
                                        marginRight: '-8px',
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)' }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Incrível! Você concluiu tudo.</p>
                    </div>
                )}

                <div style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: 'var(--bg-color)',
                    padding: '6px 6px 6px 20px',
                    borderRadius: '18px',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                }}>
                    <input
                        type="text"
                        placeholder="Nova tarefa hoje..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            padding: '10px 0',
                            outline: 'none',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        onClick={handleAdd}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '14px',
                            backgroundColor: 'var(--text-primary)',
                            color: 'white',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'transform 0.2s active'
                        }}
                    >
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeView;
