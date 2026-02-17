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
        content: "/assets/story/story1.jpg",
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
        content: "/assets/story/story2.jpg",
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
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef(null);
    const progressInterval = useRef(null);
    const nextCalled = useRef(false);

    // Initialize Audio
    useEffect(() => {
        // High quality ROMANTIC piano music (Gymnopedie No. 1 - Satie)
        // Direct reliable reliable URL from a stable source
        const audioUrl = "https://cdn.pixabay.com/download/audio/2022/03/10/audio_5b364177e0.mp3?filename=gymnopedie-no-1-erik-satie-6548.mp3";

        audioRef.current = new Audio(audioUrl);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6; // Slightly louder

        const startAudio = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().then(() => setIsMuted(false)).catch(e => console.log("Play failed", e));
            }
            window.removeEventListener('pointerdown', startAudio);
        };

        window.addEventListener('pointerdown', startAudio);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            window.removeEventListener('pointerdown', startAudio);
        };
    }, []);

    const toggleAudio = (e) => {
        if (e) e.stopPropagation();
        if (!audioRef.current) return;
        if (audioRef.current.paused) {
            audioRef.current.play();
            setIsMuted(false);
        } else {
            audioRef.current.pause();
            setIsMuted(true);
        }
    };

    // Robust Timer Logic
    useEffect(() => {
        setProgress(0);
        nextCalled.current = false;

        if (progressInterval.current) clearInterval(progressInterval.current);

        const duration = 7500;
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
            onClose();
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
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: currentSlide.type === 'image' ? '#000' : '#FFF',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: currentSlide.type === 'image' ? '#FFF' : '#000',
            fontFamily: "'Inter', sans-serif",
            overflow: 'hidden',
        }}>
            {/* Background for Image slides */}
            {currentSlide.type === 'image' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `url(${currentSlide.content})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(20px) brightness(0.6)',
                    opacity: 0.8,
                    zIndex: 0,
                }} />
            )}

            {/* Top Progress Bars */}
            <div style={{
                position: 'absolute',
                top: 'env(safe-area-inset-top, 20px)',
                left: '10px',
                right: '10px',
                display: 'flex',
                gap: '4px',
                zIndex: 40
            }}>
                {STORY_SLIDES.map((slide, index) => (
                    <div key={slide.id} style={{
                        flex: 1,
                        height: '2px',
                        backgroundColor: currentSlide.type === 'image' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: index < currentIndex ? '100%' : (index === currentIndex ? `${progress}%` : '0%'),
                            backgroundColor: currentSlide.type === 'image' ? '#FFF' : '#000',
                            transition: index === currentIndex ? 'width 0.05s linear' : 'none'
                        }} />
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{
                position: 'absolute',
                top: 'env(safe-area-inset-top, 40px)',
                right: '20px',
                zIndex: 30,
                display: 'flex',
                gap: '16px'
            }}>
                <button onClick={toggleAudio} style={{ background: 'none', border: 'none', color: currentSlide.type === 'image' ? '#FFF' : '#000', opacity: 0.6 }}>
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                </button>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: currentSlide.type === 'image' ? '#FFF' : '#000', opacity: 0.6 }}>
                    <X size={28} />
                </button>
            </div>

            {/* Audio Activation Prompt */}
            {isMuted && (
                <div style={{
                    position: 'absolute',
                    bottom: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 100,
                    backgroundColor: currentSlide.type === 'image' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    padding: '16px 24px',
                    borderRadius: '20px',
                    color: currentSlide.type === 'image' ? '#FFF' : '#000',
                }}>
                    <Volume2 size={32} />
                    <span style={{ fontWeight: '700', fontSize: '1rem', textAlign: 'center' }}>
                        Aumente o volume &<br />Toque para ouvir a música
                    </span>
                </div>
            )}

            {/* Tap Zones */}
            <div
                style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', zIndex: 50 }}
                onClick={handlePrev}
            />
            <div
                style={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '100%', zIndex: 50 }}
                onClick={handleNext}
            />

            {/* Content Overlay */}
            <div key={currentIndex} style={{
                position: 'relative',
                zIndex: 10,
                width: '100%',
                maxWidth: '420px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '40px 24px',
                textAlign: 'center',
                animation: 'slideUp 0.8s ease-out'
            }}>
                {currentSlide.type === 'text' && (
                    <>
                        <h2 style={{
                            fontSize: currentSlide.highlight ? '2.8rem' : '2.2rem',
                            lineHeight: '1.2',
                            marginBottom: '24px',
                            fontWeight: '800',
                            letterSpacing: '-0.04em',
                            whiteSpace: 'pre-line',
                            color: currentSlide.type === 'image' ? '#FFF' : '#000'
                        }}>
                            {currentSlide.content}
                        </h2>
                        {currentSlide.subtext && (
                            <p style={{
                                fontSize: '1.2rem',
                                color: currentSlide.type === 'image' ? '#DDD' : '#333',
                                fontWeight: '600',
                                maxWidth: '90%'
                            }}>
                                {currentSlide.subtext}
                            </p>
                        )}
                        {currentSlide.footer && (
                            <p style={{
                                position: 'absolute',
                                bottom: '60px',
                                fontSize: '0.9rem',
                                color: currentSlide.type === 'image' ? '#AAA' : '#666',
                                fontWeight: '700',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase'
                            }}>
                                {currentSlide.footer}
                            </p>
                        )}
                        {currentSlide.highlight && <Heart fill={currentSlide.type === 'image' ? '#FFF' : '#000'} size={48} style={{ marginTop: '40px' }} className="pulse" />}
                    </>
                )}

                {currentSlide.type === 'image' && (
                    <>
                        <div style={{
                            width: '92%',
                            aspectRatio: '4/5',
                            backgroundImage: `url(${currentSlide.content})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '24px',
                            marginBottom: '32px',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            border: '2px solid rgba(255,255,255,0.2)'
                        }} />
                        <p style={{
                            fontSize: '1.4rem',
                            fontWeight: '800',
                            lineHeight: '1.4',
                            maxWidth: '92%',
                            color: '#FFF',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                        }}>
                            {currentSlide.caption}
                        </p>
                        <Heart size={36} fill="#FFF" color="#FFF" style={{ marginTop: '24px' }} className="pulse" />
                    </>
                )}
            </div>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                    
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(60px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .pulse {
                        animation: pulse 2s infinite ease-in-out;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.9; }
                        50% { transform: scale(1.15); opacity: 1; }
                        100% { transform: scale(1); opacity: 0.9; }
                    }
                `}
            </style>
        </div>
    );
};

export default RomanticStory;
