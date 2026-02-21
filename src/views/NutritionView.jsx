import React, { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import { Droplets, Plus, Heart, Edit3, X, Save, Coffee, Utensils, Sandwich, Moon, Dumbbell, Sparkles } from 'lucide-react';
import { getRandomMessage } from '../components/nutrition/NutritionMessages';

const NutritionView = () => {
    const { userData, setUserData, addWater } = useAppStore();
    const nutrition = userData?.nutrition || {
        water: 0,
        plan: { breakfast: '', lunch: '', snack: '', dinner: '', preWorkout: '', postWorkout: '', hasWorkoutMeals: false }
    };
    const plan = nutrition.plan || { breakfast: '', lunch: '', snack: '', dinner: '', preWorkout: '', postWorkout: '', hasWorkoutMeals: false };

    const GOAL_WATER = 4000; // 4 Litros

    // UI State
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');

    // Editing State (Temporary)
    const [editPlan, setEditPlan] = useState({ ...plan });

    useEffect(() => {
        setMessage(getRandomMessage());
    }, []);

    const handleSaveRoutine = (e) => {
        if (e) e.preventDefault();
        setUserData(data => ({
            ...data,
            nutrition: {
                ...data.nutrition,
                plan: editPlan
            }
        }));
        setIsEditing(false);
    };

    const waterPercentage = Math.min(100, (nutrition.water / GOAL_WATER) * 100);

    const MealCard = ({ icon: Icon, title, content, color, emptyText = "Não definido" }) => (
        <div className="card" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start', border: '1px solid rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={24} />
            </div>
            <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '0.05em' }}>{title}</h4>
                <p style={{ fontSize: '1.05rem', fontWeight: '700', color: content ? 'var(--text-primary)' : 'var(--text-tertiary)', lineHeight: '1.4' }}>
                    {content || emptyText}
                </p>
            </div>
        </div>
    );

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Sua Rotina Nutricional</h2>
                    <p className="text-sm text-secondary">Alimentação fixa para o seu sucesso diário</p>
                </div>
                <button
                    onClick={() => {
                        setEditPlan({ ...plan });
                        setIsEditing(true);
                    }}
                    style={{
                        padding: '10px 16px', borderRadius: '12px',
                        backgroundColor: 'var(--text-primary)', color: 'white',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem'
                    }}>
                    <Edit3 size={18} /> Editar Rotina
                </button>
            </div>

            {/* Motivation Message */}
            <div style={{
                padding: '14px 16px', borderRadius: '16px',
                backgroundColor: 'rgba(236, 72, 153, 0.04)',
                border: '1px solid rgba(236, 72, 153, 0.08)',
                display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '32px'
            }}>
                <Sparkles size={16} color="#EC4899" fill="#EC4899" />
                <p style={{ fontSize: '0.8rem', color: '#EC4899', fontWeight: '600', fontStyle: 'italic' }}>
                    {message}
                </p>
            </div>

            {/* Nutrition Plan Display */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                <MealCard icon={Coffee} title="Café da Manhã" content={plan.breakfast} color="#FF9500" />

                {plan.hasWorkoutMeals && plan.preWorkout && (
                    <MealCard icon={Dumbbell} title="Pré-Treino" content={plan.preWorkout} color="#FF2D55" />
                )}

                <MealCard icon={Utensils} title="Almoço" content={plan.lunch} color="#10B981" />

                {plan.hasWorkoutMeals && plan.postWorkout && (
                    <MealCard icon={Dumbbell} title="Pós-Treino" content={plan.postWorkout} color="#5856D6" />
                )}

                <MealCard icon={Sandwich} title="Lanche da Tarde" content={plan.snack} color="#8B5CF6" />
                <MealCard icon={Moon} title="Jantar" content={plan.dinner} color="#3B82F6" />
            </div>

            {/* Apple Fitness Style Water Card */}
            <div className="card" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', border: '1px solid rgba(0, 122, 255, 0.1)' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                        <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(0, 122, 255, 0.05)"
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
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Droplets size={24} color="var(--primary-color)" style={{ marginBottom: '4px' }} />
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: '1' }}>{nutrition.water}<span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>ml</span></h3>
                        <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Meta: {GOAL_WATER}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button onClick={() => addWater(250)} style={{ flex: 1, padding: '14px', borderRadius: '16px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>+250ml</button>
                    <button onClick={() => addWater(500)} style={{ flex: 1.2, padding: '14px', borderRadius: '16px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 122, 255, 0.2)' }}>Beber +500ml</button>
                </div>
            </div>

            {/* Edit Routine Modal */}
            {isEditing && (
                <div className="fade-in" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '32px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Configurar Rotina</h3>
                            <button onClick={() => setIsEditing(false)} style={{ border: 'none', background: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSaveRoutine}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Café da Manhã</label>
                                    <input value={editPlan.breakfast} onChange={e => setEditPlan({ ...editPlan, breakfast: e.target.value })} placeholder="O que você costuma comer?" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' }} />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '12px', backgroundColor: 'rgba(0,0,0,0.02)', border: '1px solid var(--border-color)' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Incluir refeições Pré/Pós Treino?</span>
                                    <button
                                        type="button"
                                        onClick={() => setEditPlan({ ...editPlan, hasWorkoutMeals: !editPlan.hasWorkoutMeals })}
                                        style={{
                                            width: '44px', height: '24px', borderRadius: '12px',
                                            backgroundColor: editPlan.hasWorkoutMeals ? '#10B981' : '#E5E7EB',
                                            position: 'relative', border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                                        }}
                                    >
                                        <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '3px', left: editPlan.hasWorkoutMeals ? '23px' : '3px', transition: 'all 0.3s' }} />
                                    </button>
                                </div>

                                {editPlan.hasWorkoutMeals && (
                                    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Pré-Treino</label>
                                            <input value={editPlan.preWorkout} onChange={e => setEditPlan({ ...editPlan, preWorkout: e.target.value })} placeholder="Pós-treino..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '6px' }}>Pós-Treino</label>
                                            <input value={editPlan.postWorkout} onChange={e => setEditPlan({ ...editPlan, postWorkout: e.target.value })} placeholder="Pré-treino..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Almoço</label>
                                    <input value={editPlan.lunch} onChange={e => setEditPlan({ ...editPlan, lunch: e.target.value })} placeholder="O que pretende almoçar?" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Lanche da Tarde</label>
                                    <input value={editPlan.snack} onChange={e => setEditPlan({ ...editPlan, snack: e.target.value })} placeholder="O que lanchar à tarde?" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Jantar</label>
                                    <input value={editPlan.dinner} onChange={e => setEditPlan({ ...editPlan, dinner: e.target.value })} placeholder="Qual será sua última refeição?" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontWeight: '600' }} />
                                </div>
                            </div>

                            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                                <button type="button" onClick={() => setIsEditing(false)} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)', fontWeight: '700', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ flex: 1, padding: '16px', borderRadius: '14px', border: 'none', background: 'var(--text-primary)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Save size={20} /> Salvar Rotina
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NutritionView;
