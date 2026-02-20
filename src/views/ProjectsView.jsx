import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Folder, Plus, Layout, Trash2, CheckCircle, ArrowRight, Target } from 'lucide-react';

const ProjectsView = () => {
    const { userData, addProject, deleteProject, addTask, tasks, toggleTask } = useAppStore();
    const projects = userData?.projects || [];

    const [activeProject, setActiveProject] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // --- Sub-task State ---
    const [newTask, setNewTask] = useState('');

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

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        addTask({
            title: newTask,
            projectId: activeProject.id,
            category: 'projects',
            scheduledAt: new Date().toISOString(), // Default to today so it shows on Dashboard
            completed: false
        });
        setNewTask('');
    };

    // Calculate progress based on tasks
    const getProgress = (projId) => {
        const pTasks = tasks.filter(t => t.projectId === projId);
        if (pTasks.length === 0) return 0;
        const completed = pTasks.filter(t => t.completed).length;
        return Math.round((completed / pTasks.length) * 100);
    };

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header */}
            {!activeProject && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Meus Projetos</h2>
                    <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ borderRadius: '12px', padding: '8px 16px' }}>
                        <Plus size={20} /> <span style={{ marginLeft: '8px' }}>Novo</span>
                    </button>
                </div>
            )}

            {/* Content */}
            {activeProject ? (
                // --- PROJECT DETAIL VIEW ---
                <div className="fade-in">
                    <button onClick={() => setActiveProject(null)} style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', cursor: 'pointer' }}>
                        <ArrowRight size={16} transform="rotate(180)" /> Voltar
                    </button>

                    <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{activeProject.title}</h2>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Folder size={24} />
                            </div>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>{activeProject.description || "Sem descrição."}</p>

                        {/* Progress */}
                        <div style={{ marginTop: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span>Progresso</span>
                                <span style={{ fontWeight: 'bold' }}>{getProgress(activeProject.id)}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${getProgress(activeProject.id)}%`, background: '#3B82F6', transition: 'width 0.3s' }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={20} color="#EC4899" /> Metas & Tarefas
                        </h3>

                        {/* Add Task Input */}
                        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                            <input
                                value={newTask} onChange={e => setNewTask(e.target.value)}
                                placeholder="Adicionar nova meta/tarefa..."
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: '8px' }}><Plus /></button>
                        </form>

                        {/* Task List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {projectTasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>Nenhuma tarefa criada.</p>}
                            {projectTasks.map(task => (
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
                // --- PROJECTS LIST VIEW ---
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card card" onClick={() => setActiveProject(project)} style={{ cursor: 'pointer' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Folder size={20} />
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); if (confirm('Excluir?')) deleteProject(project.id); }} style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>{project.title}</h3>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{ height: '4px', flex: 1, background: 'var(--bg-color)', borderRadius: '2px' }}>
                                    <div style={{ height: '100%', width: `${getProgress(project.id)}%`, background: '#3B82F6' }}></div>
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{getProgress(project.id)}%</span>
                            </div>
                        </div>
                    ))}
                    {/* Empty State if needed */}
                    {projects.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <p>Toque em <strong>+ Novo</strong> para criar um projeto.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal */}
            {isAdding && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '350px' }}>
                        <h3>Novo Projeto</h3>
                        <form onSubmit={handleAddProject} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                            <input autoFocus placeholder="Título do Projeto" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
                            <textarea placeholder="Descrição (opcional)" value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '80px' }} />
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 16px;
                }
                .project-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-card);
                }
            `}</style>
        </div>
    );
};

export default ProjectsView;
