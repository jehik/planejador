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
        // More reliable piano music link (Lofi/Chill Piano)
        audioRef.current = new Audio('https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_1MB_MP3.mp3'); // Temporary for testing connectivity, will look for a better one or use a known stable one
        // Better music choice for Pinterest/Tumblr vibe:
        audioRef.current.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Testing with standard mp3
        // Actually, let's use a soft piano one from a CD
        audioRef.current.src = 'https://ia800401.us.archive.org/24/items/PianoRomanticMusic/Piano%20Romantic%20Music.mp3';

        audioRef.current.loop = true;
        audioRef.current.volume = 0.4;

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
            audioRef.current.play().catch(e => console.log("Play blocked", e));
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
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#000',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: "'Playfair Display', serif",
            overflow: 'hidden',
        }}>
            {/* Background Blur Aesthetic */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: currentSlide.type === 'image' ? `url(${currentSlide.content})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(30px) brightness(0.4)',
                opacity: 0.6,
                zIndex: 0,
                transition: 'all 1s ease'
            }} />

            {/* Top Progress Bars */}
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
                maxWidth: '500px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '40px',
                position: 'relative',
                zIndex: 1,
                animation: 'slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
            }}>
                {currentSlide.type === 'text' && (
                    <>
                        <h2 style={{
                            fontSize: currentSlide.highlight ? '2.8rem' : '2rem',
                            lineHeight: '1.3',
                            marginBottom: '20px',
                            fontWeight: '400',
                            letterSpacing: '-0.02em',
                            whiteSpace: 'pre-line',
                            fontFamily: "'Playfair Display', serif"
                        }}>
                            {currentSlide.content}
                        </h2>
                        {currentSlide.subtext && (
                            <p style={{
                                fontSize: '1.1rem',
                                color: 'rgba(255,255,255,0.8)',
                                fontWeight: '300',
                                fontStyle: 'italic',
                                maxWidth: '80%'
                            }}>
                                {currentSlide.subtext}
                            </p>
                        )}
                        {currentSlide.footer && (
                            <p style={{
                                position: 'absolute',
                                bottom: '60px',
                                fontSize: '0.9rem',
                                color: 'rgba(255,255,255,0.6)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase'
                            }}>
                                {currentSlide.footer}
                            </p>
                        )}
                        {currentSlide.highlight && <Heart fill="white" size={40} style={{ marginTop: '40px' }} className="pulse" />}
                    </>
                )}

                {currentSlide.type === 'image' && (
                    <>
                        <div style={{
                            width: '90%',
                            aspectRatio: '4/5',
                            backgroundImage: `url(${currentSlide.content})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '12px',
                            marginBottom: '32px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }} />
                        <p style={{
                            fontSize: '1.4rem',
                            fontWeight: '400',
                            fontStyle: 'italic',
                            lineHeight: '1.4',
                            maxWidth: '90%',
                            fontFamily: "'Playfair Display', serif"
                        }}>
                            {currentSlide.caption}
                        </p>
                        <Heart size={24} fill="#ff4d4d" color="#ff4d4d" style={{ marginTop: '24px' }} className="pulse" />
                    </>
                )}
            </div>

            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
                    
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); filter: blur(10px); }
                        to { opacity: 1; transform: translateY(0); filter: blur(0); }
                    }
                    .pulse {
                        animation: pulse 2.5s infinite ease-in-out;
                    }
                    @keyframes pulse {
                        0% { transform: scale(1); opacity: 0.8; }
                        50% { transform: scale(1.1); opacity: 1; }
                        100% { transform: scale(1); opacity: 0.8; }
                    }
                `}
            </style>
        </div>
    );
};

export default RomanticStory;
