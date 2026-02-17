import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Heart } from 'lucide-react';

const STORY_SLIDES = [
    {
        id: 1,
        type: 'text',
        content: "Eu não fiz isso por acaso.",
        subtext: "Eu pensei em você em cada detalhe."
    },
    {
        id: 2,
        type: 'image',
        content: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2670&auto=format&fit=crop", // Placeholder couple/love image
        caption: "Algumas coisas na vida a gente sente antes de entender."
    },
    {
        id: 3,
        type: 'text',
        content: "Eu queria criar algo que fosse seu.\nUm espaço seguro.\nUm lugar leve.",
        subtext: "Porque o mundo já é pesado demais às vezes."
    },
    {
        id: 4,
        type: 'image',
        content: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=2574&auto=format&fit=crop", // Another placeholder
        caption: "Você me inspira mais do que imagina."
    },
    {
        id: 5,
        type: 'text',
        content: "Eu poderia ter feito só um app.",
        subtext: "Mas eu fiz pensando na gente."
    },
    {
        id: 6,
        type: 'text',
        content: "Eu te amo.",
        subtext: "",
        highlight: true
    },
    {
        id: 7,
        type: 'text',
        content: "Eu penso no nosso futuro todos os dias.",
        subtext: "E eu escolho você nele."
    },
    {
        id: 8,
        type: 'text',
        content: "Eu escolho você.",
        subtext: "Em cada detalhe. Até nesse.",
        footer: "Feito por Cássio ❤️"
    }
];

const RomanticStory = ({ onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);
    const progressInterval = useRef(null);
    const nextCalled = useRef(false); // Ref to prevent double calling handleNext

    // Initialize Audio
    useEffect(() => {
        // Piano Romantic Music (Archive.org)
        audioRef.current = new Audio('https://ia800401.us.archive.org/24/items/PianoRomanticMusic/Piano%20Romantic%20Music.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;

        const playAudio = async () => {
            try {
                await audioRef.current.play();
                setIsMuted(false);
            } catch (err) {
                console.log("Autoplay blocked, user interaction needed", err);
                setIsMuted(true);
            }
        };

        playAudio();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleAudio = () => {
        if (!audioRef.current) return;

        if (audioRef.current.paused) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(e => console.error(e));
        } else {
            audioRef.current.pause();
            setIsMuted(true);
        }
    };

    // Robust Timer Logic
    useEffect(() => {
        setProgress(0);
        nextCalled.current = false; // Reset flag for new slide

        if (progressInterval.current) clearInterval(progressInterval.current);

        const duration = 6000;
        const tick = 50;
        const step = 100 / (duration / tick);

        progressInterval.current = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    if (!nextCalled.current) {
                        nextCalled.current = true;
                        handleNext();
                    }
                    return 100;
                }
                return prev + step;
            });
        }, tick);

        // Haptics
        if (STORY_SLIDES[currentIndex].highlight && navigator.vibrate) {
            navigator.vibrate(20);
        }

        return () => clearInterval(progressInterval.current);
    }, [currentIndex]);

    const handleNext = () => {
        if (currentIndex < STORY_SLIDES.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose(); // Finish story
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const currentSlide = STORY_SLIDES[currentIndex];

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '480px', // Match app-container
            height: '100%',
            backgroundColor: '#0F1115',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)' // Add shadow to blend with app
        }}>
            {/* Top Progress Bars */}
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '10px',
                right: '10px',
                display: 'flex',
                gap: '4px',
                zIndex: 20
            }}>
                {STORY_SLIDES.map((slide, index) => (
                    <div key={slide.id} style={{
                        flex: 1,
                        height: '2px',
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: index < currentIndex ? '100%' : (index === currentIndex ? `${progress}%` : '0%'),
                            backgroundColor: 'white',
                            transition: index === currentIndex ? 'width 0.05s linear' : 'none'
                        }} />
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                top: '40px',
                right: '20px',
                zIndex: 20,
                display: 'flex',
                gap: '16px'
            }}>
                <button onClick={toggleAudio} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7 }}>
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', opacity: 0.7 }}>
                    <X size={24} />
                </button>
            </div>

            {/* Muted Overlay Hint */}
            {isMuted && currentIndex === 0 && (
                <div
                    onClick={toggleAudio}
                    style={{
                        position: 'absolute',
                        bottom: '100px',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        zIndex: 30,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <VolumeX size={16} />
                    <span style={{ fontSize: '0.8rem' }}>Toque para ativar o som</span>
                </div>
            )}

            {/* Tap Zones */}
            <div
                style={{ position: 'absolute', top: 0, left: 0, width: '40%', height: '100%', zIndex: 10 }}
                onClick={handlePrev}
            />
            <div
                style={{ position: 'absolute', top: 0, right: 0, width: '60%', height: '100%', zIndex: 10 }}
                onClick={handleNext}
            />

            {/* Content Content to render */}
            <div className="fade-in" key={currentIndex} style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '40px',
                position: 'relative',
                animation: 'fadeIn 0.8s ease'
            }}>
                {currentSlide.type === 'text' && (
                    <>
                        <h2 style={{
                            fontSize: currentSlide.highlight ? '2.5rem' : '1.8rem',
                            lineHeight: '1.4',
                            marginBottom: '20px',
                            fontWeight: '300',
                            whiteSpace: 'pre-line'
                        }}>
                            {currentSlide.content}
                        </h2>
                        {currentSlide.subtext && (
                            <p style={{
                                fontSize: '1rem',
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: '300'
                            }}>
                                {currentSlide.subtext}
                            </p>
                        )}
                        {currentSlide.footer && (
                            <p style={{
                                position: 'absolute',
                                bottom: '60px',
                                fontSize: '0.8rem',
                                color: 'rgba(255,255,255,0.5)',
                            }}>
                                {currentSlide.footer}
                            </p>
                        )}
                        {currentSlide.highlight && <Heart fill="white" size={32} style={{ marginTop: '30px' }} className="pulse" />}
                    </>
                )}

                {currentSlide.type === 'image' && (
                    <>
                        <div style={{
                            width: '100%',
                            height: '60%',
                            backgroundImage: `url(${currentSlide.content})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '16px',
                            marginBottom: '30px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
                        }} />
                        <p style={{ fontSize: '1.2rem', fontWeight: '300', fontStyle: 'italic' }}>
                            {currentSlide.caption}
                        </p>
                        <Heart size={20} fill="#ef4444" color="#ef4444" style={{ marginTop: '20px' }} />
                    </>
                )}
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .pulse {
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                        100% { transform: scale(1); }
                    }
                `}
            </style>
        </div>
    );
};

export default RomanticStory;
