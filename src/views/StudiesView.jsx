import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { BookOpen, Plus, ArrowRight, Trash2, CheckCircle, Sun, Sunset, Moon, AlignLeft } from 'lucide-react';

const StudiesView = () => {
    const { userData, addStudy, deleteStudy, addTask, tasks, toggleTask, deleteTask } = useAppStore();
    const studies = userData?.studies || [];

    const [activeStudy, setActiveStudy] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');

    // Activity State
    const [newActivity, setNewActivity] = useState('');
    const [period, setPeriod] = useState(null);
    const [notes, setNotes] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [isAddingActivity, setIsAddingActivity] = useState(false);

    const daysOfWeek = [
        { id: 'sun', label: 'Dom' },
        { id: 'mon', label: 'Seg' },
        { id: 'tue', label: 'Ter' },
        { id: 'wed', label: 'Qua' },
        { id: 'thu', label: 'Qui' },
        { id: 'fri', label: 'Sex' },
        { id: 'sat', label: 'Sáb' }
    ];

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#F59E0B' },
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#F97316' },
        { id: 'night', label: 'Noite', icon: Moon, color: '#8B5CF6' }
    ];

    const handleAddStudy = (e) => {
        if (e) e.preventDefault();
        if (!title.trim()) return;
        addStudy({ title, color: '#8B5CF6' });
        setIsAdding(false);
        setTitle('');
    };

    const handleAddActivity = (e) => {
        if (e) e.preventDefault();
        if (!newActivity.trim()) return;
        addTask({
            title: newActivity,
            studyId: activeStudy.id,
            category: 'studies',
            scheduledAt: new Date().toISOString(),
            periodType: 'day',
            period: period,
            description: notes,
            days: selectedDays
        });
        setNewActivity('');
        setNotes('');
        setPeriod(null);
        setSelectedDays([]);
        setIsAddingActivity(false);
    };

    const toggleDaySelection = (dayId) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const studyTasks = activeStudy
        ? tasks.filter(t => t.studyId === activeStudy.id)
        : [];

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
            {!activeStudy ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h2 className="text-xl">Estudos</h2>
                            <p className="text-sm text-secondary">Expanda seus horizontes</p>
                        </div>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            style={{
                                width: '44px', height: '44px',
                                borderRadius: '14px',
                                backgroundColor: isAdding ? 'var(--text-primary)' : 'rgba(139, 92, 246, 0.08)',
                                color: isAdding ? 'white' : '#8B5CF6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                            }}>
                            {isAdding ? <X size={20} /> : <Plus size={24} strokeWidth={2.5} />}
                        </button>
                    </div>

                    {isAdding && (
                        <div className="card fade-in" style={{ marginBottom: '32px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                            <form onSubmit={handleAddStudy}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Nova Matéria</label>
                                <input
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    placeholder="Ex: Matemática, Inglês, Programação..."
                                    autoFocus
                                    style={{
                                        width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)',
                                        border: '1px solid var(--border-color)', borderRadius: '12px',
                                        fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none',
                                        marginBottom: '16px'
                                    }}
                                />
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#8B5CF6', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)' }}>
                                    Criar Matéria
                                </button>
                            </form>
                        </div>
                    )}

                    {studies.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 24px', opacity: 0.5 }}>
                            <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.1 }} />
                            <p style={{ fontWeight: '600' }}>Nenhuma matéria cadastrada.</p>
                            <p className="text-sm">Comece adicionando o que você está estudando.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                            {studies.map(study => {
                                const relevantTasks = tasks.filter(t => t.studyId === study.id);
                                const completed = relevantTasks.filter(t => t.completed).length;
                                const progress = relevantTasks.length > 0 ? Math.round((completed / relevantTasks.length) * 100) : 0;

                                return (
                                    <div key={study.id} className="card fade-in" onClick={() => setActiveStudy(study)} style={{ cursor: 'pointer', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: '180px', justifyContent: 'center' }}>
                                        <div style={{
                                            width: '56px', height: '56px', borderRadius: '18px',
                                            backgroundColor: 'rgba(139, 92, 246, 0.08)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#8B5CF6', marginBottom: '16px'
                                        }}>
                                            <BookOpen size={28} />
                                        </div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>{study.title}</h3>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{relevantTasks.length} Atividades</p>

                                        <div style={{ width: '100%', marginTop: 'auto', paddingTop: '16px' }}>
                                            <div style={{ height: '4px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' }}>
                                                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#8B5CF6', transition: 'width 0.6s ease' }} />
                                            </div>
                                            <span style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{progress}% Concluído</span>
                                        </div>

                                        <button onClick={(e) => { e.stopPropagation(); deleteStudy(study.id); }} style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--danger-color)', opacity: 0.2, border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <div className="fade-in">
                    <button onClick={() => setActiveStudy(null)} style={{ border: 'none', background: 'none', color: '#8B5CF6', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>
                        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Voltar para Estudos
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{activeStudy.title}</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Gerencie suas metas de aprendizado</p>
                        </div>
                        <button
                            onClick={() => setIsAddingActivity(!isAddingActivity)}
                            style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                backgroundColor: isAddingActivity ? 'var(--text-primary)' : 'rgba(139, 92, 246, 0.08)',
                                color: isAddingActivity ? 'white' : '#8B5CF6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
                            }}
                        >
                            {isAddingActivity ? <X size={18} /> : <Plus size={20} />}
                        </button>
                    </div>

                    {isAddingActivity && (
                        <div className="card fade-in" style={{ marginBottom: '32px', border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                            <form onSubmit={handleAddActivity}>
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Atividade / Tópico</label>
                                    <input
                                        value={newActivity} onChange={e => setNewActivity(e.target.value)}
                                        placeholder="Ex: Estudar capítulo 4, Responder lista..."
                                        autoFocus
                                        style={{
                                            width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)',
                                            border: '1px solid var(--border-color)', borderRadius: '12px',
                                            fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none'
                                        }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Período</label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {periods.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => setPeriod(period === p.id ? null : p.id)}
                                                style={{
                                                    flex: 1, padding: '12px 8px', borderRadius: '12px', border: 'none',
                                                    backgroundColor: period === p.id ? p.color : 'rgba(0,0,0,0.03)',
                                                    color: period === p.id ? 'white' : 'var(--text-secondary)',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                                    cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                            >
                                                <p.icon size={18} />
                                                <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{p.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Dias de Estudo</label>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                                        {daysOfWeek.map(day => (
                                            <button
                                                key={day.id}
                                                type="button"
                                                onClick={() => toggleDaySelection(day.id)}
                                                style={{
                                                    flex: 1, height: '36px', borderRadius: '10px', border: 'none',
                                                    backgroundColor: selectedDays.includes(day.id) ? 'var(--text-primary)' : 'rgba(0,0,0,0.03)',
                                                    color: selectedDays.includes(day.id) ? 'white' : 'var(--text-secondary)',
                                                    fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                                                }}
                                            >
                                                {day.label.charAt(0)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Anotações</label>
                                    <div style={{ position: 'relative' }}>
                                        <AlignLeft size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-tertiary)' }} />
                                        <textarea
                                            placeholder="Detalhes sobre a revisão ou exercício..."
                                            value={notes} onChange={(e) => setNotes(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                                backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', fontSize: '0.9rem',
                                                minHeight: '80px', outline: 'none', resize: 'none'
                                            }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#8B5CF6', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)' }}
                                >
                                    Adicionar ao Plano
                                </button>
                            </form>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {studyTasks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '48px 24px', opacity: 0.5 }}>
                                <p style={{ fontWeight: '600' }}>Nenhuma atividade para esta matéria.</p>
                                <p className="text-sm">Mantenha seu foco e organização!</p>
                            </div>
                        ) : (
                            studyTasks.map(task => {
                                const taskPeriod = periods.find(p => p.id === task.period);
                                return (
                                    <div key={task.id} className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                        <button
                                            onClick={() => toggleTask(task.id, task.completed)}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                border: `2px solid ${task.completed ? '#10B981' : 'var(--border-color)'}`,
                                                backgroundColor: task.completed ? '#10B981' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, marginTop: '2px'
                                            }}
                                        >
                                            {task.completed && <CheckCircle size={20} strokeWidth={3} />}
                                        </button>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                fontSize: '1rem', fontWeight: '700',
                                                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                marginBottom: '6px'
                                            }}>
                                                {task.title}
                                            </h4>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                                {taskPeriod && (
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.02em',
                                                        color: taskPeriod.color, backgroundColor: `${taskPeriod.color}15`, padding: '2px 8px', borderRadius: '6px',
                                                        display: 'flex', alignItems: 'center', gap: '4px'
                                                    }}>
                                                        <taskPeriod.icon size={10} /> {taskPeriod.label}
                                                    </span>
                                                )}
                                                {task.days && task.days.length > 0 && (
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        {task.days.map(d => (
                                                            <span key={d} style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-tertiary)' }}>
                                                                {daysOfWeek.find(dw => dw.id === d)?.label.charAt(0)}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {task.description && (
                                                <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            style={{ padding: '4px', color: 'var(--danger-color)', opacity: 0.2, border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudiesView;
