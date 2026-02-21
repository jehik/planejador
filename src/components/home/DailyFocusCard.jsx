import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle, Clock } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const DailyFocusCard = () => {
    const {
        toggleTask,
        focusMode,
        toggleFocusMode,
        userData,
        tasks,
        addPoints
    } = useAppStore();

    // Get first uncompleted task for today
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const todaysTasks = tasks.filter(t => {
        if (!t.scheduledAt) return false;
        const d = t.scheduledAt.toDate ? t.scheduledAt.toDate() : new Date(t.scheduledAt);
        const taskYMD = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return taskYMD === today;
    });
    const activeTask = todaysTasks.find(t => !t.completed) || todaysTasks[0] || { title: 'Definir meta para hoje', completed: false, id: null };

    // Timer State
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' | 'break'
    const [cycles, setCycles] = useState(0);

    // Timer Logic
    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        if (mode === 'focus') {
            addPoints(10); // Reward for focus
            const newCycles = cycles + 1;
            setCycles(newCycles);

            // Notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification("Foco concluído!", { body: "Hora de uma pausa de 5 minutos." });
            } else {
                alert("Parabéns! Você concluiu 10 minutos de foco. +10 pontos!");
            }

            // Start Break
            setMode('break');
            setTimeLeft(5 * 60); // 5 min break

            // Suggest long break after 3 cycles (logic could be expanded)
            if (newCycles % 3 === 0) {
                alert("Você completou 3 ciclos! Considere uma pausa maior de 15 minutos.");
            }

            setIsActive(true); // Auto-start break? User request says "Iniciar pausa automática"
        } else {
            // Break over
            alert("Pausa finalizada. Pronto para voltar ao foco?");
            setMode('focus');
            setTimeLeft(10 * 60);
            setIsActive(false); // Wait for user to start focus again
        }
    };

    const toggleTimer = () => {
        if (!isActive && !focusMode) {
            toggleFocusMode(); // Auto-enter focus mode on start
        }
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(10 * 60);
        setMode('focus');
        if (focusMode) toggleFocusMode(); // Exit focus mode on reset
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Exit focus mode handler to pause timer
    useEffect(() => {
        if (!focusMode && isActive && mode === 'focus') {
            setIsActive(false);
        }
    }, [focusMode, isActive, mode]);

    return (
        <div className="fade-in" style={{
            backgroundColor: 'var(--surface-color)',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            border: '1px solid rgba(0,0,0,0.03)',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: focusMode ? '0 20px 40px rgba(0,0,0,0.08)' : 'none',
            transform: focusMode ? 'scale(1.01)' : 'scale(1)',
            zIndex: focusMode ? 50 : 1
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: mode === 'break' ? 'var(--success-color)' : 'var(--primary-color)' }} />
                    <h3 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: mode === 'break' ? 'var(--success-color)' : 'var(--primary-color)',
                        fontWeight: '800'
                    }}>
                        {mode === 'break' ? 'Pausa' : 'Tempo de Foco'}
                    </h3>
                </div>
                {activeTask.completed && <CheckCircle size={20} color="var(--success-color)" strokeWidth={2.5} />}
            </div>

            <div style={{ textAlign: 'center', margin: '10px 0' }}>
                {/* Timer Display */}
                <div style={{
                    fontSize: '4rem',
                    fontWeight: '800',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.04em',
                    lineHeight: '1',
                    marginBottom: '16px'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {/* Task Title */}
                <h2 style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: activeTask.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: activeTask.completed ? 'line-through' : 'none',
                    marginBottom: '4px',
                    letterSpacing: '-0.02em'
                }}>
                    {activeTask.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500', opacity: 0.7 }}>
                    {mode === 'break' ? 'Respire fundo.' : (activeTask.completed ? 'Excelente trabalho!' : 'Concentração máxima.')}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button
                    onClick={toggleTimer}
                    style={{
                        backgroundColor: isActive ? 'var(--surface-hover)' : 'var(--primary-color)',
                        color: isActive ? 'var(--text-primary)' : '#fff',
                        padding: '14px 28px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        flex: 1,
                        border: 'none',
                        boxShadow: isActive ? 'none' : '0 10px 20px rgba(0, 122, 255, 0.2)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer'
                    }}
                >
                    {isActive ? <Pause size={20} strokeWidth={2.5} /> : <Play size={20} fill="currentColor" />}
                    <span>{isActive ? 'Pausar' : (timeLeft < (mode === 'focus' ? 600 : 300) ? 'Retomar' : (mode === 'break' ? 'Começar' : 'Focar'))}</span>
                </button>

                {(isActive || timeLeft < (mode === 'focus' ? 600 : 300)) && (
                    <button
                        onClick={resetTimer}
                        style={{
                            backgroundColor: 'rgba(255, 59, 48, 0.1)',
                            color: 'var(--danger-color)',
                            width: '56px',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Square size={20} fill="currentColor" />
                    </button>
                )}
            </div>

            {/* Focus Mode Visual Cue */}
            {focusMode && (
                <div style={{
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--primary-color)',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    letterSpacing: '0.05em'
                }}>
                    <Clock size={12} strokeWidth={3} />
                    <span>MODO FOCO ATIVO</span>
                </div>
            )}
        </div>
    );
};

export default DailyFocusCard;
