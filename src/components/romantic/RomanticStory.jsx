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
        // High quality stable romantic piano music (Direct Link)
        const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"; // Stable testing link
        const realRomantic = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Kosta_T/Soft_Piano_and_Violin/Kosta_T_-_01_-_Soft_Piano_and_Violin.mp3";

        audioRef.current = new Audio(realRomantic);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        // Handle browser autoplay policy: play as soon as user interacts
        const handleInteraction = () => {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().then(() => setIsMuted(false)).catch(e => console.log("Still blocked", e));
            }
            window.removeEventListener('click', handleInteraction);
        };
        window.addEventListener('click', handleInteraction);

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            window.removeEventListener('click', handleInteraction);
        };
    }, []);

    const toggleAudio = () => {
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
        nextCalled.current = false; // Reset flag for new slide

        if (progressInterval.current) clearInterval(progressInterval.current);

        const duration = 7000; // Slightly slower for readability
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
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#FFFFFF', // Clean White Background
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#000000', // Black Typography
            fontFamily: "'Outfit', sans-serif", // Clean Modern Sans-Serif
            overflow: 'hidden',
        }}>
            {/* Background Image Aesthetic (Optional, soft overlay if image slide) */}
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
                    filter: 'blur(40px) brightness(1.2)',
                    opacity: 0.15,
                    zIndex: 0,
                }} />
            )}

            {/* Top Progress Bars - Dark version for white background */}
            <div style={{
                position: 'absolute',
                top: 'env(safe-area-inset-top, 20px)',
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
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: index < currentIndex ? '100%' : (index === currentIndex ? `${progress}%` : '0%'),
                            backgroundColor: '#000000',
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
                <button onClick={toggleAudio} style={{ background: 'none', border: 'none', color: '#000', opacity: 0.5 }}>
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                </button>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#000', opacity: 0.5 }}>
                    <X size={26} />
                </button>
            </div>

            {/* Initial Interaction Prompt for Audio */}
            {isMuted && currentIndex === 0 && (
                <div style={{
                    position: 'absolute',
                    bottom: '100px',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '30px',
                    zIndex: 40,
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'pulse 2s infinite'
                }}>
                    <Volume2 size={18} />
                    Toque na tela para ouvir a música ❤️
                </div>
            )}

            {/* Tap Zones */}
            <div
                style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', zIndex: 10 }}
                onClick={handlePrev}
            />
            <div
                style={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '100%', zIndex: 10 }}
                onClick={handleNext}
            />

            {/* Content Area */}
            <div className="fade-in" key={currentIndex} style={{
                width: '100%',
                maxWidth: '420px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '40px',
                position: 'relative',
                zIndex: 1,
                animation: 'slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}>
                {currentSlide.type === 'text' && (
                    <>
                        <h2 style={{
                            fontSize: currentSlide.highlight ? '2.6rem' : '2rem',
                            lineHeight: '1.2',
                            marginBottom: '20px',
                            fontWeight: '800', // Extra Bold for Maximum Legibility
                            letterSpacing: '-0.04em',
                            whiteSpace: 'pre-line',
                            color: '#000000'
                        }}>
                            {currentSlide.content}
                        </h2>
                        {currentSlide.subtext && (
                            <p style={{
                                fontSize: '1.1rem',
                                color: '#333333',
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
                                color: '#666666',
                                fontWeight: '700',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase'
                            }}>
                                {currentSlide.footer}
                            </p>
                        )}
                        {currentSlide.highlight && <Heart fill="#000" size={48} style={{ marginTop: '40px' }} className="pulse" />}
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
                            borderRadius: '20px',
                            marginBottom: '32px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                            border: '1px solid rgba(0,0,0,0.1)'
                        }} />
                        <p style={{
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            lineHeight: '1.4',
                            maxWidth: '90%',
                            color: '#000'
                        }}>
                            {currentSlide.caption}
                        </p>
                        <Heart size={30} fill="#000" color="#000" style={{ marginTop: '24px' }} className="pulse" />
                    </>
                )}
            </div>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
                    
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(40px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .pulse {
                        animation: pulse 2s infinite ease-in-out;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.9; }
                        50% { transform: scale(1.1); opacity: 1; }
                        100% { transform: scale(1); opacity: 0.9; }
                    }
                `}
            </style>
        </div>
    );
};

export default RomanticStory;
