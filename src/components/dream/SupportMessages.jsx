import React, { useState, useEffect } from 'react';

const messages = [
    "Você é capaz de coisas incríveis.",
    "Pequeno progresso ainda é progresso.",
    "Concentre-se no que você pode controlar.",
    "Respire. Você consegue.",
    "Construa seu futuro, um passo de cada vez."
];

const SupportMessages = () => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // Start fade out
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % messages.length);
                setFade(true); // Fade in new message
            }, 500); // Wait for fade out to finish
        }, 6000); // Change every 6 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-lg)',
            minHeight: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <p style={{
                fontSize: 'var(--font-size-lg)',
                color: 'var(--text-secondary)',
                fontWeight: 'var(--font-weight-medium)',
                opacity: fade ? 1 : 0,
                transform: fade ? 'translateY(0)' : 'translateY(5px)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
                fontStyle: 'italic'
            }}>
                "{messages[index]}"
            </p>
        </div>
    );
};

export default SupportMessages;
