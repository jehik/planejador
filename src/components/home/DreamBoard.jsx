import React, { useState } from 'react';
import { Plus, Image as ImageIcon } from 'lucide-react';

const DreamBoard = () => {
    // Placeholder logic for images
    // In a real app, we'd use Firestore Storage or local object URLs.
    // Here we'll simulate a grid.
    const [dreams, setDreams] = useState([
        { id: 1, url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', title: 'Viajar' },
        { id: 2, url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', title: 'Casa Própria' },
        // Add more placeholders or empty slots
    ]);

    const handleAddDream = () => {
        // Trigger file input or modal
        alert("Funcionalidade de upload será implementada em breve.");
    };

    return (
        <div className="dream-board-section">
            <h2 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.2rem' }}>Quadro dos Sonhos</h2>

            <div className="dream-grid">
                {dreams.map(dream => (
                    <div key={dream.id} className="dream-item card" style={{ padding: 0, overflow: 'hidden' }}>
                        <img src={dream.url} alt={dream.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className="dream-overlay">
                            <span>{dream.title}</span>
                        </div>
                    </div>
                ))}

                {/* Add Button */}
                <button className="add-dream-btn" onClick={handleAddDream}>
                    <Plus size={32} />
                    <span style={{ marginTop: '8px', fontSize: '0.9rem' }}>Adicionar</span>
                </button>
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
                    border: 0; /* Override card border if desired, or keep it */
                    transition: transform 0.3s ease;
                }
                .dream-item:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--glow-primary);
                }
                .dream-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: var(--spacing-sm);
                    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
                    color: white;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .dream-item:hover .dream-overlay {
                    opacity: 1;
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
