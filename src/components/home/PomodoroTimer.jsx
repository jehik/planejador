import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCCW, Volume2, VolumeX } from 'lucide-react';

const PomodoroTimer = () => {
    const DEFAULT_TIME = 10 * 60; // 10 minutes in seconds
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(true); // Default muted as per prompt

    // Audio ref (using a simple white noise placeholder or just beep)
    // Prompt asks for "Ícone de White Noise (som ambiente opcional)"
    // For now, let's just simulate the control.

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (!isMuted && navigator.vibrate) {
                navigator.vibrate([200, 100, 200]); // Vibrate
            }
            // Optional: Play sound here
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft, isMuted]);

    const toggleTimer = () => setIsActive(!isActive);
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(DEFAULT_TIME);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Circular Progress Calculation
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / DEFAULT_TIME;
    const dashoffset = circumference * (1 - progress);

    return (
        <div className="pomodoro-card card">
            <div className="timer-circle">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Background Circle */}
                    <circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke="var(--surface-hover)"
                        strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="100" cy="100" r={radius}
                        fill="none"
                        stroke="var(--primary-color)"
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>
                <div className="time-display">
                    {formatTime(timeLeft)}
                </div>
            </div>

            <div className="controls">
                <button onClick={toggleTimer} className="control-btn main">
                    {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button onClick={resetTimer} className="control-btn secondary">
                    <RotateCCW size={20} />
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="control-btn secondary">
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            </div>

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
