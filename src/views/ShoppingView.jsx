import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { ShoppingBag, Plus, Trash2, CheckCircle2, ShoppingCart, Tag, Filter } from 'lucide-react';

const ShoppingView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
    const items = tasks.filter(t => t.category === 'shopping' || t.category === 'compras').sort((a, b) => a.completed - b.completed);

    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Geral');
    const [selectedDays, setSelectedDays] = useState([]);

    const daysOfWeek = [
        { id: 'sun', label: 'Dom' },
        { id: 'mon', label: 'Seg' },
        { id: 'tue', label: 'Ter' },
        { id: 'wed', label: 'Qua' },
        { id: 'thu', label: 'Qui' },
        { id: 'fri', label: 'Sex' },
        { id: 'sat', label: 'Sáb' }
    ];

    const toggleDay = (dayId) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const handleAdd = async (e) => {
        if (e) e.preventDefault();
        if (!newItemTitle.trim()) return;

        await addTask({
            title: newItemTitle,
            category: 'shopping',
            shopCategory: newItemCategory,
            completed: false,
            scheduledAt: new Date().toISOString(),
            recurrence: selectedDays,
            periodType: 'day'
        });

        setNewItemTitle('');
        setSelectedDays([]);
    };

    const categories = ['Geral', 'Mercado', 'Eletrônicos', 'Roupas', 'Casa'];

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            {/* Header Area */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Lista de Compras</h2>
                    <p className="text-sm text-secondary">Gerencie suas intenções de consumo</p>
                </div>
                <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: 'rgba(52, 199, 89, 0.1)', color: '#34C759', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingCart size={24} />
                </div>
            </div>

            {/* Quick Add Input */}
            <div className="card fade-in" style={{ padding: '24px', marginBottom: '32px', border: '1px solid var(--border-color)' }}>
                <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', padding: '6px 6px 6px 20px', borderRadius: '18px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                placeholder="O que precisamos comprar?"
                                value={newItemTitle}
                                onChange={(e) => setNewItemTitle(e.target.value)}
                                style={{ flex: 1, background: 'transparent', border: 'none', fontSize: '0.95rem', fontWeight: '600', outline: 'none', color: 'var(--text-primary)', padding: '10px 0' }}
                            />
                        </div>
                        <button
                            type="submit"
                            style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'var(--text-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                            <Plus size={24} strokeWidth={2.5} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setNewItemCategory(cat)}
                                style={{
                                    padding: '8px 16px', borderRadius: '12px', border: 'none',
                                    backgroundColor: newItemCategory === cat ? 'var(--text-primary)' : 'rgba(0,0,0,0.05)',
                                    color: newItemCategory === cat ? 'white' : 'var(--text-secondary)',
                                    fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Day Selection */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Dias de compra</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
                            {daysOfWeek.map(day => (
                                <button
                                    key={day.id}
                                    type="button"
                                    onClick={() => toggleDay(day.id)}
                                    style={{
                                        flex: 1, height: '36px', borderRadius: '10px', border: 'none',
                                        backgroundColor: selectedDays.includes(day.id) ? '#34C759' : 'rgba(0,0,0,0.03)',
                                        color: selectedDays.includes(day.id) ? 'white' : 'var(--text-secondary)',
                                        fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {day.label.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>
                </form>
            </div>

            {/* Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: 'var(--surface-color)', borderRadius: '32px', border: '1px dashed var(--border-color)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', backgroundColor: 'rgba(52, 199, 89, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#34C759' }}>
                            <ShoppingCart size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '8px' }}>Lista Vazia</h3>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Nenhum item agendado para compra.</p>
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--border-color)', opacity: item.completed ? 0.6 : 1 }}>
                            <button
                                onClick={() => toggleTask(item.id, item.completed)}
                                style={{
                                    width: '28px', height: '28px', borderRadius: '50%',
                                    border: `2px solid ${item.completed ? '#34C759' : 'rgba(0,0,0,0.1)'}`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: item.completed ? '#34C759' : 'transparent',
                                    cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0
                                }}
                            >
                                {item.completed && <CheckCircle2 size={16} color="white" />}
                            </button>

                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', textDecoration: item.completed ? 'line-through' : 'none', marginBottom: '4px' }}>{item.title}</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.65rem', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(52, 199, 89, 0.08)', color: '#34C759', textTransform: 'uppercase' }}>{item.shopCategory || item.category}</span>
                                    {item.recurrence && item.recurrence.length > 0 && (
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            {item.recurrence.map(d => (
                                                <span key={d} style={{ fontSize: '0.6rem', fontWeight: '900', color: 'var(--text-tertiary)' }}>
                                                    {daysOfWeek.find(day => day.id === d)?.label.charAt(0)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={() => deleteTask(item.id)}
                                style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', opacity: 0.3, cursor: 'pointer', padding: '8px' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ShoppingView;
