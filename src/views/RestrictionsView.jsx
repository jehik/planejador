import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import {
    Plus,
    Trash2,
    Shield,
    Activity,
    Coffee,
    Wine,
    Candy,
    Smartphone,
    TrendingDown,
    Timer,
    CheckCircle2,
    Info,
    ChevronRight,
    Droplets,
    X
} from 'lucide-react';

const RestrictionsView = () => {
    const { userData, addRestriction, updateRestriction, removeRestriction } = useAppStore();
    const [showModal, setShowModal] = useState(false);
    const [newRestriction, setNewRestriction] = useState({
        type: 'Açúcar',
        days: 7,
        strategy: 'Redução progressiva'
    });

    const restrictions = userData?.restrictions || [];

    const getIcon = (type) => {
        switch (type) {
            case 'Açúcar': return <Candy size={20} />;
            case 'Álcool': return <Wine size={20} />;
            case 'Refrigerante': return <Droplets size={20} />;
            case 'Café': return <Coffee size={20} />;
            case 'Redes sociais': return <Smartphone size={20} />;
            default: return <Shield size={20} />;
        }
    };

    const smartMessages = [
        "Controle é poder.",
        "Não é sobre proibir, é sobre escolher.",
        "Pequenas vitórias constroem disciplina.",
        "Equilíbrio > Extremismo.",
        "Sustentável é melhor que radical.",
        "O objetivo é consciência.",
        "Redução também é progresso.",
        "Consistência supera intensidade.",
        "Você está no controle.",
        "Um ciclo de cada vez."
    ];

    const randomMessage = smartMessages[Math.floor(Math.random() * smartMessages.length)];

    const getDurationFeedback = (days) => {
        if (days >= 1 && days <= 3) return { text: "Bom começo.", color: "var(--primary-color)" };
        if (days >= 4 && days <= 7) return { text: "Ótimo ciclo de teste.", color: "#34C759" };
        if (days >= 8 && days <= 14) return { text: "Avalie se é sustentável.", color: "#FF9500" };
        return { text: "Cuidado com restrições extremas.", color: "#FF3B30" };
    };

    const handleAdd = (e) => {
        e.preventDefault();
        if (newRestriction.days <= 0) return;
        addRestriction(newRestriction);
        setShowModal(false);
        setNewRestriction({ type: 'Açúcar', days: 7, strategy: 'Redução progressiva' });
    };

    const handleIncrement = (id, current, max) => {
        if (current < max) {
            updateRestriction(id, { completedDays: current + 1 });
            if (current + 1 === max) {
                updateRestriction(id, { status: 'concluded' });
            }
        }
    };

    return (
        <div className="view-container fade-in" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>

            {/* Header com Frase Inteligente */}
            <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>Restrições</h1>
                <p style={{ color: 'var(--text-secondary)', fontWeight: '500', fontSize: '1.1rem' }}>
                    {randomMessage}
                </p>
            </header>

            {restrictions.length === 0 ? (
                /* Empty State */
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'var(--surface-color)',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                    }}>
                        <Shield size={40} color="var(--primary-color)" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '16px' }}>Controle inteligente, não radical.</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto 40px' }}>
                        Grandes mudanças não precisam ser extremas. Reduzir com estratégia é mais sustentável do que cortar tudo de uma vez.
                    </p>



                    <button
                        onClick={() => setShowModal(true)}
                        style={{
                            backgroundColor: '#000',
                            color: '#FFF',
                            padding: '18px 32px',
                            borderRadius: '14px',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            margin: '0 auto',
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Plus size={20} />
                        Adicionar nova restrição
                    </button>
                </div>
            ) : (
                /* List View Refinada com Grid e Progresso Circular */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Suas Estratégias</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                                {restrictions.filter(r => r.status !== 'concluded').length} ativas • Foco na consistência
                            </p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            style={{
                                backgroundColor: '#000',
                                color: 'white',
                                border: 'none',
                                padding: '12px 20px',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <Plus size={18} /> Adicionar
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                        {restrictions.map(r => {
                            const progress = (r.completedDays / r.days) * 100;
                            const isConcluded = r.status === 'concluded';
                            const strokeDasharray = 158; // 2 * PI * 25
                            const strokeDashoffset = strokeDasharray - (strokeDasharray * progress) / 100;

                            return (
                                <div key={r.id} className="card fade-in" style={{
                                    padding: '24px',
                                    borderRadius: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '16px',
                                    border: isConcluded ? '1px solid #34C75930' : '1px solid rgba(0,0,0,0.03)',
                                    background: isConcluded ? 'linear-gradient(135deg, var(--surface-color) 0%, #34C75905 100%)' : 'var(--surface-color)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                                    position: 'relative'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '14px',
                                                backgroundColor: isConcluded ? '#34C75915' : 'rgba(0,0,0,0.03)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: isConcluded ? '#34C759' : 'var(--text-secondary)'
                                            }}>
                                                {getIcon(r.type)}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '-0.01em' }}>{r.type}</h4>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: '700', textTransform: 'uppercase' }}>{r.strategy}</span>
                                            </div>
                                        </div>

                                        {/* Circular Progress SVG */}
                                        <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                                            <svg width="56" height="56" viewBox="0 0 60 60">
                                                <circle cx="30" cy="30" r="25" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="5" />
                                                <circle cx="30" cy="30" r="25" fill="none"
                                                    stroke={isConcluded ? '#34C759' : 'var(--primary-color)'}
                                                    strokeWidth="5"
                                                    strokeDasharray={strokeDasharray}
                                                    strokeDashoffset={strokeDashoffset}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 1s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                                />
                                            </svg>
                                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', color: isConcluded ? '#34C759' : 'var(--text-secondary)' }}>
                                                {isConcluded ? <CheckCircle2 size={16} /> : `${Math.round(progress)}%`}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                            {isConcluded ? 'Jornada concluída' : `${r.completedDays} / ${r.days} dias`}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {!isConcluded && (
                                                <button
                                                    onClick={() => handleIncrement(r.id, r.completedDays, r.days)}
                                                    style={{
                                                        padding: '8px 12px',
                                                        borderRadius: '10px',
                                                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                                                        color: '#34C759',
                                                        border: 'none',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Concluir dia
                                                </button>
                                            )}
                                            <button
                                                onClick={() => removeRestriction(r.id)}
                                                style={{ padding: '6px', color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {isConcluded && (
                                        <div style={{
                                            backgroundColor: '#34C75908',
                                            padding: '10px',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            color: '#1D8A3A',
                                            fontWeight: '600',
                                            textAlign: 'center',
                                            border: '1px solid #34C75910'
                                        }}>
                                            “Equilíbrio é consistência, não rigidez.”
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '24px', padding: '24px', backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: '20px', textAlign: 'center' }}>
                        <Shield size={24} style={{ color: 'var(--primary-color)', opacity: 0.3, marginBottom: '12px' }} />
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '300px', margin: '0 auto' }}>
                            A consciência sobre o vício é o primeiro passo para o controle real.
                        </p>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 2000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }} onClick={() => setShowModal(false)}>
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            width: '100%',
                            maxWidth: '440px',
                            borderRadius: '32px',
                            padding: '32px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            position: 'relative'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.02em' }}>Nova Estratégia</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px', fontWeight: '500' }}>Defina como você vai lidar com esse vício.</p>

                        <form onSubmit={handleAdd}>
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Hábito</label>
                                <select
                                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', fontWeight: '600', appearance: 'none', backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    value={newRestriction.type}
                                    onChange={e => setNewRestriction({ ...newRestriction, type: e.target.value })}
                                >
                                    <option>Açúcar</option>
                                    <option>Álcool</option>
                                    <option>Refrigerante</option>
                                    <option>Café</option>
                                    <option>Redes sociais</option>
                                    <option>Personalizado</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Quantos dias?</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1.1rem', fontWeight: '700', backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    value={newRestriction.days}
                                    onChange={e => setNewRestriction({ ...newRestriction, days: parseInt(e.target.value) })}
                                />
                                <div style={{ marginTop: '8px', fontSize: '0.8rem', fontWeight: '700', color: getDurationFeedback(newRestriction.days).color }}>
                                    {getDurationFeedback(newRestriction.days).text}
                                </div>
                                {newRestriction.days > 30 && (
                                    <p style={{ color: '#FF3B30', fontSize: '0.75rem', marginTop: '4px', fontWeight: '600' }}>💡 Ciclos menores que 30 dias são mais fáceis de manter!</p>
                                )}
                            </div>

                            <div style={{ marginBottom: '40px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>Estratégia</label>
                                <select
                                    style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.1)', fontSize: '1rem', fontWeight: '600', backgroundColor: 'rgba(0,0,0,0.02)' }}
                                    value={newRestriction.strategy}
                                    onChange={e => setNewRestriction({ ...newRestriction, strategy: e.target.value })}
                                >
                                    <option>Redução progressiva</option>
                                    <option>Pausa temporária</option>
                                    <option>Substituição saudável</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    backgroundColor: '#000',
                                    color: '#FFF',
                                    padding: '18px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    fontSize: '1rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Criar Estratégia
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestrictionsView;
