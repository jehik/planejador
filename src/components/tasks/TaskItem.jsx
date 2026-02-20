import React from 'react';
import { CheckCircle, Circle, Trash2, Clock, Calendar } from 'lucide-react';
import { classifyTask, getPeriodColor } from '../../utils/timeUtils';
import useAppStore from '../../store/useAppStore';

const TaskItem = ({ task, showCategory = false }) => {
    const { toggleTask, deleteTask } = useAppStore();
    const status = classifyTask(task);
    const periodColor = getPeriodColor(status);

    // Format Date/Time
    const dateObj = new Date(task.scheduledAt);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = dateObj.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    const isToday = new Date().toDateString() === dateObj.toDateString();

    return (
        <div className="fade-in" style={{
            backgroundColor: 'var(--surface-color)',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            borderLeft: `4px solid ${periodColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '10px',
            transition: 'all 0.2s',
            opacity: task.completed ? 0.7 : 1
        }}>
            {/* Checkbox */}
            <button
                onClick={() => toggleTask(task.id, task.completed)}
                style={{
                    color: task.completed ? 'var(--success-color)' : 'var(--text-secondary)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                }}
            >
                {task.completed ? <CheckCircle size={24} fill="currentColor" color="white" /> : <Circle size={24} />}
            </button>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <h4 style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: task.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.completed ? 'line-through' : 'none',
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                }}>
                    {task.title}
                </h4>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        <span>{timeStr}</span>
                    </div>
                    {!isToday && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={12} />
                            <span>{dateStr}</span>
                        </div>
                    )}
                    {showCategory && task.category !== 'personal' && (
                        <span style={{
                            backgroundColor: 'var(--bg-color)',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '0.7rem',
                            textTransform: 'uppercase'
                        }}>
                            {task.category === 'house' ? 'Casa' : task.category === 'nutrition' ? 'Nutrição' : task.category}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={() => {
                    if (window.confirm('Excluir esta tarefa?')) deleteTask(task.id);
                }}
                style={{
                    color: 'var(--text-secondary)',
                    opacity: 0.5,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                }}
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export default TaskItem;
