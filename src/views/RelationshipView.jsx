import React, { useState, useRef } from 'react';
import useAppStore from '../store/useAppStore';
import { Heart, Music, Calendar, Image as ImageIcon, Plus, Upload } from 'lucide-react';

const RelationshipView = () => {
    // Fixed Date: 15 July 2024
    const startDate = new Date('2024-07-15');
    const today = new Date();
    const daysTogether = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

    // Photo Logic
    const { userData, setUserData } = useAppStore();
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

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header / Hero */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        width: '120px', height: '120px', borderRadius: '50%',
                        backgroundColor: 'var(--surface-color)', margin: '0 auto 16px auto',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '4px solid var(--primary-color)', overflow: 'hidden',
                        boxShadow: '0 0 20px rgba(124, 92, 255, 0.3)', cursor: 'pointer',
                        position: 'relative'
                    }}
                >
                    {localPhoto ? (
                        <img src={localPhoto} alt="Nós" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <ImageIcon size={40} color="var(--text-secondary)" />
                    )}

                    {/* Upload Overlay hint */}
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', background: 'rgba(0,0,0,0.5)', padding: '4px' }}>
                        <Upload size={12} color="white" />
                    </div>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handlePhotoUpload}
                />

                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Nós dois</h2>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '20px',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)', color: '#EC4899', marginTop: '8px'
                }}>
                    <Heart size={16} fill="currentColor" />
                    <span style={{ fontWeight: '600' }}>{daysTogether} dias juntos</span>
                </div>
                <p style={{ marginTop: '8px', fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Desde 15 de julho de 2024</p>
            </div>

            {/* Date Night Planner */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <Calendar size={20} color="#EC4899" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Ideias de Encontros</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {dateIdeas.map(idea => (
                        <div
                            key={idea.id}
                            onClick={() => toggleIdea(idea.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '12px',
                                padding: '12px', borderRadius: '12px',
                                backgroundColor: idea.checked ? 'rgba(236, 72, 153, 0.05)' : 'var(--bg-color)',
                                border: '1px solid var(--border-color)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                border: `2px solid ${idea.checked ? '#EC4899' : 'var(--text-secondary)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                backgroundColor: idea.checked ? '#EC4899' : 'transparent'
                            }}>
                                {idea.checked && <Heart size={10} color="white" fill="white" />}
                            </div>
                            <span style={{
                                textDecoration: idea.checked ? 'line-through' : 'none',
                                color: idea.checked ? 'var(--text-secondary)' : 'var(--text-primary)'
                            }}>
                                {idea.text}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={addIdea} style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <input
                        placeholder="Nova ideia..."
                        value={newIdea}
                        onChange={(e) => setNewIdea(e.target.value)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            backgroundColor: '#EC4899', color: 'white', border: 'none',
                            borderRadius: '12px', width: '44px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RelationshipView;
