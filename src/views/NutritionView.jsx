import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { Droplets, Plus, ArrowRight, Heart, Trash2, X } from 'lucide-react';
import { getRandomMessage } from '../components/nutrition/NutritionMessages';

const NutritionView = () => {
    const { userData, tasks, addWater, addTask, deleteTask } = useAppStore();
    const nutrition = userData?.nutrition || { water: 0 };
    const GOAL_WATER = 4000; // 4 Litros

    // Local State for "Add Meal"
    const [isAdding, setIsAdding] = useState(false);
    const [mealType, setMealType] = useState('breakfast');
    const [food, setFood] = useState('');
    const [obs, setObs] = useState('');
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(getRandomMessage());
    }, []);

    // Filter Meals
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysMeals = tasks.filter(t =>
        t.category === 'nutrition' &&
        new Date(t.scheduledAt).toISOString().split('T')[0] === todayStr
    ).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    const handleAddMeal = (e) => {
        if (e) e.preventDefault();
        if (!food.trim()) return;

        const scheduledAt = new Date();
        const [hours, minutes] = time.split(':');
        scheduledAt.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        addTask({
            title: food,
            description: obs,
            category: 'nutrition',
            mealType: mealType,
            scheduledAt: scheduledAt.toISOString(),
            periodType: 'day'
        });
        setFood('');
        setObs('');
        setIsAdding(false);
    };

    const getMealLabel = (type) => {
        switch (type) {
            case 'breakfast': return 'Café da Manhã';
            case 'lunch': return 'Almoço';
            case 'snack': return 'Lanche';
            case 'dinner': return 'Jantar';
            default: return 'Refeição';
        }
    };

    const waterPercentage = Math.min(100, (nutrition.water / GOAL_WATER) * 100);

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: 'env(safe-area-inset-top, 24px)' }}>
            {/* Header / Message */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                        <h2 className="text-xl">Nutrição</h2>
                        <p className="text-sm text-secondary">Mantenha seu corpo nutrido</p>
                    </div>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        style={{
                            width: '44px', height: '44px',
                            borderRadius: '14px',
                            backgroundColor: isAdding ? 'var(--text-primary)' : 'rgba(236, 72, 153, 0.08)',
                            color: isAdding ? 'white' : '#EC4899',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                        }}>
                        {isAdding ? <X size={20} /> : <Plus size={24} strokeWidth={2.5} />}
                    </button>
                </div>

                <div style={{
                    padding: '14px 16px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(236, 72, 153, 0.04)',
                    border: '1px solid rgba(236, 72, 153, 0.08)',
                    display: 'flex', gap: '10px', alignItems: 'center'
                }}>
                    <Heart size={16} color="#EC4899" fill="#EC4899" />
                    <p style={{ fontSize: '0.8rem', color: '#EC4899', fontWeight: '600', fontStyle: 'italic' }}>
                        {message}
                    </p>
                </div>
            </div>

            {/* Apple Fitness Style Water Card */}
            <div className="card" style={{ marginBottom: '32px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                    {/* Ring Path */}
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(0, 122, 255, 0.08)"
                            strokeWidth="3.5"
                        />
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--primary-color)"
                            strokeWidth="3.5"
                            strokeDasharray={`${waterPercentage}, 100`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1s ease-out' }}
                        />
                    </svg>

                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Droplets size={28} color="var(--primary-color)" style={{ marginBottom: '4px' }} />
                        <h3 style={{ fontSize: '2.2rem', fontWeight: '800', lineHeight: '1' }}>
                            {nutrition.water}<span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ml</span>
                        </h3>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Meta: {GOAL_WATER}
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button
                        onClick={() => addWater(250)}
                        style={{
                            flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)',
                            backgroundColor: 'white', color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer'
                        }}>
                        +250ml
                    </button>
                    <button
                        onClick={() => addWater(500)}
                        style={{
                            flex: 1.2, padding: '14px', borderRadius: '16px', border: 'none',
                            backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer',
                            boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)'
                        }}>
                        Beber +500ml
                    </button>
                </div>
            </div>

            {/* Meals Section */}
            <div>
                <h3 className="text-lg" style={{ marginBottom: '16px' }}>Suas Refeições</h3>

                {isAdding && (
                    <div className="card fade-in" style={{ marginBottom: '24px', border: '1px solid rgba(236, 72, 153, 0.1)' }}>
                        <form onSubmit={handleAddMeal}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
                                {[
                                    { id: 'breakfast', label: 'Café', color: '#FF9500' },
                                    { id: 'lunch', label: 'Almoço', color: '#10B981' },
                                    { id: 'snack', label: 'Lanche', color: '#8B5CF6' },
                                    { id: 'dinner', label: 'Jantar', color: '#3B82F6' }
                                ].map(m => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setMealType(m.id)}
                                        style={{
                                            padding: '10px 16px', borderRadius: '12px', border: '1px solid transparent',
                                            backgroundColor: mealType === m.id ? m.color : 'rgba(0,0,0,0.03)',
                                            color: mealType === m.id ? 'white' : 'var(--text-secondary)',
                                            fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {m.label}
                                    </button>
                                ))}
                            </div>

                            <input
                                placeholder="O que você comeu?"
                                value={food} onChange={e => setFood(e.target.value)}
                                autoFocus
                                style={{
                                    width: '100%', padding: '0 0 16px 0', backgroundColor: 'transparent',
                                    border: 'none', borderBottom: '1px solid var(--border-color)', marginBottom: '20px',
                                    fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none'
                                }}
                            />

                            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Horário</label>
                                    <input
                                        type="time"
                                        value={time} onChange={e => setTime(e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                            backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '600', outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px' }}>Observação</label>
                                    <input
                                        placeholder="Ex: Refeição livre"
                                        value={obs} onChange={e => setObs(e.target.value)}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                            backgroundColor: 'rgba(0,0,0,0.015)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none'
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '16px', borderRadius: '14px', backgroundColor: '#EC4899', boxShadow: '0 4px 12px rgba(236, 72, 153, 0.2)' }}
                            >
                                Registrar Refeição
                            </button>
                        </form>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {todaysMeals.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 24px', opacity: 0.5, border: '1px dashed var(--border-color)', borderRadius: '20px' }}>
                            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Nenhuma refeição registrada hoje.</p>
                        </div>
                    ) : (
                        todaysMeals.map(meal => (
                            <div key={meal.id} className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: '12px',
                                    backgroundColor: 'rgba(236, 72, 153, 0.04)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#EC4899', fontSize: '0.8rem', fontWeight: '800', flexShrink: 0
                                }}>
                                    {new Date(meal.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>

                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#EC4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {getMealLabel(meal.mealType)}
                                        </span>
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: meal.description ? '4px' : '0' }}>
                                        {meal.title}
                                    </h4>
                                    {meal.description && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{meal.description}</p>
                                    )}
                                </div>

                                <button
                                    onClick={() => deleteTask(meal.id)}
                                    style={{ padding: '8px', color: 'var(--danger-color)', opacity: 0.3, border: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    <Trash2 size={18} strokeWidth={2} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionView;
