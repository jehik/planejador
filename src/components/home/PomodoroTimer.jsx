import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const PomodoroTimer = () => {
    const [selectedTime, setSelectedTime] = useState(25); // Minutes
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Update timeLeft when selectedTime changes (if not active)
    useEffect(() => {
        if (!isActive) {
            setTimeLeft(selectedTime * 60);
        }
    }, [selectedTime, isActive]);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(selectedTime * 60);
    };

    // Circular Progress
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / (selectedTime * 60);
    const dashoffset = circumference * (1 - progress);

    return (
        <div className="card" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            borderColor: 'rgba(0,0,0,0.03)',
            background: 'linear-gradient(145deg, var(--surface-color), #FFFFFF)',
            width: '100%'
        }}>
            <div style={{
                fontSize: '0.7rem',
                fontWeight: '900',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.1em',
                marginBottom: '24px',
                textTransform: 'uppercase'
            }}>
                Sessão de Foco
            </div>

            <div style={{
                position: 'relative',
                width: '210px',
                height: '210px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px'
            }}>
                <svg width="210" height="210" viewBox="0 0 210 210">
                    <circle cx="105" cy="105" r={radius} fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="10" />
                    <circle
                        cx="105" cy="105" r={radius} fill="none" stroke="var(--primary-color)" strokeWidth="10"
                        strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round"
                        transform="rotate(-90 105 105)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    fontSize: '3.5rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    fontVariantNumeric: 'tabular-nums',
                    letterSpacing: '-0.05em'
                }}>
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                width: '100%',
                justifyContent: 'center'
            }}>
                <button
                    onClick={resetTimer}
                    style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0,0,0,0.03)',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <RotateCcw size={22} strokeWidth={2.5} />
                </button>

                <button
                    onClick={toggleTimer}
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isActive ? 'var(--surface-hover)' : 'var(--primary-color)',
                        border: 'none',
                        color: isActive ? 'var(--primary-color)' : 'white',
                        cursor: 'pointer',
                        boxShadow: isActive ? 'none' : '0 15px 30px rgba(0, 122, 255, 0.25)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        transform: isActive ? 'scale(0.95)' : 'scale(1)'
                    }}
                >
                    {isActive ? <Pause size={32} strokeWidth={2.5} /> : <Play size={32} fill="currentColor" />}
                </button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[10, 25, 45, 60].map(min => (
                        <button
                            key={min}
                            onClick={() => !isActive && setSelectedTime(min)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                fontSize: '0.8rem',
                                color: selectedTime === min ? 'var(--primary-color)' : 'var(--text-tertiary)',
                                fontWeight: selectedTime === min ? '800' : '600',
                                cursor: 'pointer',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: selectedTime === min ? 'rgba(0, 122, 255, 0.08)' : 'transparent',
                                transition: 'all 0.2s'
                            }}
                            disabled={isActive}
                        >
                            {min}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PomodoroTimer;
