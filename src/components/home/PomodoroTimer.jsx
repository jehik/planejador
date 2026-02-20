import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCCW, Volume2, VolumeX } from 'lucide-react';

const PomodoroTimer = () => {
    const [selectedTime, setSelectedTime] = useState(25); // Minutes
    const DEFAULT_TIME = selectedTime * 60;
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
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

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Circular Progress
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / (selectedTime * 60);
    const dashoffset = circumference * (1 - progress);

    return (
        <div className="pomodoro-card card">
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '16px', letterSpacing: '1px' }}>
                FOCO TOTAL
            </h3>

            <div className="timer-circle">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--surface-hover)" strokeWidth="8" />
                    <circle
                        cx="100" cy="100" r={radius} fill="none" stroke="var(--primary-color)" strokeWidth="8"
                        strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="time-display">{formatTime(timeLeft)}</div>
            </div>

            <div className="controls">
                <button onClick={resetTimer} className="control-btn secondary" title="Recomeçar">
                    <RotateCCW size={20} />
                </button>
                <button onClick={toggleTimer} className="control-btn main">
                    {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>

                {/* Time Selector Dropdown/Buttons substitute */}
                <div className="time-selector">
                    {[25, 45, 60].map(min => (
                        <button
                            key={min}
                            onClick={() => !isActive && setSelectedTime(min)}
                            className={`time-btn ${selectedTime === min ? 'active' : ''}`}
                            disabled={isActive}
                        >
                            {min}
                        </button>
                    ))}
                </div>
            </div>

            <style>{`
                .time-selector {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .time-btn {
                    border: none;
                    background: none;
                    font-size: 0.8rem;
                    color: var(--text-tertiary);
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .time-btn.active {
                    color: var(--primary-color);
                    background: var(--surface-hover);
                    font-weight: 700;
                }
            `}</style>

            <style>{`
                .pomodoro-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .timer-circle {
                    position: relative;
                    width: 200px;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .time-display {
                    position: absolute;
                    font-size: 3rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    font-variant-numeric: tabular-nums;
                }
                .controls {
                    margin-top: var(--spacing-lg);
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                }
                .control-btn {
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                    color: var(--text-primary);
                    background: var(--surface-hover);
                }
                .control-btn:hover {
                    transform: scale(1.1);
                    background: var(--primary-soft);
                    color: var(--primary-color);
                }
                .control-btn.main {
                    width: 64px;
                    height: 64px;
                    background: var(--primary-color);
                    color: white;
                    box-shadow: 0 4px 15px var(--primary-glow);
                }
                .control-btn.main:hover {
                    background: var(--primary-color); /* Keep primary */
                    box-shadow: 0 0 25px var(--primary-glow);
                }
                .control-btn.secondary {
                    width: 48px;
                    height: 48px;
                }
            `}</style>
        </div>
    );
};

export default PomodoroTimer;
