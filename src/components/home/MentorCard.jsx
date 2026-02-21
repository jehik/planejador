import React, { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';
import { fetchMentorAdvice } from '../../services/mentorService';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';

const neuroMessages = [
    "Seu cérebro não distingue realidade de imaginação vívida. Visualize agora com detalhes.",
    "A neuroplasticidade permite que você mude sua mente a qualquer instante através do foco.",
    "O foco libera dopamina, o combustível natural da sua motivação e clareza mental.",
    "Visualizar o sucesso treina seus neurônios para identificar oportunidades ocultas.",
    "Repetição de pensamentos de abundância cria trilhas neurais que se tornam automáticas.",
    "O córtex pré-frontal precisa de silêncio e presença para gerar soluções criativas.",
    "Ensaiar mentalmente uma ação ativa as mesmas áreas motoras do cérebro que a prática real.",
    "A gratidão regula o cortisol e ativa o sistema de recompensa cerebral em segundos.",
    "Sua mente foca naquilo que você dá atenção. Escolha focar na sua evolução hoje.",
    "A visualização matinal prepara seu Sistema de Ativação Reticular para o sucesso.",
    "Neurônios que disparam juntos, permanecem juntos. Conecte esforço a prazer.",
    "A meditação aumenta a espessura da matéria cinzenta ligada ao controle emocional.",
    "O cérebro gasta 20% da sua energia. Use-a para visualizar sua melhor versão.",
    "Respirar conscientemente envia um sinal de segurança para as amígdalas cerebrais.",
    "Seu subconsciente é programado por imagens. Alimente-o com visões de prosperidade.",
    "O estado de 'Flow' é onde seu cérebro atinge a máxima harmonia neurofisiológica.",
    "Pequenos sucessos liberam micro-doses de dopamina, criando um ciclo de vitória.",
    "A visualização com emoção é a linguagem que seu cérebro entende mais rápido.",
    "O silêncio permite que a rede de modo padrão (DMN) processe aprendizados profundos.",
    "Você tem o poder de remodelar seu cérebro através de escolhas conscientes diárias.",
    "Aprender algo novo cria novas sinapses, mantendo o cérebro jovem e plástico.",
    "O sono é essencial para a consolidação da memória e limpeza de toxinas neurais.",
    "Sorrir libera endorfinas e reduz o estresse, mesmo que feito conscientemente.",
    "O contato com a natureza reduz significativamente a atividade na amígdala cerebral.",
    "Beber água melhora a condução elétrica entre os neurônios e a clareza mental.",
    "Fazer uma coisa de cada vez aumenta a eficiência do seu processamento neural.",
    "Escrever à mão ativa áreas cerebrais ligadas ao aprendizado profundo e foco.",
    "A curiosidade ativa o sistema de recompensa, facilitando a memorização de novos dados.",
    "O otimismo treina o cérebro para buscar soluções em vez de focar apenas em problemas.",
    "Ouvir música harmônica reduz a ansiedade e sincroniza os hemisférios cerebrais.",
    "Exercício físico aumenta o BDNF, a proteína que estimula o crescimento de novos neurônios.",
    "A autocompaixão desativa a resposta de luta ou fuga, permitindo raciocínio claro.",
    "O jejum intermitente pode estimular a regeneração e proteção das células neurais.",
    "Ler livros complexos expande a conectividade do seu córtex temporal e imaginação.",
    "O convívio social saudável libera ocitocina, reduzindo o medo e aumentando a confiança.",
    "Desafiar crenças limitantes enfraquece conexões neurais obsoletas e abre espaço para o novo.",
    "A organização externa reflete e auxilia na sua clareza sináptica e redução de ruído.",
    "O foco sustentado por apenas 20 minutos muda seu estado de consciência e produtividade.",
    "Visualize os obstáculos e sua superação; isso fortalece seu córtex cingulado anterior.",
    "A vitamina D age como um neuroesteroide essencial para a regulação do seu humor.",
    "Gorduras saudáveis são o combustível da bainha de mielina, acelerando seus pensamentos.",
    "Rir reduz a carga cognitiva e melhora sua flexibilidade diante de imprevistos.",
    "O seu cérebro aprende e retém muito melhor através de metáforas e histórias visuais.",
    "A luz solar matinal regula seu ritmo circadiano, otimizando o foco durante todo o dia.",
    "A paciência dá tempo para que os lobos frontais dominem seus instintos impulsivos.",
    "Falar consigo mesma de forma positiva e gentil reprograma seu diálogo interno central.",
    "O erro é o sinal químico que o cérebro usa para iniciar as mudanças na fiação neural.",
    "A técnica de respiração 4-7-8 hackeia seu sistema nervoso para a calma instantânea.",
    "Sua percepção subjetiva de tempo é moldada diretamente pelo seu nível de dopamina.",
    "O cérebro é um órgão de antecipação. Comece agora a antecipar o seu grande sucesso!"
];

const prosperityPhrases = [
    "Sintonize sua mente com a abundância.",
    "A prosperidade flui para onde há ordem, paz e foco total.",
    "Você merece toda a abundância que o universo reserva para você.",
    "Sua mente é um ímã poderoso para oportunidades prósperas.",
    "Cada ação consciente hoje planta uma semente de riqueza futura.",
    "A verdadeira abundância começa com uma mentalidade profunda de gratidão.",
    "O seu sucesso é o resultado natural e inevitável da sua consistência.",
    "Viva em um estado constante de fluxo, merecimento e prosperidade.",
    "Sua visão clara de futuro atrai magneticamente os recursos necessários.",
    "Sinta paz, segurança e confiança no seu caminho de abundância.",
    "A riqueza mental absoluta precede qualquer conquista material sólida.",
    "Seja grata por todas as bençãos e vitórias que você já conquistou.",
    "O universo é ilimitado e você é parte integrante desta fonte infinita.",
    "Escolha apenas pensamentos que elevam sua vibração e prosperidade.",
    "Sua realidade atual é apenas o ponto de partida para algo grandioso.",
    "A prosperidade é o estado natural e original do seu ser.",
    "Aceite com amor a abundância em todas as áreas da sua vida.",
    "O seu potencial para o sucesso e felicidade é verdadeiramente infinito.",
    "Siga sua intuição divina rumo a uma vida extraordinária e plena.",
    "A abundância te permite servir melhor e transbordar na vida dos outros."
];

const MentorCard = () => {
    const { currentUser, userData, tasks } = useAppStore();
    const [advice, setAdvice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chatQuestion, setChatQuestion] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    // States para mensagens randômicas com timer
    const [neuroIdx, setNeuroIdx] = useState(Math.floor(Math.random() * neuroMessages.length));
    const [prosIdx, setProsIdx] = useState(Math.floor(Math.random() * prosperityPhrases.length));

    const userName = currentUser?.email?.includes('debora') ? 'debora' : 'cassio';
    const accentColor = userName === 'cassio' ? '#4F46E5' : '#EC4899';

    // Timer para trocar as mensagens a cada 1 minuto
    useEffect(() => {
        const interval = setInterval(() => {
            setNeuroIdx(Math.floor(Math.random() * neuroMessages.length));
            setProsIdx(Math.floor(Math.random() * prosperityPhrases.length));
        }, 60000); // 60 segundos

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const getAdvice = async () => {
            if (!userData) return;
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
    }, [userName, userData?.finance?.income, userData?.finance?.expenses, tasks.length]);

    const handleChatSubmit = async (e) => {
        e.preventDefault();
        if (!chatQuestion.trim() || chatLoading) return;

        setChatLoading(true);
        try {
            const data = await fetchMentorAdvice(userName, chatQuestion);
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
        <div className="card mentor-card-container fade-in" style={{
            padding: '24px',
            background: `linear-gradient(135deg, var(--surface-color) 0%, ${accentColor}08 100%)`,
            border: `1px solid ${accentColor}20`,
            position: 'relative',
            overflow: 'hidden',
            isolation: 'isolate' // Garante que filtros e bleeds não vazem
        }}>
            {/* Apple Intelligence Glow Effect */}
            <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`, filter: 'blur(40px)', zIndex: 0 }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0, boxShadow: `0 8px 16px ${accentColor}30` }}>
                        <Sparkles size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '900', letterSpacing: '-0.03em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Psicólogo AI</h3>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '1.2' }}>Desenvolvido por: Cássio M</p>
                    </div>
                </div>


                {/* Chat Response Area */}
                <div className="fade-in" style={{
                    backgroundColor: advice.chatResponse ? `${accentColor}10` : 'rgba(0,0,0,0.02)',
                    padding: '16px',
                    borderRadius: '16px',
                    border: advice.chatResponse ? `1px solid ${accentColor}20` : '1px dashed var(--border-color)',
                    marginBottom: '20px',
                    animation: 'slideUp 0.4s ease-out',
                    minHeight: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    {advice.chatResponse ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: accentColor }}></div>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: accentColor, textTransform: 'uppercase' }}>Resposta do Mentor</span>
                            </div>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                                {advice.chatResponse}
                            </p>
                        </>
                    ) : (
                        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-tertiary)', lineHeight: '1.4', textAlign: 'center', fontStyle: 'italic' }}>
                            Fale com o Psicólogo AI, ele te responderá nesse campo...
                        </p>
                    )}
                </div>

                {/* Grid for details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userName === 'debora' && (
                        <div style={{ backgroundColor: `${accentColor}05`, padding: '16px', borderRadius: '16px', border: `1px solid ${accentColor}10` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <Sparkles size={14} style={{ color: accentColor }} />
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: accentColor, textTransform: 'uppercase' }}>Neurociência & Visualização</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: '1.3' }}>
                                {advice.explicacaoNeurocientifica || neuroMessages[neuroIdx]}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '8px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                                    {advice.fraseProsperidade || prosperityPhrases[prosIdx]}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Chat Input Section */}
                <div style={{ marginTop: '20px' }}>
                    <form onSubmit={handleChatSubmit} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        padding: '6px 6px 6px 16px',
                        borderRadius: '20px',
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
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                minWidth: 0 // Importante para flexbox não quebrar
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!chatQuestion.trim() || chatLoading}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: chatQuestion.trim() ? accentColor : 'rgba(0,0,0,0.05)',
                                color: 'white',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: chatQuestion.trim() ? 'pointer' : 'default',
                                transition: 'all 0.3s',
                                flexShrink: 0
                            }}
                        >
                            {chatLoading ? <Loader2 size={16} className="spin" /> : <ArrowRight size={18} />}
                        </button>
                    </form>
                </div>

                {/* Dream Alignment Footer */}
                <div style={{ marginTop: '24px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '32px', height: '6px', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                            <div style={{ width: `${advice.alinhamentoSonho || 0}%`, height: '100%', backgroundColor: accentColor, borderRadius: '4px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Alinhamento com Sonho</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '900', color: accentColor, marginLeft: '8px' }}>{advice.alinhamentoSonho || 0}%</span>
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
