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
        <div className="quote-container fade-in">
            <p className="quote-text">"{quote}"</p>
            <style>{`
                .quote-container {
                    padding: var(--spacing-lg);
                    background: linear-gradient(135deg, rgba(124, 92, 255, 0.05), transparent);
                    border-radius: var(--radius-lg);
                    border: 1px solid rgba(124, 92, 255, 0.1);
                    text-align: center;
                    margin-bottom: var(--spacing-md);
                }
                .quote-text {
                    font-size: var(--font-size-lg);
                    font-weight: 500;
                    font-style: italic;
                    color: var(--text-secondary);
                }
            `}</style>
        </div>
    );
};

export default MotivationalQuote;
