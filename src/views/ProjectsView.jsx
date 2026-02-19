import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Folder, Plus, CheckCircle, MoreHorizontal, ChevronRight, Layout } from 'lucide-react';

const ProjectsView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
    // In a real app, projects would be a separate entity. 
    // Here we'll simulate projects using a specific structure or just a local state for demo.
    // Let's assume we filter tasks by 'project' category and group them by a 'propjectId' field, 
    // but for now, to keep it simple and visual, I'll mock the project wrappers and filter tasks.

    const [projects, setProjects] = useState([
        { id: 'p1', title: 'Refatoração do Site', color: '#3B82F6', progress: 65 },
        { id: 'p2', title: 'Lançamento Marketing', color: '#EC4899', progress: 30 },
        { id: 'p3', title: 'App Mobile', color: '#8B5CF6', progress: 10 }
    ]);

    const [activeProject, setActiveProject] = useState(null); // If null, show list. If set, show details.

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        padding: '10px', borderRadius: '12px',
                        color: '#3B82F6'
                    }}>
                        <Layout size={28} />
                    </div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Projetos</h2>
                </div>
                <button className="btn btn-primary" style={{ borderRadius: '12px', padding: '8px 16px' }}>
                    <Plus size={20} /> <span style={{ marginLeft: '8px' }}>Novo</span>
                </button>
            </div>

            {/* Content */}
            {activeProject ? (
                /* Project Detail View (Mockup) */
                <div className="fade-in">
                    <button
                        onClick={() => setActiveProject(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        &larr; Voltar
                    </button>
                    <div className="card" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{activeProject.title}</h3>
                        <div className="progress-bar-container" style={{ marginBottom: '24px' }}>
                            <div className="progress-bar-fill" style={{ width: `${activeProject.progress}%`, backgroundColor: activeProject.color }}></div>
                        </div>

                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '16px' }}>Tarefas</h4>
                        {/* Mock Tasks for this project */}
                        {[1, 2, 3].map(i => (
                            <div key={i} className="task-row" style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                                <CheckCircle size={20} color="var(--text-secondary)" />
                                <span style={{ textDecoration: i === 1 ? 'line-through' : 'none', color: i === 1 ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                    Tarefa do projeto {i}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                /* Projects Grid */
                <div className="projects-grid">
                    {projects.map(project => (
                        <div
                            key={project.id}
                            className="project-card card"
                            onClick={() => setActiveProject(project)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    backgroundColor: `${project.color}20`, color: project.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Folder size={20} />
                                </div>
                                <MoreHorizontal size={20} color="var(--text-secondary)" />
                            </div>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>{project.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                3 tarefas pendentes
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div className="progress-bar-container" style={{ flex: 1 }}>
                                    <div className="progress-bar-fill" style={{ width: `${project.progress}%`, backgroundColor: project.color }}></div>
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{project.progress}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .projects-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                }
                .project-card {
                    padding: 20px;
                    transition: transform 0.2s, box-shadow 0.2s;
                    cursor: pointer;
                }
                .project-card:hover {
                    transform: translateY(-4px);
                    box-shadow: var(--shadow-md);
                }
                .progress-bar-container {
                    height: 6px;
                    background-color: var(--bg-color);
                    border-radius: 3px;
                    overflow: hidden;
                    border: 1px solid var(--border-color);
                }
                .progress-bar-fill {
                    height: 100%;
                    border-radius: 3px;
                }
            `}</style>
        </div>
    );
};

export default ProjectsView;
