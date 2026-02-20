import React, { useState, useRef } from 'react';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';

const DreamBoard = () => {
    // Persist to localStorage for demo (since we don't have Storage rules confirmed)
    const [dreams, setDreams] = useState(() => {
        const saved = localStorage.getItem('dream_board_items');
        return saved ? JSON.parse(saved) : [];
    });

    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newItem = {
                    id: Date.now(),
                    url: reader.result,
                    title: 'Novo Sonho'
                };
                const newDreams = [...dreams, newItem];
                setDreams(newDreams);
                localStorage.setItem('dream_board_items', JSON.stringify(newDreams));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeDream = (id) => {
        if (confirm('Remover este sonho?')) {
            const newDreams = dreams.filter(d => d.id !== id);
            setDreams(newDreams);
            localStorage.setItem('dream_board_items', JSON.stringify(newDreams));
        }
    };

    return (
        <div className="dream-board-section">
            <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.2rem' }}>Quadro dos Sonhos</h2>

            <div className="dream-grid">
                {dreams.map(dream => (
                    <div key={dream.id} className="dream-item card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                        <img src={dream.url} alt={dream.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                            onClick={(e) => { e.stopPropagation(); removeDream(dream.id); }}
                            style={{
                                position: 'absolute', top: '4px', right: '4px',
                                background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%',
                                padding: '4px', cursor: 'pointer', color: 'white'
                            }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                <button className="add-dream-btn" onClick={() => fileInputRef.current?.click()}>
                    <Plus size={32} />
                    <span style={{ marginTop: '8px', fontSize: '0.9rem' }}>Adicionar</span>
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>

            <style>{`
                .dream-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                    gap: var(--spacing-md);
                }
                .dream-item {
                    aspect-ratio: 1; /* Square */
                    position: relative;
                    border: 0;
                    transition: transform 0.3s ease;
                }
                .dream-item:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--glow-primary);
                }
                .add-dream-btn {
                    aspect-ratio: 1;
                    border: 2px dashed var(--border-color);
                    border-radius: var(--radius-lg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-secondary);
                    cursor: pointer;
                    background: transparent;
                    transition: all 0.2s;
                }
                .add-dream-btn:hover {
                    border-color: var(--primary-color);
                    color: var(--primary-color);
                    background: var(--surface-hover);
                }
            `}</style>
        </div>
    );
};

export default DreamBoard;
