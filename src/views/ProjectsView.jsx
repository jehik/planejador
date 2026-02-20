import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Folder, Plus, MoreHorizontal, Layout, Trash2 } from 'lucide-react';

const ProjectsView = () => {
    const { userData, addProject, deleteProject } = useAppStore();
    const projects = userData?.projects || [];
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!title) return;
        addProject({ title, progress: 0, color: '#3B82F6' });
        setIsAdding(false);
        setTitle('');
    };

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
                <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ borderRadius: '12px', padding: '8px 16px' }}>
                    <Plus size={20} /> <span style={{ marginLeft: '8px' }}>Novo</span>
                </button>
            </div>

            {/* Content */}
            {projects.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    backgroundColor: 'var(--surface-color)', borderRadius: '24px',
                    border: '1px dashed var(--border-color)'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px auto', color: '#3B82F6'
                    }}>
                        <Folder size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: '600' }}>Seus Projetos</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                        Crie projetos para organizar tarefas complexas e acompanhar seu progresso.
                    </p>
                    <button onClick={() => setIsAdding(true)} className="btn btn-ghost">
                        Começar agora
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    backgroundColor: `${project.color}20`, color: project.color,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Folder size={20} />
                                </div>
                                <button onClick={() => { if (confirm('Excluir projeto?')) deleteProject(project.id) }} style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '8px' }}>{project.title}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                                Em andamento
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

            {/* Modal */}
            {isAdding && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '320px', backgroundColor: 'var(--bg-color)' }}>
                        <h3 style={{ marginBottom: '16px' }}>Novo Projeto</h3>
                        <form onSubmit={handleAdd}>
                            <input
                                autoFocus
                                placeholder="Nome do Projeto"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', marginBottom: '24px',
                                    borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
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
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: 16px;
                }
                .project-card {
                    padding: 20px;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .progress-bar-container {
                    height: 6px;
                    background-color: var(--surface-color);
                    border-radius: 3px;
                    overflow: hidden;
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
