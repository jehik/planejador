import React from 'react';
import { ChevronRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const GoalCard = ({ goal }) => {
    // New logic: count steps if they exist, else fallback or 0
    const totalSteps = goal.steps?.length || 0;
    const completedSteps = goal.steps?.filter(s => s.completed).length || 0;

    // If no steps, assume 0% unless manual progress exists (legacy)
    const percentage = totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : (goal.target ? Math.round((goal.progress / goal.target) * 100) : 0);

    return (
        <div style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-sm)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-soft)',
                color: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase'
            }}>
                {(goal.type || 'Geral').substring(0, 3)}
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    fontSize: 'var(--font-size-base)',
                    fontWeight: 'var(--font-weight-medium)',
                    marginBottom: '4px'
                }}>
                    {goal.title}
                </h4>
                <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'var(--border-color)',
                    borderRadius: 'var(--radius-full)'
                }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: 'var(--success-color)',
                        borderRadius: 'var(--radius-full)'
                    }} />
                </div>
            </div>

            <ChevronRight size={20} color="var(--text-secondary)" />
        </div>
    );
};

const GoalsPreview = () => {
    const { activeUser, users } = useAppStore();
    const goals = users[activeUser]?.goals || [];

    return (
        <div className="fade-in">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-md)'
            }}>
                <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)'
                }}>
                    Visão Geral de Metas
                </h3>
                <button style={{ color: 'var(--primary-color)', fontSize: 'var(--font-size-sm)', fontWeight: '500' }}>
                    Ver Tudo
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {goals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} />
                ))}
                {/* Mock Long term if not in store for previe */}
                <GoalCard goal={{ id: 3, type: 'Longo', title: 'Comprar uma Casa', progress: 10, target: 100 }} />
            </div>
        </div>
    );
};

export default GoalsPreview;
