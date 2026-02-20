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

    const daysOfWeek = [
        { id: 'sun', label: 'D' },
        { id: 'mon', label: 'S' },
        { id: 'tue', label: 'T' },
        { id: 'wed', label: 'Q' },
        { id: 'thu', label: 'Q' },
        { id: 'fri', label: 'S' },
        { id: 'sat', label: 'S' }
    ];

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#F59E0B' },
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#F97316' },
        { id: 'night', label: 'Noite', icon: Moon, color: '#8B5CF6' }
    ];

    const handleAddStudy = (e) => {
        e.preventDefault();
        if (!title) return;
        addStudy({ title, color: '#8B5CF6' });
        setIsAdding(false);
        setTitle('');
    };

    const handleAddActivity = (e) => {
        e.preventDefault();
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
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {!activeStudy && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Meus Estudos</h2>
                    <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ borderRadius: '12px', padding: '8px 16px' }}>
                        <Plus size={20} /> <span style={{ marginLeft: '8px' }}>Matéria</span>
                    </button>
                </div>
            )}

            {activeStudy ? (
                // DETAIL
                <div className="fade-in">
                    <button onClick={() => setActiveStudy(null)} style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }}>
                        <ArrowRight size={16} transform="rotate(180)" /> Voltar
                    </button>

                    <div className="card" style={{ padding: '24px', marginBottom: '24px', borderLeft: '6px solid #8B5CF6' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeStudy.title}</h2>
                        <div style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>
                            {studyTasks.length} atividades registradas
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Atividades & Revisões</h3>

                        <form onSubmit={handleAddActivity} style={{ marginBottom: '20px' }}>
                            <input
                                value={newActivity} onChange={e => setNewActivity(e.target.value)}
                                placeholder="Adicionar tópico, exercício ou revisão..."
                                style={{
                                    width: '100%', padding: '12px', borderRadius: '8px',
                                    border: '1px solid var(--border-color)', background: 'var(--bg-color)',
                                    color: 'var(--text-primary)', marginBottom: '12px'
                                }}
                            />

                            {/* Options Row */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                                {/* Period */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {periods.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => setPeriod(period === p.id ? null : p.id)}
                                            className={`btn`}
                                            style={{
                                                flex: 1, padding: '8px', borderRadius: '8px',
                                                border: `1px solid ${period === p.id ? p.color : 'var(--border-color)'}`,
                                                backgroundColor: period === p.id ? `${p.color}20` : 'transparent',
                                                color: period === p.id ? p.color : 'var(--text-secondary)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                                fontSize: '0.8rem'
                                            }}
                                        >
                                            <p.icon size={14} /> {p.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Days */}
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    {daysOfWeek.map(day => (
                                        <button
                                            key={day.id}
                                            type="button"
                                            onClick={() => toggleDaySelection(day.id)}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                fontSize: '0.75rem', fontWeight: '600',
                                                border: '1px solid var(--border-color)',
                                                backgroundColor: selectedDays.includes(day.id) ? 'var(--primary-color)' : 'transparent',
                                                color: selectedDays.includes(day.id) ? 'white' : 'var(--text-secondary)',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            <div style={{ position: 'relative', marginBottom: '12px' }}>
                                <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-secondary)' }}><AlignLeft size={16} /></div>
                                <textarea
                                    placeholder="Anotações (opcional)..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    style={{
                                        width: '100%', padding: '10px 10px 10px 32px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                        backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem',
                                        minHeight: '60px', resize: 'vertical', fontFamily: 'inherit'
                                    }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', borderRadius: '8px' }}>
                                <Plus style={{ marginRight: '8px' }} /> Adicionar Atividade
                            </button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {studyTasks.map(task => {
                                const taskPeriod = periods.find(p => p.id === task.period);
                                return (
                                    <div key={task.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border-color)' }}>
                                        <button
                                            onClick={() => toggleTask(task.id, task.completed)}
                                            style={{ border: 'none', background: 'none', cursor: 'pointer', color: task.completed ? '#10B981' : 'var(--text-secondary)', marginTop: '2px' }}
                                        >
                                            <CheckCircle size={20} fill={task.completed ? "currentColor" : "none"} />
                                        </button>
                                        <div style={{ flex: 1 }}>
                                            <span style={{
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                fontWeight: '500'
                                            }}>
                                                {task.title}
                                            </span>

                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
                                                {taskPeriod && (
                                                    <span style={{
                                                        fontSize: '0.7rem', color: taskPeriod.color,
                                                        backgroundColor: `${taskPeriod.color}15`,
                                                        padding: '2px 8px', borderRadius: '4px',
                                                        display: 'flex', alignItems: 'center', gap: '4px'
                                                    }}>
                                                        <taskPeriod.icon size={10} /> {taskPeriod.label}
                                                    </span>
                                                )}
                                                {task.days && task.days.length > 0 && (
                                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                                        {task.days.map(d => daysOfWeek.find(dw => dw.id === d)?.label).join(', ')}
                                                    </span>
                                                )}
                                            </div>

                                            {task.description && (
                                                <div style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                    {task.description}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                // LIST
                <>
                    {studies.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-color)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#8B5CF6' }}>
                                <BookOpen size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 'bold' }}>Organize seus Estudos</h3>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Crie matérias e adicione atividades para acompanhar seu aprendizado.</p>
                            <button onClick={() => setIsAdding(true)} className="btn btn-ghost">Criar primeira matéria</button>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                            {studies.map(study => {
                                const studyTasks = tasks.filter(t => t.studyId === study.id);
                                const total = studyTasks.length;
                                const completed = studyTasks.filter(t => t.completed).length;
                                const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

                                return (
                                    <div key={study.id} className="card" onClick={() => setActiveStudy(study)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                                        <div style={{ marginBottom: '12px', color: '#8B5CF6' }}>
                                            <BookOpen size={32} />
                                        </div>
                                        <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{study.title}</h3>

                                        {/* Progress Bar */}
                                        <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--surface-hover)', borderRadius: '3px', marginTop: '16px', overflow: 'hidden' }}>
                                            <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#8B5CF6', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{progress}% concluído</span>

                                        <button onClick={(e) => { e.stopPropagation(); deleteStudy(study.id); }} style={{ position: 'absolute', top: '10px', right: '10px', color: 'var(--text-tertiary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            {isAdding && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px' }}>Nova Matéria</h3>
                        <form onSubmit={handleAddStudy}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Nome da Matéria</label>
                                <input
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    required
                                    autoFocus
                                    placeholder="Ex: Matemática, Inglês..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudiesView;
