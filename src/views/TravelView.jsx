import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { Plane, Plus, Calendar, Trash2, DollarSign, CheckSquare, ShoppingCart, Briefcase, MapPin, CircleDollarSign, Edit3, X, Save } from 'lucide-react';

const TravelView = () => {
    const { userData, addTravel, deleteTravel, updateTravel } = useAppStore();
    const trips = userData?.travel || [];

    // UI State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewingItemsTripId, setViewingItemsTripId] = useState(null);
    const [editingTripId, setEditingTripId] = useState(null);

    // Form State
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');
    const [shoppingListInput, setShoppingListInput] = useState('');

    // Pre-fill form for editing
    useEffect(() => {
        if (editingTripId) {
            const trip = trips.find(t => t.id === editingTripId);
            if (trip) {
                setDestination(trip.destination || '');
                setDate(trip.date || '');
                setBudget(trip.budget || '');
                setShoppingListInput(trip.shoppingList?.map(i => i.text).join(', ') || '');
                setIsModalOpen(true);
            }
        }
    }, [editingTripId]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTripId(null);
        setDestination(''); setDate(''); setBudget(''); setShoppingListInput('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!destination) return;

        const shoppingList = shoppingListInput.split(',')
            .map(item => ({ text: item.trim(), checked: false }))
            .filter(i => i.text);

        const tripData = {
            destination,
            date,
            budget,
            shoppingList: editingTripId ? undefined : shoppingList // Don't overwrite list if editing basics
        };

        if (editingTripId) {
            updateTravel(editingTripId, tripData);
        } else {
            addTravel({ ...tripData, shoppingList });
        }

        handleCloseModal();
    };

    const handleToggleItem = (tripId, itemIndex) => {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;
        const newList = [...trip.shoppingList];
        newList[itemIndex].checked = !newList[itemIndex].checked;
        updateTravel(tripId, { shoppingList: newList });
    };

    const handleDeleteItem = (tripId, itemIndex) => {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;
        const newList = trip.shoppingList.filter((_, idx) => idx !== itemIndex);
        updateTravel(tripId, { shoppingList: newList });
    };

    const handleAddItemToList = (tripId, text) => {
        if (!text.trim()) return;
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;
        const newList = [...(trip.shoppingList || []), { text: text.trim(), checked: false }];
        updateTravel(tripId, { shoppingList: newList });
    };

    const tripBeingViewed = trips.find(t => t.id === viewingItemsTripId);

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Próximas Aventuras</h2>
                    <p className="text-sm text-secondary">Planeje sua próxima jornada pelo mundo</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        width: '44px', height: '44px', borderRadius: '14px',
                        backgroundColor: 'var(--text-primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                    <Plus size={24} strokeWidth={2.5} />
                </button>
            </div>

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {trips.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 32px', backgroundColor: 'var(--surface-color)', borderRadius: '32px', border: '1px dashed var(--border-color)' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: 'rgba(59, 130, 246, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: '#3B82F6' }}>
                            <Plane size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', fontWeight: '800' }}>Para onde vamos agora?</h3>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '1rem', maxWidth: '280px', margin: '0 auto 32px', lineHeight: '1.5' }}>
                            Mantenha seus roteiros, orçamentos e sonhos de viagem em um só lugar.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{ padding: '14px 28px', borderRadius: '16px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', fontWeight: '700', fontSize: '1rem', cursor: 'pointer' }}>
                            Planejar Primeira Viagem
                        </button>
                    </div>
                ) : (
                    trips.map(trip => (
                        <div key={trip.id} className="card fade-in" style={{ padding: '0', marginBottom: '24px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {/* Trip Visual/Icon Section */}
                                <div style={{
                                    width: '100%',
                                    padding: '32px',
                                    background: 'linear-gradient(135deg, var(--surface-color) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                    borderBottom: '1px solid var(--border-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '20px'
                                }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: '#3B82F6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59,130,246,0.2)' }}>
                                        <MapPin size={32} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>{trip.destination}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Calendar size={14} /> {trip.date ? new Date(trip.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : "Data a definir"}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => setEditingTripId(trip.id)} style={{ padding: '10px', color: 'var(--text-secondary)', border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <Edit3 size={20} />
                                        </button>
                                        <button onClick={() => { if (confirm('Excluir esta viagem?')) deleteTravel(trip.id); }} style={{ padding: '10px', color: 'var(--danger-color)', opacity: 0.5, border: 'none', background: 'none', cursor: 'pointer' }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Trip Details Grid */}
                                <div style={{ width: '100%', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '20px' }}>
                                    <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-color)', border: 'none' }}>
                                        <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Orçamento</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10B981', fontWeight: '800', fontSize: '1.1rem' }}>
                                            <CircleDollarSign size={20} />
                                            R$ {Number(trip.budget || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewingItemsTripId(trip.id)}
                                        className="card"
                                        style={{ padding: '16px', backgroundColor: 'var(--bg-color)', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                                    >
                                        <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Compras Pendentes</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontWeight: '800', fontSize: '1.1rem' }}>
                                            <ShoppingCart size={20} />
                                            {trip.shoppingList?.filter(i => !i.checked).length || 0} pendentes
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Travel Form Modal (Add/Edit) */}
            {isModalOpen && (
                <div className="fade-in" style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div className="card" style={{
                        width: '100%', maxWidth: '440px',
                        padding: '24px', // Reduced from 32px
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        maxHeight: '90vh', // Added limit
                        overflowY: 'auto', // Added scroll
                        position: 'relative'
                    }}>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '18px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-primary)' }}>
                                <Briefcase size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '6px' }}>{editingTripId ? 'Editar Viagem' : 'Planejar Viagem'}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Defina o destino e detalhes da sua próxima aventura.</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px', paddingLeft: '4px' }}>Destino dos Sonhos</label>
                                <input
                                    value={destination} onChange={e => setDestination(e.target.value)}
                                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', outline: 'none' }}
                                    placeholder="Ex: Paris, Tóquio, Dubai..."
                                    required
                                    autoFocus
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px', paddingLeft: '4px' }}>Quando?</label>
                                <input
                                    type="date" value={date} onChange={e => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', outline: 'none' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px', paddingLeft: '4px' }}>Orçamento (R$)</label>
                                <input
                                    type="number" value={budget} onChange={e => setBudget(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', outline: 'none' }}
                                    placeholder="0,00"
                                />
                            </div>
                            {!editingTripId && (
                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px', paddingLeft: '4px' }}>Lista de Compras (separada por vírgula)</label>
                                    <textarea
                                        value={shoppingListInput} onChange={e => setShoppingListInput(e.target.value)}
                                        style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '80px', resize: 'none', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                                        placeholder="Protetor solar, passagens, hotel..."
                                    />
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--text-primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Salvar Viagem</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Shopping List Management Modal */}
            {viewingItemsTripId && tripBeingViewed && (
                <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '24px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <h3 style={{ fontWeight: '800', fontSize: '1.2rem' }}>Itens para {tripBeingViewed.destination}</h3>
                            <button onClick={() => setViewingItemsTripId(null)} style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        {/* Add New Item Mini-form */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <input
                                id="new-travel-item"
                                type="text"
                                placeholder="Novo item..."
                                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', outline: 'none' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddItemToList(viewingItemsTripId, e.target.value);
                                        e.target.value = '';
                                    }
                                }}
                            />
                            <button
                                onClick={() => {
                                    const input = document.getElementById('new-travel-item');
                                    handleAddItemToList(viewingItemsTripId, input.value);
                                    input.value = '';
                                }}
                                style={{ width: '40px', borderRadius: '12px', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        {/* Scrollable list */}
                        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                            {(!tripBeingViewed.shoppingList || tripBeingViewed.shoppingList.length === 0) ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: '20px' }}>Nenhum item pendente.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {tripBeingViewed.shoppingList.map((item, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
                                            <button
                                                onClick={() => handleToggleItem(viewingItemsTripId, idx)}
                                                style={{ border: 'none', background: 'none', cursor: 'pointer', color: item.checked ? '#10B981' : 'var(--text-tertiary)' }}
                                            >
                                                <CheckSquare size={22} fill={item.checked ? '#10B98120' : 'none'} />
                                            </button>
                                            <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: '600', textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                                                {item.text}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteItem(viewingItemsTripId, idx)}
                                                style={{ border: 'none', background: 'none', color: 'var(--danger-color)', opacity: 0.5, cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelView;
