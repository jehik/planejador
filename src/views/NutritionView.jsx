import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { Droplets, Plus, ArrowRight, Heart, Trash2 } from 'lucide-react';
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
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(getRandomMessage());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter Meals
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysMeals = tasks.filter(t =>
        t.category === 'nutrition' &&
        new Date(t.scheduledAt).toISOString().split('T')[0] === todayStr
    ).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    const handleAddMeal = () => {
        if (!food.trim() || !time) return;
        const scheduledAt = new Date(`${todayStr}T${time}:00`);
        addTask({
            title: food,
            description: obs,
            category: 'nutrition',
            mealType: mealType,
            scheduledAt: scheduledAt,
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

    // Water Animation Props
    const waterPercentage = Math.min(100, (nutrition.water / GOAL_WATER) * 100);

    return (
        <div className="fade-in" style={{ padding: '0 0 100px 0' }}>
            {/* Header / Message */}
            <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>Nutrição</h2>
                <div style={{
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(236, 72, 153, 0.05)',
                    color: '#EC4899',
                    fontSize: '0.9rem',
                    display: 'flex', gap: '8px', alignItems: 'center',
                    border: '1px solid rgba(236, 72, 153, 0.1)'
                }}>
                    <Heart size={16} fill="currentColor" />
                    <p style={{ fontStyle: 'italic' }}>"{message}"</p>
                </div>
            </div>

            {/* Visual Cup / Water Tracker */}
            <div className="water-card card">
                <div className="water-visual">
                    <div className="water-level" style={{ height: `${waterPercentage}%` }}>
                        <div className="wave"></div>
                    </div>
                    <div className="glass-reflection"></div>
                    <div className="water-info-overlay">
                        <Droplets size={32} color={waterPercentage > 50 ? 'white' : '#3B82F6'} />
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: waterPercentage > 50 ? 'white' : 'var(--text-primary)',
                            textShadow: waterPercentage > 50 ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                        }}>
                            {nutrition.water}<span style={{ fontSize: '1rem' }}>ml</span>
                        </h3>
                        <span style={{
                            color: waterPercentage > 50 ? 'rgba(255,255,255,0.8)' : 'var(--text-secondary)',
                            fontSize: '0.9rem'
                        }}>
                            Meta: {GOAL_WATER}ml
                        </span>
                    </div>
                </div>

                <div className="water-controls">
                    <button onClick={() => addWater(250)} className="water-btn">+ 250ml</button>
                    <button onClick={() => addWater(500)} className="water-btn primary">+ 500ml</button>
                </div>
            </div>

            {/* Meals Section */}
            <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Refeições</h3>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        className="btn btn-primary"
                        style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {isAdding && (
                    <div className="card fade-in" style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {['breakfast', 'lunch', 'snack', 'dinner'].map(type => (
                                <button key={type}
                                    onClick={() => setMealType(type)}
                                    className={`btn ${mealType === type ? 'btn-primary' : 'btn-ghost'}`}
                                    style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', borderRadius: '20px' }}
                                >
                                    {getMealLabel(type)}
                                </button>
                            ))}
                        </div>

                        <input
                            placeholder="O que vou comer?"
                            value={food} onChange={e => setFood(e.target.value)}
                            style={{
                                width: '100%', padding: '12px', marginBottom: '8px',
                                borderRadius: '8px', border: '1px solid var(--border-color)',
                                background: 'var(--bg-color)', color: 'var(--text-primary)'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="time"
                                value={time} onChange={e => setTime(e.target.value)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '8px',
                                    border: '1px solid var(--border-color)', background: 'var(--bg-color)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <button onClick={handleAddMeal} className="btn btn-primary" style={{ borderRadius: '8px' }}>
                                <ArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                <div className="meal-list">
                    {todaysMeals.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhuma refeição registrada.</p>
                        </div>
                    ) : (
                        todaysMeals.map(meal => (
                            <div key={meal.id} className="meal-item card">
                                <div className="meal-time">
                                    {new Date(meal.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="meal-info">
                                    <span className="meal-type">{getMealLabel(meal.mealType)}</span>
                                    <h4 className="meal-title">{meal.title}</h4>
                                    {meal.description && <p className="meal-obs">{meal.description}</p>}
                                </div>
                                <button onClick={() => deleteTask(meal.id)} className="delete-btn">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .water-card {
                    margin: 0 20px 24px 20px;
                    padding: 0;
                    overflow: hidden;
                    position: relative;
                }
                .water-visual {
                    height: 200px;
                    position: relative;
                    background: var(--bg-color);
                    border-bottom: 1px solid var(--border-color);
                }
                .water-level {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: linear-gradient(to top, #3B82F6, #60A5FA);
                    transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.8;
                }
                .wave {
                    position: absolute;
                    top: -10px;
                    left: 0;
                    width: 200%;
                    height: 20px;
                    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="%2360A5FA" opacity="0.5"></path></svg>');
                    background-size: 50% 100%;
                    animation: wave 10s linear infinite;
                }
                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .water-info-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }
                .water-controls {
                    padding: 16px;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .water-btn {
                    padding: 8px 16px;
                    border-radius: 12px;
                    border: 1px solid var(--border-color);
                    color: var(--text-primary);
                    background: transparent;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .water-btn.primary {
                    background: #3B82F6;
                    border-color: #3B82F6;
                    color: white;
                }
                .water-btn:hover {
                    transform: scale(1.05);
                }

                .meal-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }
                .meal-item {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 16px;
                }
                .meal-time {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--primary-color);
                    min-width: 50px;
                }
                .meal-info {
                    flex: 1;
                }
                .meal-type {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    color: var(--text-secondary);
                    letter-spacing: 0.5px;
                }
                .meal-title {
                    font-size: 1rem;
                    color: var(--text-primary);
                    margin: 4px 0 0 0;
                }
                .meal-obs {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin: 2px 0 0 0;
                }
                .delete-btn {
                    padding: 8px;
                    color: var(--text-secondary);
                    opacity: 0.5;
                    transition: opacity 0.2s;
                }
                .delete-btn:hover {
                    opacity: 1;
                    color: var(--danger-color);
                }
                .empty-state {
                    text-align: center;
                    padding: 24px;
                    color: var(--text-secondary);
                    border: 1px dashed var(--border-color);
                    border-radius: 16px;
                }
            `}</style>
        </div>
    );
};

export default NutritionView;

