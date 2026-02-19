import React, { useRef } from 'react';
import { Image as ImageIcon, Upload, Trash2, Plus } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const DreamBoard = () => {
    const { userData, addDream, removeDream } = useAppStore();
    const dreams = userData?.dreams || [];
    const fileInputRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Limit text size/validation could go here
            if (file.size > 2 * 1024 * 1024) {
                alert("A imagem deve ser menor que 2MB para não lotar o armazenamento.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                addDream({ image: reader.result }); // simple object
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Quadro dos Sonhos</h2>
                <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}
                >
                    <Plus size={18} /> Adicionar
                </button>
            </div>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: 'none' }}
            />

            {dreams.length === 0 ? (
                <div style={{
                    backgroundColor: 'var(--surface-color)',
                    borderRadius: '16px',
                    padding: '40px',
                    textAlign: 'center',
                    border: '2px dashed var(--border-color)',
                    color: 'var(--text-secondary)'
                }}>
                    <ImageIcon size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <p>Visualize suas conquistas.</p>
                    <p style={{ fontSize: '0.8rem' }}>Adicione fotos do que você quer alcançar.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                    gap: '16px'
                }}>
                    {dreams.map(dream => (
                        <div key={dream.id} style={{
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-sm)',
                            aspectRatio: '1',
                            group: 'dream-card'
                        }}>
                            <img
                                src={dream.image}
                                alt="Sonho"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                padding: '8px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                display: 'flex',
                                justifySelf: 'end',
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => removeDream(dream.id)}
                                    style={{
                                        color: 'white',
                                        backgroundColor: 'rgba(255,,255,255,0.2)',
                                        borderRadius: '50%',
                                        padding: '6px',
                                        border: 'none'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DreamBoard;
