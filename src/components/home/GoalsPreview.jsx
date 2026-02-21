import React from 'react';
import { ChevronRight } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const GoalCard = ({ goal }) => {
    const totalSteps = goal.steps?.length || 0;
    const completedSteps = goal.steps?.filter(s => s.completed).length || 0;

    const percentage = totalSteps > 0
        ? Math.round((completedSteps / totalSteps) * 100)
        : (goal.target ? Math.round((goal.progress / goal.target) * 100) : 0);

    return (
        <div className="card" style={{
            padding: '16px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            borderColor: 'rgba(0,0,0,0.03)',
            cursor: 'pointer'
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 122, 255, 0.08)',
                color: 'var(--primary-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: '800',
                textTransform: 'uppercase',
                letterSpacing: '0.02em'
            }}>
                {(goal.type || 'Geral').substring(0, 3)}
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    marginBottom: '6px',
                    letterSpacing: '-0.02em'
                }}>
                    {goal.title}
                </h4>
                <div style={{
                    width: '100%',
                    height: '4px',
                    backgroundColor: 'rgba(0,0,0,0.03)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: 'var(--success-color)',
                        borderRadius: '2px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)' }}>{percentage}%</span>
                <ChevronRight size={16} color="var(--text-tertiary)" strokeWidth={2.5} />
            </div>
        </div>
    );
};

const GoalsPreview = () => {
    const { userData } = useAppStore();
    const goals = userData?.goals || [];

    return (
        <div className="fade-in">
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
            }}>
                <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    letterSpacing: '-0.03em'
                }}>
                    Visão Geral de Metas
                </h3>
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
