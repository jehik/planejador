import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Plane, Plus, Calendar, Trash2, DollarSign, CheckSquare, ShoppingCart } from 'lucide-react';

const TravelView = () => {
    const { userData, addTravel, deleteTravel, updateTravel } = useAppStore();
    const trips = userData?.travel || [];
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');
    const [shoppingList, setShoppingList] = useState(''); // Simple text for now, or comma separated

    const handleAdd = (e) => {
        e.preventDefault();
        if (!destination) return;
        addTravel({
            destination,
            date,
            budget,
            shoppingList: shoppingList.split(',').map(item => ({ text: item.trim(), checked: false })).filter(i => i.text),
            status: 'planned'
        });
        setIsAdding(false);
        resetForm();
    };

    const resetForm = () => {
        setDestination(''); setDate(''); setBudget(''); setShoppingList('');
    };

    const toggleItem = (tripId, itemIndex) => {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;
        const newItems = [...trip.shoppingList];
        newItems[itemIndex].checked = !newItems[itemIndex].checked;
        updateTravel(tripId, { shoppingList: newItems });
    };

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>Minhas Viagens</h2>
                <button onClick={() => setIsAdding(true)} className="btn btn-primary" style={{ borderRadius: '12px', padding: '8px 16px' }}>
                    <Plus size={20} /> <span style={{ marginLeft: '8px' }}>Nova</span>
                </button>
            </div>

            {/* List */}
            {trips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--surface-color)', borderRadius: '24px', border: '1px dashed var(--border-color)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#3B82F6' }}>
                        <Plane size={32} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', fontWeight: 'bold' }}>Planeje sua Aventura</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Defina datas, orçamento e o que precisa comprar.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {trips.map(trip => (
                        <div key={trip.id} className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{trip.destination}</h3>
                                    {trip.date && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                            <Calendar size={16} />
                                            <span>{new Date(trip.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                    )}
                                </div>
                                <button onClick={() => deleteTravel(trip.id)} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)' }}><Trash2 size={20} /></button>
                            </div>

                            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
                                <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <DollarSign size={14} /> Orçamento
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '4px' }}>
                                        R$ {Number(trip.budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div style={{ background: 'var(--bg-color)', padding: '12px', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                        <ShoppingCart size={14} /> Compras
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '4px' }}>
                                        {trip.shoppingList?.filter(i => !i.checked).length} itens
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Adding Travel */}
            {isAdding && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card fade-in" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px' }}>Nova Viagem</h3>
                        <form onSubmit={handleAdd}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Destino</label>
                                <input
                                    value={destination} onChange={e => setDestination(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    required
                                    autoFocus
                                    placeholder="Ex: Paris, Praia Grande..."
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Data (opcional)</label>
                                <input
                                    type="date"
                                    value={date} onChange={e => setDate(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                />
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Orçamento (R$)</label>
                                <input
                                    type="number"
                                    value={budget} onChange={e => setBudget(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                                    placeholder="0,00"
                                />
                            </div>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Lista de Compras (separar por vírgula)</label>
                                <textarea
                                    value={shoppingList} onChange={e => setShoppingList(e.target.value)}
                                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '80px', resize: 'none' }}
                                    placeholder="Passagem, Hotel, Protetor Solar..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setIsAdding(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelView;
