import React, { useState, useRef } from 'react';
import useAppStore from '../store/useAppStore';
import { Heart, Calendar, Image as ImageIcon, Plus, Upload, Trash2 } from 'lucide-react';

const RelationshipView = () => {
    // Fixed Date: 15 July 2024
    const startDate = new Date('2024-07-15');
    const today = new Date();
    const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    // Photo Logic
    const [localPhoto, setLocalPhoto] = useState(localStorage.getItem('relationship_photo'));
    const fileInputRef = useRef(null);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setLocalPhoto(base64String);
                localStorage.setItem('relationship_photo', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const [dateIdeas, setDateIdeas] = useState([
        { id: 1, text: 'Jantar à luz de velas', checked: false },
        { id: 2, text: 'Piquenique no parque', checked: false },
        { id: 3, text: 'Maratona de filmes', checked: true }
    ]);
    const [newIdea, setNewIdea] = useState('');

    const toggleIdea = (id) => {
        setDateIdeas(dateIdeas.map(idea =>
            idea.id === id ? { ...idea, checked: !idea.checked } : idea
        ));
    };

    const addIdea = (e) => {
        e.preventDefault();
        if (!newIdea.trim()) return;
        setDateIdeas([...dateIdeas, { id: Date.now(), text: newIdea, checked: false }]);
        setNewIdea('');
    };

    const deleteIdea = (e, id) => {
        e.stopPropagation(); // Prevent toggling
        setDateIdeas(dateIdeas.filter(idea => idea.id !== id));
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
            {/* Hero Profile Section */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 24px auto' }}>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100%', height: '100%', borderRadius: '48px',
                            backgroundColor: 'var(--surface-color)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(236, 72, 153, 0.2)', overflow: 'hidden',
                            boxShadow: '0 12px 32px rgba(236, 72, 153, 0.15)', cursor: 'pointer',
                            position: 'relative', transform: 'rotate(-2deg)', transition: 'transform 0.3s ease'
                        }}
                    >
                        {localPhoto ? (
                            <img src={localPhoto} alt="Nós" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <ImageIcon size={48} color="rgba(236, 72, 153, 0.4)" />
                                <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-tertiary)', marginTop: '8px', textTransform: 'uppercase' }}>Foto do Casal</p>
                            </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(236, 72, 153, 0.8)', backdropFilter: 'blur(4px)', padding: '8px', display: 'flex', justifyContent: 'center' }}>
                            <Upload size={16} color="white" />
                        </div>
                    </div>
                    {/* Decorative Hearts */}
                    <Heart size={24} fill="#EC4899" color="#EC4899" style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.8, filter: 'drop-shadow(0 4px 8px rgba(236,72,153,0.3))' }} />
                </div>

                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handlePhotoUpload} />

                <h2 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '8px' }}>Nós dois</h2>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '600', marginBottom: '24px' }}>Desde 15 de julho de 2024</p>

                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '12px',
                    padding: '16px 32px', borderRadius: '24px',
                    background: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
                    color: 'white', boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)',
                    transform: 'scale(1.05)'
                }}>
                    <Heart size={20} fill="white" />
                    <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>{daysTogether} dias juntos</span>
                </div>
            </div>

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="card fade-in" style={{ padding: '32px', background: 'linear-gradient(135deg, var(--surface-color) 0%, rgba(236, 72, 153, 0.03) 100%)', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Próximos Momentos</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Ideias para curtir juntos</p>
                        </div>
                        <Calendar size={24} color="#EC4899" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                        {dateIdeas.map(idea => (
                            <div
                                key={idea.id}
                                onClick={() => toggleIdea(idea.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: '16px 20px', borderRadius: '18px',
                                    backgroundColor: 'var(--bg-color)',
                                    border: idea.checked ? '1px solid rgba(236, 72, 153, 0.2)' : '1px solid var(--border-color)',
                                    cursor: 'pointer', transition: 'all 0.3s ease',
                                    opacity: idea.checked ? 0.7 : 1,
                                    boxShadow: idea.checked ? 'none' : '0 4px 12px rgba(0,0,0,0.02)'
                                }}
                            >
                                <div style={{
                                    width: '26px', height: '26px', borderRadius: '50%',
                                    border: `2px solid ${idea.checked ? '#EC4899' : 'rgba(236, 72, 153, 0.2)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: idea.checked ? '#EC4899' : 'transparent',
                                    transition: 'all 0.2s'
                                }}>
                                    {idea.checked && <Heart size={14} color="white" fill="white" />}
                                </div>
                                <span style={{
                                    textDecoration: idea.checked ? 'line-through' : 'none',
                                    color: idea.checked ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                    fontWeight: '700', fontSize: '0.95rem',
                                    flex: 1
                                }}>
                                    {idea.text}
                                </span>
                                <button
                                    onClick={(e) => deleteIdea(e, idea.id)}
                                    style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', opacity: 0.3, cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={addIdea} style={{
                        display: 'flex', gap: '12px',
                        backgroundColor: 'var(--bg-color)',
                        padding: '6px 6px 6px 20px',
                        borderRadius: '20px',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <input
                            placeholder="Sugerir novo encontro..."
                            value={newIdea}
                            onChange={(e) => setNewIdea(e.target.value)}
                            style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '0.95rem', fontWeight: '600', outline: 'none', color: 'var(--text-primary)' }}
                        />
                        <button
                            type="submit"
                            style={{ width: '44px', height: '44px', borderRadius: '16px', backgroundColor: '#EC4899', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <Plus size={24} strokeWidth={2.5} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RelationshipView;
