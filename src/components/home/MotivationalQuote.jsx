import React, { useState, useEffect } from 'react';

const quotes = [
    "Foque no próximo passo, não na escada inteira.",
    "Você não precisa fazer tudo, apenas o suficiente.",
    "Pequenas ações mudam grandes futuros.",
    "Consistência vence motivação.",
    "Hoje você só precisa tentar.",
    "Você está construindo algo maior.",
    "Menos ansiedade, mais presença.",
    "Faça com calma, mas faça.",
    "Você é mais disciplinado do que pensa.",
    "Um passo já é progresso.",
    "Clareza traz paz.",
    "Respire. Continue.",
    "Organização reduz ruído mental.",
    "Seu foco é sua força.",
    "Simplifique.",
    "Você consegue.",
    "Energia vai para onde o foco vai.",
    "Priorize o que importa.",
    "Seu futuro agradece.",
    "Comece agora."
];

const MotivationalQuote = () => {
    const [quote, setQuote] = useState('');

    useEffect(() => {
        // Random quote on mount
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
    }, []);

    return (
        <div className="fade-in" style={{
            padding: '28px 0 10px 0',
            textAlign: 'left'
        }}>
            <h2 style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: 'var(--text-primary)',
                lineHeight: '1.2',
                letterSpacing: '-0.04em',
                marginBottom: '12px',
                backgroundImage: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
            }}>
                "{quote}"
            </h2>
            <div style={{
                height: '2px',
                width: '32px',
                backgroundColor: 'var(--primary-color)',
                borderRadius: '1px',
                opacity: 0.3
            }} />
        </div>
    );
};

export default MotivationalQuote;
