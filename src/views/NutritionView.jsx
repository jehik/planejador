import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { Droplets, Coffee, Utensils, Moon, Plus, ArrowRight, Heart } from 'lucide-react';
import { getRandomMessage } from '../components/nutrition/NutritionMessages';
import TaskItem from '../components/tasks/TaskItem';

const NutritionView = () => {
    const { userData, tasks, addWater, addTask } = useAppStore();
    const nutrition = userData?.nutrition || { water: 0 };

    // Local State for "Add Meal"
    const [isAdding, setIsAdding] = useState(false);
    const [mealType, setMealType] = useState('breakfast');
    const [food, setFood] = useState('');
    const [obs, setObs] = useState('');
    const [time, setTime] = useState('');

    // Motivation Message
    const [message, setMessage] = useState('');

    useEffect(() => {
        setMessage(getRandomMessage());
    }, []);

    // Filter Meals (Tasks with category 'nutrition' for TODAY)
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysMeals = tasks.filter(t =>
        t.category === 'nutrition' &&
        new Date(t.scheduledAt).toISOString().split('T')[0] === todayStr
    ).sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    const handleAddMeal = (e) => {
        e.preventDefault();
        if (!food.trim() || !time) return;

        const scheduledAt = new Date(`${todayStr}T${time}:00`);

        addTask({
            title: `${getMealLabel(mealType)}: ${food}`, // Aggregate title or keep separate? Prompt: "O que vou comer", "Observações"
            description: obs, // Store obs in description
            category: 'nutrition',
            mealType: mealType, // Custom field
            scheduledAt: scheduledAt,
            periodType: 'day'
        });

        // Reset
        setFood('');
        setObs('');
        setIsAdding(false);
        setMessage(getRandomMessage()); // New message on add
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

    return (
        <div className="fade-in" style={{ padding: '20px 20px 100px 20px' }}>
            {/* Header with Message */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Nutrição</h2>
                <div style={{
                    marginTop: '10px',
                    padding: '12px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    color: '#BE185D',
                    fontSize: '0.9rem',
                    display: 'flex', gap: '8px', alignItems: 'center'
                }}>
                    <Heart size={16} fill="currentColor" />
                    <p style={{ fontStyle: 'italic' }}>"{message}"</p>
                </div>
            </div>

            {/* Water Section */}
            <div style={{
                backgroundColor: 'var(--surface-color)',
                borderRadius: '24px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Droplets size={24} color="#3B82F6" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Hidratação</h3>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', fontVariantNumeric: 'tabular-nums' }}>
                        {nutrition.water} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>ml</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                        <button onClick={() => addWater(250)} style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'white' }}>+ 250ml</button>
                        <button onClick={() => addWater(500)} style={{ padding: '8px 16px', borderRadius: '12px', border: 'none', background: '#3B82F6', color: 'white' }}>+ 500ml</button>
                    </div>
                </div>
            </div>

            {/* Meals Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Refeições de Hoje</h3>
                    <button
                        onClick={() => setIsAdding(!isAdding)}
                        style={{
                            background: 'var(--primary-color)',
                            color: 'white',
                            borderRadius: '50%',
                            width: '32px', height: '32px',
                            border: 'none',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Add Form */}
                {isAdding && (
                    <div className="fade-in" style={{
                        backgroundColor: 'var(--surface-color)',
                        padding: '16px', borderRadius: '16px', marginBottom: '16px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {['breakfast', 'lunch', 'snack', 'dinner'].map(type => (
                                <button key={type}
                                    onClick={() => setMealType(type)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: mealType === type ? 'none' : '1px solid var(--border-color)',
                                        background: mealType === type ? 'var(--primary-color)' : 'transparent',
                                        color: mealType === type ? 'white' : 'var(--text-secondary)',
                                        fontSize: '0.8rem',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {getMealLabel(type)}
                                </button>
                            ))}
                        </div>

                        <input
                            placeholder="O que vou comer?"
                            value={food} onChange={e => setFood(e.target.value)}
                            style={{ width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}
                        />
                        <input
                            placeholder="Observações (opcional)"
                            value={obs} onChange={e => setObs(e.target.value)}
                            style={{ width: '100%', padding: '12px', marginBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="time"
                                value={time} onChange={e => setTime(e.target.value)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)' }}
                            />
                            <button onClick={handleAddMeal} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', padding: '0 20px' }}>
                                <ArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {todaysMeals.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                            Nenhuma refeição planejada para hoje.
                        </p>
                    ) : (
                        todaysMeals.map(task => (
                            <TaskItem key={task.id} task={task} showCategory={false} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionView;
