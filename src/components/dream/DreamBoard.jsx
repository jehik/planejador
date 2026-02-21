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
        <div className="fade-in" style={{ paddingBottom: 'var(--spacing-xl)', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '16px', position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
                <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        padding: '10px 18px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--text-primary)',
                        color: 'white',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s active'
                    }}
                >
                    <Plus size={20} strokeWidth={2.5} /> Adicionar
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
                    borderRadius: '24px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1px dashed var(--border-color)',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                        <ImageIcon size={32} strokeWidth={1.5} />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Visualize suas conquistas</div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '500' }}>Adicione fotos do que você quer alcançar.</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '14px'
                }}>
                    {dreams.map(dream => (
                        <div key={dream.id} className="card" style={{
                            position: 'relative',
                            padding: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            borderColor: 'rgba(0,0,0,0.03)'
                        }}>
                            <div style={{
                                borderRadius: '14px',
                                overflow: 'hidden',
                                aspectRatio: '1',
                                backgroundColor: 'rgba(0,0,0,0.015)'
                            }}>
                                <img
                                    src={dream.image}
                                    alt="Sonho"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px'
                            }}>
                                <button
                                    onClick={() => removeDream(dream.id)}
                                    style={{
                                        color: 'white',
                                        backgroundColor: 'rgba(0,0,0,0.3)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '50%',
                                        width: '28px',
                                        height: '28px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Trash2 size={14} strokeWidth={2.5} />
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
