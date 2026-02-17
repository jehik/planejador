import React from 'react';
import { Droplets, Coffee, Utensils, Moon, CheckCircle, Circle, Plus, Info } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const NutritionView = () => {
    const { activeUser, users, addWater, toggleMeal } = useAppStore();
    const nutrition = users[activeUser]?.nutrition || { water: 0, meals: {} };

    // Water Logic
    const waterTarget = 4000;
    const waterPercentage = Math.min(100, Math.round((nutrition.water / waterTarget) * 100));

    // Meal Logic
    const meals = [
        { id: 'breakfast', label: 'Café da Manhã', icon: Coffee },
        { id: 'lunch', label: 'Almoço', icon: Utensils },
        { id: 'snack', label: 'Lanche', icon: Coffee }, // reusing Coffee for snack
        { id: 'dinner', label: 'Jantar', icon: Moon }
    ];

    return (
        <div className="fade-in" style={{ paddingBottom: '80px' }}>
            <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 'bold' }}>Alimentação e Água</h2>

            {/* Educational Tip */}
            <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                padding: '16px',
                borderRadius: '16px',
                marginBottom: '24px',
                display: 'flex',
                gap: '12px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
            }}>
                <Info size={24} color="var(--primary-color)" style={{ minWidth: '24px' }} />
                <div>
                    <h4 style={{ fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '4px' }}>Dica do Dia</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        Beba água antes das refeições para ajudar na digestão e controle do apetite. Coma devagar.
                    </p>
                </div>
            </div>

            {/* Water Tracker */}
            <div style={{
                backgroundColor: 'var(--surface-color)',
                padding: '24px',
                borderRadius: '24px',
                marginBottom: '24px',
                border: '1px solid var(--border-color)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
                    <Droplets size={24} color="#3B82F6" fill="#3B82F6" />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Hidratação</h3>
                </div>

                <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: 'var(--text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                    marginBottom: '8px'
                }}>
                    {nutrition.water} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/ {waterTarget}ml</span>
                </div>

                {/* Visual Cup */}
                <div style={{
                    width: '100px',
                    height: '140px',
                    border: '4px solid var(--text-secondary)',
                    borderTop: 'none',
                    borderRadius: '0 0 16px 16px',
                    margin: '0 auto 20px auto',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }}>
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: `${waterPercentage}%`,
                        backgroundColor: '#3B82F6',
                        transition: 'height 0.5s ease'
                    }} />
                    {/* Bubbles could go here */}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                        onClick={() => addWater(250)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            backgroundColor: 'white',
                            border: '1px solid var(--border-color)',
                            color: '#3B82F6',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Plus size={16} /> 250ml
                    </button>
                    <button
                        onClick={() => addWater(500)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '12px',
                            backgroundColor: '#3B82F6',
                            border: 'none',
                            color: 'white',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
                        }}
                    >
                        <Plus size={16} /> 500ml
                    </button>
                </div>
            </div>

            {/* Meals Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginLeft: '4px' }}>Refeições</h3>
                {meals.map(meal => {
                    const isChecked = nutrition.meals[meal.id];
                    const Icon = meal.icon;
                    return (
                        <div key={meal.id}
                            onClick={() => toggleMeal(meal.id)}
                            style={{
                                backgroundColor: 'var(--surface-color)',
                                padding: '16px',
                                borderRadius: '16px',
                                border: isChecked ? '1px solid var(--success-color)' : '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                opacity: isChecked ? 0.8 : 1
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                backgroundColor: isChecked ? 'var(--success-color)' : 'var(--bg-color)',
                                color: isChecked ? 'white' : 'var(--text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Icon size={20} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <h4 style={{
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    color: isChecked ? 'var(--text-secondary)' : 'var(--text-primary)',
                                    textDecoration: isChecked ? 'line-through' : 'none'
                                }}>
                                    {meal.label}
                                </h4>
                            </div>

                            <div style={{ color: isChecked ? 'var(--success-color)' : 'var(--text-secondary)' }}>
                                {isChecked ? <CheckCircle size={24} fill="currentColor" color="white" /> : <Circle size={24} />}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default NutritionView;
