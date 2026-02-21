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
        <div className="card fade-in" style={{
            marginBottom: '20px',
            padding: '0',
            overflow: 'hidden',
            background: isCompleted ? 'linear-gradient(135deg, var(--surface-color) 0%, rgba(16, 185, 129, 0.05) 100%)' : 'var(--surface-color)',
            border: isCompleted ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-color)'
        }}>
            {/* Header */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    cursor: 'pointer'
                }}
            >
                <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '16px',
                    backgroundColor: isCompleted ? '#10B981' : 'rgba(124, 92, 255, 0.08)',
                    color: isCompleted ? 'white' : '#7C5CFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: isCompleted ? '0 8px 16px rgba(16, 185, 129, 0.2)' : 'none',
                    transition: 'all 0.3s'
                }}>
                    <Trophy size={26} />
                </div>

                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '8px' }}>
                        {goal.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            flex: 1,
                            height: '6px',
                            backgroundColor: 'rgba(0,0,0,0.03)',
                            borderRadius: '3px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                backgroundColor: isCompleted ? '#10B981' : '#7C5CFF',
                                borderRadius: '3px',
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                            }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: isCompleted ? '#10B981' : 'var(--text-tertiary)' }}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={(e) => { e.stopPropagation(); if (confirm('Excluir esta meta?')) removeGoal(goal.id); }}
                        style={{ padding: '8px', color: 'var(--danger-color)', opacity: 0.2, border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                        <Trash2 size={18} />
                    </button>
                    {isExpanded ? <ChevronDown size={20} style={{ opacity: 0.3 }} /> : <ChevronRight size={20} style={{ opacity: 0.3 }} />}
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="fade-in" style={{ padding: '0 24px 24px 24px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ padding: '16px 0', borderBottom: '1px dashed var(--border-color)', marginBottom: '16px' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Passo a passo para a vitória
                        </p>
                    </div>

                    {/* Steps List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        {goal.steps.length === 0 && (
                            <div style={{ padding: '20px', textAlign: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '16px' }}>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                                    Defina as microetapas para alcançar seu objetivo.
                                </p>
                            </div>
                        )}
                        {goal.steps.map(step => (
                            <div key={step.id}
                                onClick={() => toggleGoalStep(goal.id, step.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    borderRadius: '14px',
                                    backgroundColor: step.completed ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-color)',
                                    cursor: 'pointer',
                                    border: '1px solid var(--border-color)',
                                    transition: 'all 0.2s'
                                }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${step.completed ? '#10B981' : 'var(--border-color)'}`,
                                    backgroundColor: step.completed ? '#10B981' : 'transparent',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    {step.completed && <CheckCircle size={16} strokeWidth={3} />}
                                </div>
                                <span style={{
                                    flex: 1,
                                    fontSize: '0.95rem',
                                    fontWeight: '600',
                                    textDecoration: step.completed ? 'line-through' : 'none',
                                    color: step.completed ? 'var(--text-secondary)' : 'var(--text-primary)'
                                }}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Add Step Input */}
                    <form onSubmit={handleAddStep} style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-color)', borderRadius: '14px', padding: '0 16px', border: '1px solid var(--border-color)' }}>
                            <Plus size={18} style={{ color: 'var(--text-tertiary)' }} />
                            <input
                                type="text"
                                value={newStep}
                                onChange={(e) => setNewStep(e.target.value)}
                                placeholder="Adicionar nova etapa..."
                                style={{
                                    flex: 1,
                                    padding: '12px 10px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    color: 'var(--text-primary)',
                                    outline: 'none'
                                }}
                            />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

const GoalsView = () => {
    const { userData, addGoal, removeGoal, toggleGoalStep, addGoalStep } = useAppStore();
    const goals = userData?.goals || [];
    const [newGoalTitle, setNewGoalTitle] = useState('');

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!newGoalTitle.trim()) return;
        addGoal({ title: newGoalTitle, type: 'personal' });
        setNewGoalTitle('');
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 className="text-xl">Grandes Metas</h2>
                <p className="text-sm text-secondary">A jornada para o sucesso começa com um plano</p>
            </div>

            {/* Quick Add Goal */}
            <div className="card fade-in" style={{ marginBottom: '32px', padding: '20px', background: 'linear-gradient(135deg, var(--surface-color) 0%, rgba(124, 92, 255, 0.02) 100%)' }}>
                <form onSubmit={handleAddGoal} style={{ display: 'flex', gap: '12px' }}>
                    <input
                        type="text"
                        value={newGoalTitle}
                        onChange={(e) => setNewGoalTitle(e.target.value)}
                        placeholder="Qual seu próximo grande sonho?"
                        style={{
                            flex: 1,
                            padding: '16px 20px',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            outline: 'none',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newGoalTitle.trim()}
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '18px',
                            backgroundColor: 'var(--text-primary)',
                            color: 'white',
                            border: 'none',
                            opacity: newGoalTitle.trim() ? 1 : 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                    >
                        <Plus size={28} strokeWidth={2.5} />
                    </button>
                </form>
            </div>

            {/* Goals List */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {goals.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--surface-color)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                        <Trophy size={48} style={{ color: 'var(--border-color)', marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', fontWeight: '800' }}>Nenhuma meta definida</h3>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', maxWidth: '240px', margin: '0 auto' }}>
                            Seu futuro começa agora. Adicione sua primeira meta!
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
