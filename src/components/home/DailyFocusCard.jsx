import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, CheckCircle, Clock } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const DailyFocusCard = () => {
    const {
        toggleTask,
        focusMode,
        toggleFocusMode,
        userData,
        addPoints
    } = useAppStore();

    const tasks = userData?.tasks || [];

    // Get first uncompleted task for today
    const today = new Date().toISOString().split('T')[0];
    const todaysTasks = tasks.filter(t => t.date === today);
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
    }, [focusMode]);

    return (
        <div className="fade-in" style={{
            backgroundColor: 'var(--surface-color)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-md)',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.5s ease',
            // Enphasize in Focus Mode
            transform: focusMode ? 'scale(1.02)' : 'scale(1)',
            zIndex: focusMode ? 50 : 1
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{
                    fontSize: 'var(--font-size-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: mode === 'break' ? 'var(--success-color)' : 'var(--primary-color)',
                    fontWeight: 'var(--font-weight-bold)'
                }}>
                    {mode === 'break' ? 'Pausa Restauradora' : 'Foco Diário'}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {activeTask.completed && <CheckCircle size={20} color="var(--success-color)" />}
                </div>
            </div>

            <div style={{ margin: 'var(--spacing-sm) 0', textAlign: 'center' }}>

                {/* Timer Display */}
                <div style={{
                    fontSize: '3.5rem',
                    fontWeight: 'bold',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'var(--text-primary)',
                    marginBottom: '16px',
                    letterSpacing: '-2px'
                }}>
                    {formatTime(timeLeft)}
                </div>

                {/* Task Title */}
                <h2 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: activeTask.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: activeTask.completed ? 'line-through' : 'none',
                    marginBottom: 'var(--spacing-xs)'
                }}>
                    {activeTask.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    {mode === 'break' ? 'Respire fundo e relaxe.' : (activeTask.completed ? 'Tudo pronto por hoje!' : 'Foco total nesta tarefa.')}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={toggleTimer}
                    style={{
                        backgroundColor: isActive ? 'var(--surface-color)' : 'var(--primary-color)',
                        color: isActive ? 'var(--text-primary)' : '#fff',
                        border: isActive ? '1px solid var(--border-color)' : 'none',
                        padding: '12px 24px',
                        borderRadius: 'var(--radius-full)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-medium)',
                        flex: 1,
                        boxShadow: isActive ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)',
                        transition: 'all 0.2s'
                    }}
                >
                    {isActive ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                    {isActive ? 'Pausar' : (timeLeft < (mode === 'focus' ? 600 : 300) ? 'Retomar' : (mode === 'break' ? 'Iniciar Pausa' : 'Iniciar Foco'))}
                </button>

                {(isActive || timeLeft < (mode === 'focus' ? 600 : 300)) && (
                    <button
                        onClick={resetTimer}
                        aria-label="Parar"
                        style={{
                            backgroundColor: 'var(--surface-color)',
                            color: 'var(--danger-color)',
                            border: '1px solid var(--border-color)',
                            width: '48px',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Square size={18} fill="currentColor" />
                    </button>
                )}
            </div>

            {/* Simple visual cue for focus mode */}
            {focusMode && (
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: 'var(--primary-color)' }}>
                    <Clock size={14} className="spin-slow" />
                    <span style={{ fontSize: '12px', fontWeight: '600' }}>MODO FOCO ATIVO</span>
                </div>
            )}
        </div>
    );
};

export default DailyFocusCard;
