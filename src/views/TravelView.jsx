import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Plane, Plus, MapPin, Calendar, Trash2, ArrowRight } from 'lucide-react';

const TravelView = () => {
    const { userData, addTravel, deleteTravel } = useAppStore();
    const trips = userData?.travel || [];
    const [isAdding, setIsAdding] = useState(false);

    // New Trip Form State
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!destination) return;
        addTravel({ destination, date, status: 'planned' });
        setIsAdding(false);
        setDestination('');
        setDate('');
    };

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Viagens</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="btn btn-primary"
                    style={{ borderRadius: '12px', padding: '8px 16px' }}
                >
                    <Plus size={20} /> <span style={{ marginLeft: '8px' }}>Nova</span>
                </button>
            </div>

            {/* Content */}
            {trips.length === 0 ? (
                /* Empty State / Tutorial */
                <div style={{
                    textAlign: 'center', padding: '40px 20px',
                    backgroundColor: 'var(--surface-color)', borderRadius: '24px',
                    border: '1px dashed var(--border-color)'
                }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        backgroundColor: 'rgba(124, 92, 255, 0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px auto', color: 'var(--primary-color)'
                    }}>
                        <Plane size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: '600' }}>Planeje sua próxima aventura</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                        Adicione destinos, datas e checklists para organizar suas viagens dos sonhos.
                    </p>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
                        Clique em <strong>+ Nova</strong> para começar.
                    </div>
                </div>
            ) : (
                /* List of Trips */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {trips.map(trip => (
                        <div key={trip.id} className="card" style={{ padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px' }}>{trip.destination}</h3>
                                    {trip.date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <Calendar size={14} /> <span>{new Date(trip.date).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => { if (confirm('Apagar viagem?')) deleteTravel(trip.id) }}
                                    style={{ color: 'var(--text-tertiary)', background: 'none', border: 'none' }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal (Simple overlay for demo) */}
            {isAdding && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(5px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '320px', boxShadow: 'var(--shadow-card)' }}>
                        <h3 style={{ marginBottom: '16px' }}>Nova Viagem</h3>
                        <form onSubmit={handleAdd}>
                            <input
                                autoFocus
                                placeholder="Destino (ex: Paris)"
                                value={destination}
                                onChange={e => setDestination(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', marginBottom: '12px',
                                    borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                                }}
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px', marginBottom: '24px',
                                    borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="btn btn-ghost"
                                    style={{ flex: 1 }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelView;
