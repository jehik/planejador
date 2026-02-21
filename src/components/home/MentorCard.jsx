import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { fetchMentorAdvice } from '../../services/mentorService';
import { Sparkles, Brain, Zap, Target, ArrowRight, Loader2, Quote } from 'lucide-react';

const MentorCard = () => {
    const { currentUser } = useAppStore();
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatQuestion, setChatQuestion] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    const userName = currentUser?.email?.includes('debora') ? 'debora' : 'cassio';
    const accentColor = userName === 'cassio' ? '#4F46E5' : '#EC4899';

    useEffect(() => {
        const getAdvice = async () => {
            setLoading(true);
            try {
                const data = await fetchMentorAdvice(userName);
                setAdvice(data);
            } catch (err) {
                console.error("Failed to load mentor advice:", err);
            } finally {
                setLoading(false);
            }
        };
        getAdvice();
    }, [userName]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatQuestion.trim() || chatLoading) return;

        setChatLoading(true);
        try {
            const data = await fetchMentorAdvice(userName, chatQuestion);
            // Mesclar resposta do chat com o conselho atual, ou apenas atualizar o chatResponse
            setAdvice(prev => ({ ...prev, chatResponse: data.chatResponse }));
            setChatQuestion('');
        } catch (err) {
            console.error("Chat Error:", err);
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="card fade-in" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                    <Loader2 size={32} className="spin" style={{ color: 'var(--primary-color)' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)', opacity: 0.1, filter: 'blur(10px)' }}></div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Invocando Mentor IA...</p>
                <style>{`.spin { animation: spin 2s linear infinite; } @keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!advice) return null;

    return (
        <div className="card fade-in" style={{
            padding: '32px',
            background: `linear-gradient(135deg, var(--surface-color) 0%, ${accentColor}08 100%)`,
            border: `1px solid ${accentColor}20`,
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Apple Intelligence Glow Effect */}
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: `0 8px 16px ${accentColor}30` }}>
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.03em' }}>Professor IA</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Apple Intelligence System</p>
                    </div>
                </div>

                {/* Main Insight Card */}
                <div style={{
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    backdropFilter: 'blur(10px)',
                    padding: '24px',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.5)',
                    marginBottom: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                }}>
                    <Quote size={20} style={{ color: accentColor, opacity: 0.3, marginBottom: '12px' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.5', fontStyle: 'italic' }}>
                        "{advice.fraseMentor}"
                    </p>
                </div>

                {/* Chat Response Area (Condicional) */}
                {advice.chatResponse && (
                    <div className="fade-in" style={{
                        backgroundColor: `${accentColor}10`,
                        padding: '20px',
                        borderRadius: '20px',
                        border: `1px solid ${accentColor}20`,
                        marginBottom: '24px',
                        animation: 'slideUp 0.4s ease-out'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor }}></div>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: accentColor, textTransform: 'uppercase' }}>Resposta do Mentor</span>
                        </div>
                        <p style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                            {advice.chatResponse}
                        </p>
                    </div>
                )}

                {/* Grid for details */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '20px', borderRadius: '20px', gridColumn: 'span 2', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Brain size={18} style={{ color: accentColor }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Análise Comportamental</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {advice.analiseComportamental}
                        </p>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Zap size={16} style={{ color: '#FF9500' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Ajuste Agora</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{advice.ajusteImediato}</p>
                    </div>

                    <div style={{ backgroundColor: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Target size={16} style={{ color: '#34C759' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Amanhã</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>{advice.acaoMinimaAmanha}</p>
                    </div>

                    {userName === 'debora' && (
                        <div style={{ backgroundColor: `${accentColor}05`, padding: '20px', borderRadius: '20px', gridColumn: 'span 2', border: `1px solid ${accentColor}10` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <Sparkles size={16} style={{ color: accentColor }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: accentColor, textTransform: 'uppercase' }}>Neurociência & Visualização</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.4' }}>{advice.explicacaoNeurocientifica}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-primary)' }}>{advice.fraseProsperidade}</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input Section */}
                <div style={{ marginTop: '24px' }}>
                    <form onSubmit={handleChatSubmit} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        padding: '8px 8px 8px 20px',
                        borderRadius: '22px',
                        border: '1px solid rgba(0,0,0,0.02)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <input
                            type="text"
                            placeholder="Pergunte ao Mentor..."
                            value={chatQuestion}
                            onChange={(e) => setChatQuestion(e.target.value)}
                            disabled={chatLoading}
                            style={{
                                flex: 1,
                                background: 'transparent',
                                border: 'none',
                                outline: 'none',
                                color: 'var(--text-primary)',
                                fontSize: '0.95rem',
                                fontWeight: '600'
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!chatQuestion.trim() || chatLoading}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: chatQuestion.trim() ? accentColor : 'rgba(0,0,0,0.05)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: chatQuestion.trim() ? 'pointer' : 'default',
                                transition: 'all 0.3s'
                            }}
                        >
                            {chatLoading ? <Loader2 size={18} className="spin" /> : <ArrowRight size={20} />}
                        </button>
                    </form>
                </div>

                {/* Dream Alignment Footer */}
                <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '8px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${advice.alinhamentoSonho || 0}%`, height: '100%', backgroundColor: accentColor, borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-tertiary)' }}>Alinhamento com Sonho</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '900', color: accentColor }}>{advice.alinhamentoSonho || 0}%</span>
                </div>
            </div>
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .spin { animation: spin 2s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default MentorCard;
