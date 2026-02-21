import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { Home, Plus, CheckCircle, Trash2, Filter, Sun, Sunset, Moon, AlignLeft, X } from 'lucide-react';

const HouseView = () => {
    const { tasks, addTask, toggleTask, deleteTask } = useAppStore();
    const [title, setTitle] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [categoryType, setCategoryType] = useState('cleaning');
    const [period, setPeriod] = useState(null);
    const [notes, setNotes] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const daysOfWeek = [
        { id: 'sun', label: 'Dom' },
        { id: 'mon', label: 'Seg' },
        { id: 'tue', label: 'Ter' },
        { id: 'wed', label: 'Qua' },
        { id: 'thu', label: 'Qui' },
        { id: 'fri', label: 'Sex' },
        { id: 'sat', label: 'Sáb' }
    ];

    const categories = [
        { id: 'cleaning', label: 'Limpeza', color: '#10B981', bg: 'rgba(16, 185, 129, 0.08)' },
        { id: 'organization', label: 'Organização', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.08)' }
    ];

    const periods = [
        { id: 'morning', label: 'Manhã', icon: Sun, color: '#F59E0B' },
        { id: 'afternoon', label: 'Tarde', icon: Sunset, color: '#F97316' },
        { id: 'night', label: 'Noite', icon: Moon, color: '#8B5CF6' }
    ];

    const houseTasks = tasks.filter(t => t.category === 'house').sort((a, b) => a.completed - b.completed);

    const [isSaving, setIsSaving] = useState(false);

    const handleAdd = async () => {
        if (!title.trim() || isSaving) return;

        setIsSaving(true);
        try {
            await addTask({
                title: title,
                category: 'house',
                houseCategory: categoryType,
                scheduledAt: new Date().toISOString(),
                periodType: 'day',
                recurrence: selectedDays,
                period: period,
                description: notes
            });
            setTitle('');
            setNotes('');
            setPeriod(null);
            setSelectedDays([]);
            setIsAdding(false);
        } catch (error) {
            console.error("House save error:", error);
            alert("Erro ao salvar tarefa da casa. Verifique sua conexão.");
        } finally {
            setIsSaving(false);
        }
    };

    const toggleDaySelection = (dayId) => {
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(d => d !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    return (
        <div className="fade-in" style={{ paddingBottom: '120px', paddingTop: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 className="text-xl">Casa</h2>
                    <p className="text-sm text-secondary">Organize seu santuário</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        width: '44px', height: '44px',
                        borderRadius: '14px',
                        backgroundColor: isAdding ? 'var(--text-primary)' : 'rgba(245, 158, 11, 0.08)',
                        color: isAdding ? 'white' : '#F59E0B',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                    }}>
                    {isAdding ? <X size={20} /> : <Plus size={24} strokeWidth={2.5} />}
                </button>
            </div>

            {/* Quick Add Form */}
            {isAdding && (
                <div className="card fade-in" style={{ marginBottom: '32px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Categoria</label>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setCategoryType(cat.id)}
                                    style={{
                                        flexShrink: 0, padding: '10px 16px', borderRadius: '12px', border: 'none',
                                        backgroundColor: categoryType === cat.id ? cat.color : 'rgba(0,0,0,0.03)',
                                        color: categoryType === cat.id ? 'white' : 'var(--text-secondary)',
                                        fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>O que precisa ser feito?</label>
                        <input
                            value={title} onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: Lavar louça, Aspirar sala..."
                            autoFocus
                            style={{
                                width: '100%', padding: '12px', backgroundColor: 'rgba(0,0,0,0.02)',
                                border: '1px solid var(--border-color)', borderRadius: '12px',
                                fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)', outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Período</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {periods.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => setPeriod(period === p.id ? null : p.id)}
                                    style={{
                                        flex: 1, padding: '12px 8px', borderRadius: '12px', border: 'none',
                                        backgroundColor: period === p.id ? p.color : 'rgba(0,0,0,0.03)',
                                        color: period === p.id ? 'white' : 'var(--text-secondary)',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <p.icon size={18} />
                                    <span style={{ fontSize: '0.7rem', fontWeight: '700' }}>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Dias (Recorrência)</label>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
                            {daysOfWeek.map(day => (
                                <button
                                    key={day.id}
                                    onClick={() => toggleDaySelection(day.id)}
                                    style={{
                                        flex: 1, height: '36px', borderRadius: '10px', border: 'none',
                                        backgroundColor: selectedDays.includes(day.id) ? 'var(--text-primary)' : 'rgba(0,0,0,0.03)',
                                        color: selectedDays.includes(day.id) ? 'white' : 'var(--text-secondary)',
                                        fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {day.label.charAt(0)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>Anotações</label>
                        <div style={{ position: 'relative' }}>
                            <AlignLeft size={16} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-tertiary)' }} />
                            <textarea
                                placeholder="Mais detalhes..."
                                value={notes} onChange={(e) => setNotes(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border-color)',
                                    backgroundColor: 'rgba(0,0,0,0.02)', color: 'var(--text-primary)', fontSize: '0.9rem',
                                    minHeight: '80px', outline: 'none', resize: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        disabled={isSaving || !title.trim()}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '14px',
                            backgroundColor: isSaving ? 'var(--text-tertiary)' : '#F59E0B',
                            boxShadow: isSaving ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.2)',
                            cursor: isSaving ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isSaving ? 'Salvando...' : 'Agendar Tarefa'}
                    </button>
                </div>
            )}

            {/* List Section */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="text-lg">Suas Tarefas</h3>
                    <div style={{ padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(0,0,0,0.03)', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                        {houseTasks.filter(t => !t.completed).length} Pendentes
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {houseTasks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px 24px', opacity: 0.5 }}>
                            <Home size={40} style={{ marginBottom: '16px', opacity: 0.2 }} />
                            <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Sua casa está impecável!</p>
                        </div>
                    ) : (
                        houseTasks.map(task => {
                            const cat = categories.find(c => c.id === task.houseCategory) || categories[0];
                            const taskPeriod = periods.find(p => p.id === task.period);
                            return (
                                <div key={task.id} className="card fade-in" style={{ padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                    <button
                                        onClick={() => toggleTask(task.id, task.completed)}
                                        style={{
                                            width: '32px', height: '32px', borderRadius: '50%',
                                            border: `2px solid ${task.completed ? '#10B981' : 'var(--border-color)'}`,
                                            backgroundColor: task.completed ? '#10B981' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, marginTop: '2px'
                                        }}
                                    >
                                        {task.completed && <CheckCircle size={20} strokeWidth={3} />}
                                    </button>

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{
                                            fontSize: '1rem', fontWeight: '700',
                                            color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            marginBottom: '6px'
                                        }}>
                                            {task.title}
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.02em',
                                                color: cat.color, backgroundColor: cat.bg, padding: '2px 8px', borderRadius: '6px'
                                            }}>
                                                {cat.label}
                                            </span>
                                            {taskPeriod && (
                                                <span style={{
                                                    fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.02em',
                                                    color: taskPeriod.color, backgroundColor: `${taskPeriod.color}15`, padding: '2px 8px', borderRadius: '6px',
                                                    display: 'flex', alignItems: 'center', gap: '4px'
                                                }}>
                                                    <taskPeriod.icon size={10} /> {taskPeriod.label}
                                                </span>
                                            )}
                                        </div>

                                        {/* Exibição dos dias de recorrência */}
                                        {task.recurrence && task.recurrence.length > 0 && (
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                                                {task.recurrence.map(dayId => {
                                                    const day = daysOfWeek.find(d => d.id === dayId);
                                                    return (
                                                        <span key={dayId} style={{
                                                            fontSize: '0.6rem',
                                                            fontWeight: '800',
                                                            backgroundColor: 'rgba(0,0,0,0.05)',
                                                            padding: '2px 6px',
                                                            borderRadius: '6px',
                                                            color: 'var(--text-secondary)',
                                                            textTransform: 'uppercase'
                                                        }}>
                                                            {day?.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {task.description && (
                                            <p style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                                {task.description}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => deleteTask(task.id)}
                                        style={{ padding: '4px', color: 'var(--danger-color)', opacity: 0.2, border: 'none', background: 'none', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default HouseView;
