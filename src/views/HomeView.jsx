import React, { useMemo } from 'react';
import useAppStore from '../store/useAppStore';
import { classifyTask, getPeriodColor } from '../utils/timeUtils';
import { Bell, AlertTriangle, CheckCircle, Clock, Calendar } from 'lucide-react';

const DashboardCard = ({ title, count, color, icon: Icon, onClick }) => (
    <div
        onClick={onClick}
        className="fade-in"
        style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            cursor: onClick ? 'pointer' : 'default',
            border: `1px solid ${color || 'transparent'}`,
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: color || 'var(--text-primary)'
        }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{title}</h3>
            {Icon && <Icon size={20} />}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {count}
        </div>
        {/* Decorator */}
        <div style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            opacity: 0.1,
            transform: 'rotate(-15deg)'
        }}>
            {Icon && <Icon size={80} color={color} />}
        </div>
    </div>
);

const HomeView = () => {
    const { tasks, userData, activeTab, setActiveTab } = useAppStore();
    const userName = userData?.name?.split(' ')[0] || 'Visitante';

    // 1. Aggregation Logic
    const summary = useMemo(() => {
        const stats = {
            late: 0,
            today: 0,
            future: 0,
            completedToday: 0,
            nextMeal: null
        };

        const now = new Date();

        tasks.forEach(task => {
            const status = classifyTask(task);

            if (status === 'late') stats.late++;
            if (status === 'today') stats.today++;
            if (status === 'future') stats.future++;

            // Completed Today logic
            // Assuming we check task.completedAt or just 'completed' status + date match?
            // For now, simple completed count total or just current view

            // Nutrition: Find next meal
            if (task.category === 'nutrition' && !task.completed) {
                // Simple logic: first one found sorted by time (store sorts by asc)
                // Filter out past meals?
                if (!stats.nextMeal && new Date(task.scheduledAt) > now) {
                    stats.nextMeal = task;
                }
            }
        });

        return stats;
    }, [tasks]);

    return (
        <div style={{ padding: '20px 20px 100px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Header / Greeting */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>
                        Olá, {userName}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Visão Geral do Dia
                    </p>
                </div>
                <div style={{
                    width: '40px', height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--surface-color)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <Bell size={20} />
                </div>
            </div>

            {/* Smart Alerts */}
            {summary.late > 0 && (
                <div
                    onClick={() => setActiveTab('tasks')}
                    className="fade-in"
                    style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '16px',
                        padding: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        cursor: 'pointer'
                    }}
                >
                    <div style={{
                        backgroundColor: '#FEE2E2',
                        padding: '10px',
                        borderRadius: '12px',
                        color: '#DC2626'
                    }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <h3 style={{ color: '#991B1B', fontWeight: '700', fontSize: '1rem' }}>Atenção</h3>
                        <p style={{ color: '#B91C1C', fontSize: '0.9rem' }}>
                            Você tem {summary.late} tarefas atrasadas!
                        </p>
                    </div>
                </div>
            )}

            {/* Grid Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <DashboardCard
                    title="Hoje"
                    count={summary.today}
                    icon={CheckSquareIcon}
                    color="var(--warning-color)"
                    onClick={() => setActiveTab('tasks')}
                />
                <DashboardCard
                    title="Futuras"
                    count={summary.future}
                    icon={Calendar}
                    color="var(--info-color)"
                    onClick={() => setActiveTab('tasks')}
                />
            </div>

            {/* Sections */}

            {/* Next Task / Meal */}
            <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Próxima Ação</h2>
                {summary.nextMeal ? (
                    <div style={{
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        padding: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        borderLeft: '4px solid var(--primary-color)',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        <Clock size={24} color="var(--primary-color)" />
                        <div>
                            <span style={{
                                fontSize: '0.8rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                color: 'var(--text-secondary)',
                                fontWeight: '600'
                            }}>
                                Nutrição
                            </span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                {summary.nextMeal.title || 'Refeição'}
                            </h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                {new Date(summary.nextMeal.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div style={{
                        padding: '24px',
                        textAlign: 'center',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        color: 'var(--text-secondary)'
                    }}>
                        <p>Tudo em dia! Nenhuma ação imediata.</p>
                    </div>
                )}
            </div>

            {/* Trip Goal Mini-View */}
            <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Meta de Viagem</h2>
                <div
                    onClick={() => setActiveTab('trip')}
                    style={{
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '16px',
                        padding: '20px',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontWeight: '600' }}>Economia Viagem</span>
                        <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                            {Math.round((userData?.finance?.savingsCurrent || 0) / (userData?.finance?.savingsGoal || 1) * 100)}%
                        </span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: 'var(--bg-color)',
                        borderRadius: '5px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${Math.min(100, (userData?.finance?.savingsCurrent || 0) / (userData?.finance?.savingsGoal || 1) * 100)}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary-color)',
                            transition: 'width 0.5s ease-out'
                        }} />
                    </div>
                </div>
            </div>

        </div>
    );
};

// Helper Icon
const CheckSquareIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
);

export default HomeView;
