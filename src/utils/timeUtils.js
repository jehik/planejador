import { isSameDay, isSameWeek, isSameMonth, isPast, addHours } from 'date-fns';

export const classifyTask = (task) => {
    // task.scheduledAt is a JS Date object (converted in store)
    const now = new Date();
    const date = new Date(task.scheduledAt);

    if (task.completed) return 'completed';

    // Atrasada: scheduledAt < agora AND !completed
    // We add a small buffer (e.g., 1 min) or just strict comparison? Prompt says "scheduledAt < agora"
    if (isPast(date) && !isSameDay(date, now)) {
        return 'late';
    }
    // If it's today but time is past, is it late? 
    // Usually "Late" implies "Yesterday or before" for tasks, unless it has specific time.
    // Prompt: "Se scheduledAt < agora AND !completed -> Atrasada". 
    // If I scheduled for 10:00 and it's 10:01, it's late.
    if (isPast(date)) return 'late';

    if (isSameDay(date, now)) return 'today';
    if (isSameWeek(date, now)) return 'week';
    if (isSameMonth(date, now)) return 'month';

    return 'future';
};

export const getPeriodLabel = (period) => {
    switch (period) {
        case 'late': return 'Atrasadas';
        case 'today': return 'Hoje';
        case 'week': return 'Esta Semana';
        case 'month': return 'Este Mês';
        case 'future': return 'Futuras';
        default: return '';
    }
};

export const getPeriodColor = (period) => {
    switch (period) {
        case 'late': return 'var(--danger-color)'; // Red
        case 'today': return 'var(--warning-color)'; // Yellow
        case 'week': return 'var(--primary-color)';
        case 'month': return 'var(--text-secondary)';
        case 'future': return 'var(--info-color)'; // Blue
        case 'completed': return 'var(--success-color)'; // Green
        default: return 'var(--text-secondary)';
    }
};
