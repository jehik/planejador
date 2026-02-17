import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, AlertTriangle, Target, Lightbulb, Zap, Activity } from 'lucide-react';
import { fetchMentorAdvice } from '../../services/mentorService';
import useAppStore from '../../store/useAppStore';

const MentorCard = () => {
    const { activeUser, users } = useAppStore();
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [showDebug, setShowDebug] = useState(false);

    const isDebora = users[activeUser]?.name === 'Débora';

    const handleConsultMentor = async () => {
        setLoading(true);
        setError(false);
        setErrorMsg("");
        try {
            const data = await fetchMentorAdvice(activeUser);
            if (data) {
                setAdvice(data);
            } else {
                setError(true);
                setErrorMsg("O Mentor não retornou planos válidos. Verifique a chave API ou sua conexão.");
            }
        } catch (e) {
            setError(true);
            setErrorMsg(e.message || "Erro desconhecido ao consultar o Mentor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{
            background: 'var(--surface-color)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        backgroundColor: isDebora ? '#fdf2f8' : '#e0e7ff',
                        padding: '8px',
                        borderRadius: '12px',
                        color: isDebora ? '#db2777' : '#4f46e5'
                    }}>
                        <Brain size={24} />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                            Professor IA
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mentor Comportamental</p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {!advice && !loading && !error && (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '0.9rem' }}>
                        Analiso seus dados em tempo real para te dar a melhor direção hoje.
                    </p>
                    <button
                        onClick={handleConsultMentor}
                        style={{
                            background: isDebora ? 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            fontWeight: '600',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                    >
                        <Zap size={18} />
                        Gerar Análise do Dia
                    </button>
                </div>
            )}

            {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }} className="fade-in">
                    <Activity className="spin" size={32} style={{ color: 'var(--primary-color)', marginBottom: '10px' }} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Analisando seus padrões comportamentais...
                    </p>
                    <style>{`
                        .spin { animation: spin 1s linear infinite; }
                        @keyframes spin { 100% { transform: rotate(360deg); } }
                    `}</style>
                </div>
            )}

            {advice && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Alinhamento Score */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isDebora ? 'rgba(236, 72, 153, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                        padding: '12px',
                        borderRadius: '12px'
                    }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Alinhamento com Sonho</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: '700', color: isDebora ? '#db2777' : '#4f46e5' }}>
                            {advice.alinhamentoSonho}%
                        </span>
                    </div>

                    {/* Analise */}
                    <div>
                        <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                            {advice.analiseComportamental}
                        </p>
                    </div>

                    {/* Warning / Pattern */}
                    {(advice.padraoDetectado || advice.alertaDisciplina) && (
                        <div style={{ display: 'flex', gap: '8px', background: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid #ef4444' }}>
                            <AlertTriangle size={20} color="#ef4444" style={{ minWidth: '20px' }} />
                            <div>
                                <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>Alerta de Padrão</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{advice.padraoDetectado || advice.alertaDisciplina}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Target size={16} color="var(--primary-color)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ajuste Imediato:</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '24px' }}>{advice.ajusteImediato}</p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <Lightbulb size={16} color="var(--primary-color)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Ação Mínima Amanhã:</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginLeft: '24px' }}>{advice.acaoMinimaAmanha}</p>
                    </div>

                    {/* Débora Specifics */}
                    {isDebora && advice.explicacaoNeurocientifica && (
                        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>🧠 Neurociência</h4>
                            <p style={{ fontSize: '0.85rem', color: '#475569', fontStyle: 'italic' }}>{advice.explicacaoNeurocientifica}</p>
                        </div>
                    )}

                    {isDebora && advice.visualizacaoGuiada && (
                        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '12px' }}>
                            <h4 style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: '600', marginBottom: '4px' }}>🌿 Visualização</h4>
                            <p style={{ fontSize: '0.85rem', color: '#166534', fontStyle: 'italic' }}>{advice.visualizacaoGuiada}</p>
                        </div>
                    )}

                    {/* Frase Final */}
                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
                        <p style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            fontStyle: 'italic',
                            color: isDebora ? '#db2777' : '#4f46e5'
                        }}>
                            "{advice.fraseMentor || advice.fraseProsperidade}"
                        </p>
                    </div>

                    <button
                        onClick={() => setAdvice(null)}
                        style={{ marginTop: '10px', width: '100%', padding: '8px', color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.7 }}
                    >
                        Nova Consulta
                    </button>
                </div>
            )}

            {error && (
                <div style={{ textAlign: 'center', color: '#ef4444', padding: '20px' }}>
                    <AlertTriangle size={32} style={{ marginBottom: '8px', margin: '0 auto' }} />
                    <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>{errorMsg}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button
                            onClick={handleConsultMentor}
                            style={{ background: '#ef4444', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '0.85rem' }}
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => setShowDebug(!showDebug)}
                            style={{ fontSize: '0.7rem', opacity: 0.6, color: 'var(--text-secondary)' }}
                        >
                            {showDebug ? "Ocultar Detalhes" : "Ver Detalhes Técnicos"}
                        </button>
                    </div>

                    {showDebug && (
                        <div style={{ marginTop: '16px', textAlign: 'left', fontSize: '0.7rem', padding: '10px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px', fontFamily: 'monospace' }}>
                            Referer: {window.location.origin}<br />
                            Config: VITE_OPENROUTER_API_KEY vinculada?<br />
                            Status: Verifique o console do navegador na Vercel.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MentorCard;
