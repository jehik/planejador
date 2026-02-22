import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Folder, Plus, Layout, Trash2, CheckCircle, ArrowRight, Trophy, AlignLeft } from 'lucide-react';

const ProjectsView = () => {
    const { userData, addProject, deleteProject, addTask, tasks, toggleTask, deleteTask } = useAppStore();
    const projects = userData?.projects || [];

    const [activeProject, setActiveProject] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // --- Sub-task State ---
    const [newTask, setNewTask] = useState('');
    const [notes, setNotes] = useState('');

    const handleAddProject = (e) => {
        e.preventDefault();
        if (!title) return;
        addProject({ title, description, color: '#3B82F6' });
        setIsAdding(false);
        setTitle(''); setDescription('');
    };

    // Filter tasks for the active project
    const projectTasks = activeProject
        ? tasks.filter(t => t.projectId === activeProject.id)
        : [];

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim() || !activeProject) return;

        console.log('Adding task to project:', activeProject.id);

        try {
            await addTask({
                title: newTask,
                projectId: activeProject.id,
                category: 'projects',
                scheduledAt: new Date(), // Use current date for project tasks
                completed: false,
                description: notes,
                periodType: 'day', // Default to work with other filters
                priority: 'medium'
            });
            setNewTask('');
            setNotes('');
            console.log('Task added successfully');
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleDeleteProject = (e, projectId) => {
        e.stopPropagation();
        if (confirm('Tem certeza que deseja excluir este projeto?')) {
            deleteProject(projectId);
            if (activeProject?.id === projectId) setActiveProject(null);
        }
    };

    // Calculate progress based on tasks
    const getProgress = (projId) => {
        const pTasks = tasks.filter(t => t.projectId === projId);
        if (pTasks.length === 0) return 0;
        const completed = pTasks.filter(t => t.completed).length;
        return Math.round((completed / pTasks.length) * 100);
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            {/* Header */}
            {!activeProject && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                        <h2 className="text-xl">Projetos</h2>
                        <p className="text-sm text-secondary">Gerencie suas grandes ideias</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(true)}
                        style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            backgroundColor: 'var(--text-primary)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                        <Plus size={24} strokeWidth={2.5} />
                    </button>
                </div>
            )}

            {/* Content */}
            {activeProject ? (
                // --- PROJECT DETAIL VIEW ---
                <div className="fade-in">
                    <button
                        onClick={() => setActiveProject(null)}
                        style={{
                            border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--text-secondary)',
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            marginBottom: '24px', padding: '8px 16px', borderRadius: '10px',
                            cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem'
                        }}>
                        <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} /> Voltar
                    </button>

                    <div className="card fade-in" style={{ padding: '32px', marginBottom: '32px', background: 'linear-gradient(135deg, var(--surface-color) 0%, rgba(59, 130, 246, 0.05) 100%)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.04em', marginBottom: '12px' }}>{activeProject.title}</h2>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.5' }}>{activeProject.description || "Sem descrição disponível."}</p>
                            </div>
                            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Folder size={28} />
                            </div>
                        </div>

                        {/* Progress */}
                        <div style={{ marginTop: '32px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Conclusão Geral</span>
                                <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3B82F6' }}>{getProgress(activeProject.id)}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'rgba(0,0,0,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${getProgress(activeProject.id)}%`, background: '#3B82F6', borderRadius: '4px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="card fade-in" style={{ padding: '24px' }}>
                        <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Trophy size={18} />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Tasks & Metas</h3>
                        </div>

                        <form onSubmit={handleAddTask} style={{ marginBottom: '24px' }}>
                            <div style={{ backgroundColor: 'var(--bg-color)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                                <input
                                    value={newTask} onChange={e => setNewTask(e.target.value)}
                                    placeholder="O que precisa ser feito?"
                                    style={{
                                        width: '100%', padding: '16px 20px', border: 'none',
                                        background: 'transparent', color: 'var(--text-primary)',
                                        fontSize: '1rem', fontWeight: '600', outline: 'none'
                                    }}
                                />
                                <div style={{ padding: '0 20px 16px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: '10px' }}>
                                        <AlignLeft size={14} style={{ opacity: 0.5 }} />
                                        <input
                                            placeholder="Anotações extras..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none', width: '100%' }}
                                        />
                                    </div>
                                    <button type="submit" style={{ padding: '8px 16px', borderRadius: '10px', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                                        Add
                                    </button>
                                </div>
                            </div>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {projectTasks.length > 0 ? (
                                projectTasks.map(task => (
                                    <div key={task.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '16px',
                                            padding: '16px',
                                            borderRadius: '16px',
                                            backgroundColor: task.completed ? 'rgba(16, 185, 129, 0.03)' : 'var(--bg-color)',
                                            border: '1px solid var(--border-color)',
                                            transition: 'all 0.2s'
                                        }}>
                                        <button
                                            onClick={() => toggleTask(task.id, task.completed)}
                                            style={{
                                                width: '24px', height: '24px', borderRadius: '50%',
                                                border: `2px solid ${task.completed ? '#10B981' : 'var(--border-color)'}`,
                                                backgroundColor: task.completed ? '#10B981' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', cursor: 'pointer', marginTop: '2px', flexShrink: 0
                                            }}
                                        >
                                            {task.completed && <CheckCircle size={16} strokeWidth={3} />}
                                        </button>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                                marginBottom: '4px'
                                            }}>
                                                {task.title}
                                            </div>
                                            {task.description && (
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
                                                    {task.description}
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', opacity: 0.2, cursor: 'pointer' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-tertiary)' }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>Inicie adicionando sua primeira meta!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                // --- PROJECT LIST ---
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    {projects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '64px 32px', backgroundColor: 'var(--surface-color)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#3B82F6' }}>
                                <Layout size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: '800' }}>Nenhum projeto ainda</h3>
                            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: '24px', maxWidth: '240px', margin: '0 auto 24px' }}>Organize seus grandes planos em pastas dedicadas.</p>
                            <button
                                onClick={() => setIsAdding(true)}
                                style={{
                                    padding: '12px 24px', borderRadius: '14px',
                                    backgroundColor: 'var(--primary-color)', color: 'white',
                                    border: 'none', fontWeight: '700', cursor: 'pointer'
                                }}>
                                Criar Projeto
                            </button>
                        </div>
                    ) : (
                        projects.map(project => (
                            <div key={project.id} className="card fade-in" onClick={() => setActiveProject(project)} style={{ cursor: 'pointer', padding: '24px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '20px' }}>
                                        <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Folder size={26} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '6px' }}>{project.title}</h3>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                                                {project.description || "Inicie este novo projeto agora."}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={(e) => handleDeleteProject(e, project.id)} style={{ color: 'var(--danger-color)', opacity: 0.2, background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <div style={{ marginTop: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Progresso</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#3B82F6' }}>{getProgress(project.id)}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(0,0,0,0.03)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${getProgress(project.id)}%`, background: '#3B82F6', borderRadius: '3px' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Premium Modal for Adding Project */}
            {isAdding && (
                <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '420px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Novo Projeto</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Defina o nome e a visão para este novo projeto.</p>
                        </div>
                        <form onSubmit={handleAddProject}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', paddingLeft: '4px' }}>Nome do Projeto</label>
                                <input
                                    value={title} onChange={e => setTitle(e.target.value)}
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', outline: 'none' }}
                                    placeholder="Ex: Reforma da Sala, Startup..."
                                    required
                                    autoFocus
                                />
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', paddingLeft: '4px' }}>Visão / Descrição</label>
                                <textarea
                                    value={description} onChange={e => setDescription(e.target.value)}
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '100px', resize: 'none', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }}
                                    placeholder="Qual o objetivo principal deste projeto?"
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--text-primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Criar Projeto</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsView;
