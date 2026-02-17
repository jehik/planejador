import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, CheckCircle, Circle, Trophy } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const GoalItem = ({ goal, removeGoal, toggleGoalStep, addGoalStep }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [newStep, setNewStep] = useState('');

    const completedSteps = goal.steps.filter(s => s.completed).length;
    const totalSteps = goal.steps.length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    const isCompleted = totalSteps > 0 && progress === 100;

    const handleAddStep = (e) => {
        e.preventDefault();
        if (!newStep.trim()) return;
        addGoalStep(goal.id, newStep);
        setNewStep('');
    };

    return (
        <div style={{
            backgroundColor: 'var(--surface-color)',
            borderRadius: '16px',
            marginBottom: '16px',
            border: '1px solid var(--border-color)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
        }}>
            {/* Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                }}
            >
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? 'var(--success-color)' : 'var(--primary-soft)',
                    color: isCompleted ? 'white' : 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Trophy size={20} />
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        {goal.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <div style={{
                            flex: 1,
                            height: '6px',
                            backgroundColor: 'var(--border-color)',
                            borderRadius: '3px',
                            maxWidth: '100px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: isCompleted ? 'var(--success-color)' : 'var(--primary-color)',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                <button
                    onClick={(e) => { e.stopPropagation(); removeGoal(goal.id); }}
                    style={{ color: 'var(--text-secondary)', opacity: 0.5 }}
                >
                    <Trash2 size={18} />
                </button>

                {isExpanded ? <ChevronDown size={20} color="var(--text-secondary)" /> : <ChevronRight size={20} color="var(--text-secondary)" />}
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid var(--border-color)' }}>
                    <h4 style={{ margin: '12px 0 8px 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Microetapas
                    </h4>

                    {/* Steps List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {goal.steps.length === 0 && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                                Nenhuma etapa definida. Adicione pequenas vitórias.
                            </p>
                        )}
                        {goal.steps.map(step => (
                            <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <button onClick={() => toggleGoalStep(goal.id, step.id)} style={{ color: step.completed ? 'var(--success-color)' : 'var(--text-secondary)' }}>
                                    {step.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                                </button>
                                <span style={{
                                    flex: 1,
                                    fontSize: '0.95rem',
                                    textDecoration: step.completed ? 'line-through' : 'none',
                                    color: step.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                                }}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Add Step Input */}
                    <form onSubmit={handleAddStep} style={{ display: 'flex', gap: '8px' }}>
                        <input
                            type="text"
                            value={newStep}
                            onChange={(e) => setNewStep(e.target.value)}
                            placeholder="+ Adicionar etapa"
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-color)',
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)'
                            }}
                        />
                    </form>
                </div>
            )}
        </div>
    );
};

const GoalsView = () => {
    const { activeUser, users, addGoal, removeGoal, toggleGoalStep, addGoalStep } = useAppStore();
    const goals = users[activeUser]?.goals || [];
    const [newGoalTitle, setNewGoalTitle] = useState('');

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        addGoal({ title: newGoalTitle, type: 'personal' }); // default type
        setNewGoalTitle('');
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Minhas Metas</h2>

            {/* Add Goal Form */}
            <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input
                    type="text"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="Qual seu próximo grande objetivo?"
                    style={{
                        flex: 1,
                        padding: '16px',
                        borderRadius: '16px',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--surface-color)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem'
                    }}
                />
                <button
                    type="submit"
                    disabled={!newGoalTitle.trim()}
                    style={{
                        padding: '16px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        opacity: newGoalTitle.trim() ? 1 : 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Plus size={24} />
                </button>
            </form>

            {/* Goals List */}
            <div>
                {goals.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px' }}>
                        <Trophy size={48} color="var(--border-color)" style={{ marginBottom: '16px' }} />
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Você ainda não tem metas. Comece pequeno!
                        </p>
                    </div>
                ) : (
                    goals.map(goal => (
                        <GoalItem
                            key={goal.id}
                            goal={goal}
                            removeGoal={removeGoal}
                            toggleGoalStep={toggleGoalStep}
                            addGoalStep={addGoalStep}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default GoalsView;
