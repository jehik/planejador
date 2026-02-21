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
        <div className="fade-in" style={{ paddingBottom: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.03em' }}>Mural de Sonhos</h2>
                <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(0, 122, 255, 0.08)',
                        color: 'var(--primary-color)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    <Plus size={18} strokeWidth={2.5} /> Adicionar
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
