import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Plane, Plus, Calendar, Trash2, DollarSign, CheckSquare, ShoppingCart } from 'lucide-react';

const TravelView = () => {
    const { userData, addTravel, deleteTravel } = useAppStore();
    const trips = userData?.travel || [];
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [budget, setBudget] = useState('');
    const [shoppingList, setShoppingList] = useState('');

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
        setDestination(''); setDate(''); setBudget(''); setShoppingList('');
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Próximas Aventuras</h2>
                    <p className="text-sm text-secondary">Planeje sua próxima jornada pelo mundo</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
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
                            onClick={() => setIsAdding(true)}
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
                                            <Calendar size={14} /> {trip.date ? new Date(trip.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : "Data a definir"}
                                        </p>
                                    </div>
                                    <button onClick={() => { if (confirm('Excluir esta viagem?')) deleteTravel(trip.id); }} style={{ padding: '10px', color: 'var(--danger-color)', opacity: 0.2, border: 'none', background: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={20} />
                                    </button>
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
                                    <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-color)', border: 'none' }}>
                                        <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Itens</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3B82F6', fontWeight: '800', fontSize: '1.1rem' }}>
                                            <ShoppingCart size={20} />
                                            {trip.shoppingList?.length || 0} pendentes
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Premium Trip Modal */}
            {isAdding && (
                <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-primary)' }}>
                                <Briefcase size={28} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px' }}>Planejar Viagem</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Defina o destino e detalhes da sua próxima aventura.</p>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', paddingLeft: '4px' }}>Destino dos Sonhos</label>
                                <input
                                    value={destination} onChange={e => setDestination(e.target.value)}
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: '600', outline: 'none' }}
                                    placeholder="Ex: Paris, Tóquio, Paris..."
                                    required
                                    autoFocus
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', paddingLeft: '4px' }}>Quando?</label>
                                    <input
                                        type="date" value={date} onChange={e => setDate(e.target.value)}
                                        style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', paddingLeft: '4px' }}>Budget (R$)</label>
                                    <input
                                        type="number" value={budget} onChange={e => setBudget(e.target.value)}
                                        style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '600', outline: 'none' }}
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>
                            <div style={{ marginBottom: '32px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px', paddingLeft: '4px' }}>Lista de Compras (separada por vírgula)</label>
                                <textarea
                                    value={shoppingList} onChange={e => setShoppingList(e.target.value)}
                                    style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', minHeight: '80px', resize: 'none', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' }}
                                    placeholder="Protetor solar, passagens, hotel..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: 'var(--text-primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Salvar Viagem</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelView;
