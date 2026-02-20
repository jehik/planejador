import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { BookOpen, Plus, ArrowRight, Trash2, CheckCircle } from 'lucide-react';

const StudiesView = () => {
    // We'll reuse the 'Projects' structure logic but filter by 'category' = 'studies' if we wanted to unify, 
    // OR we can create a 'studies' array in store.
    // For simplicity, let's assume we use 'projects' array in store BUT filtered by 'type': 'study' OR just use 'studies' slice if we added it?
    // Checking `useAppStore`: we don't have a `studies` slice.
    // We can add it OR map it to `projects` but that's messy.
    // Let's add `studies` slice to `useAppStore` in the next step. For now, I'll write the View code assuming `userData.studies` exists.

    // Actually, I should update the store first if I want to be clean.
    // But since I'm in the middle of tool calls, I'll assume `userData.studies` for now and will patch store immediately after.

    const { userData, addStudy, deleteStudy, addTask, tasks, toggleTask } = useAppStore();
    // Note: addStudy/deleteStudy need to be added to store

    const studies = userData?.studies || [];

    const [activeStudy, setActiveStudy] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');

    const [newActivity, setNewActivity] = useState('');

    const handleAddStudy = (e) => {
        e.preventDefault();
        if (!title) return;
        addStudy({ title, color: '#8B5CF6' }); // Purple for studies
        setIsAdding(false);
        setTitle('');
    };

    const handleAddActivity = (e) => {
        e.preventDefault();
        if (!newActivity.trim()) return;
        addTask({
            title: newActivity,
            studyId: activeStudy.id, // Linking to this study
            category: 'studies',
            scheduledAt: new Date().toISOString(),
            periodType: 'day'
        });
        setNewActivity('');
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

            {/* List or Detail */}
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

                        <form onSubmit={handleAddActivity} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input
                                value={newActivity} onChange={e => setNewActivity(e.target.value)}
                                placeholder="Adicionar tópico, exercício ou revisão..."
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px' }}><Plus /></button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {studyTasks.map(task => (
                                <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
                                    <button
                                        onClick={() => toggleTask(task.id, task.completed)}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer', color: task.completed ? '#10B981' : 'var(--text-secondary)' }}
                                    >
                                        <CheckCircle size={20} fill={task.completed ? "currentColor" : "none"} />
                                    </button>
                                    <span style={{
                                        textDecoration: task.completed ? 'line-through' : 'none',
                                        color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                        flex: 1
                                    }}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
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
                            {studies.map(study => (
                                <div key={study.id} className="card" onClick={() => setActiveStudy(study)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '24px' }}>
                                    <div style={{ marginBottom: '12px', color: '#8B5CF6' }}>
                                        <BookOpen size={32} />
                                    </div>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '4px' }}>{study.title}</h3>
                                    {/* Simple delete for list item */}
                                    <button onClick={(e) => { e.stopPropagation(); deleteStudy(study.id); }} style={{ marginTop: '12px', color: 'var(--text-tertiary)', background: 'none', border: 'none' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
            {/* Modal for Adding Study */}
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
