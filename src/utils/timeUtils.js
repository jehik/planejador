export const classifyTask = (task) => {
    if (task.completed) return 'completed';

    const now = new Date();
    const taskDate = new Date(task.scheduledAt); // Ensure it's a Date object

    // Reset hours for date comparison
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDayStart = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

    // Check if Late
    // "Late" means past today? Or past current time?
    // Prompt: "Se scheduledAt < agora AND !completed -> Atrasada"
    // Strict time comparison
    if (taskDate < now) {
        // If it's today but time passed, is it late?
        // Prompt implies yes. But usually user wants "Today" tasks to stay "Today" until tomorrow.
        // Let's stick to Prompt literal: "Se scheduledAt < agora".
        // BUT also "Se mesma data -> Hoje".
        // Prompt priority: "Se mesma data -> Hoje".
        // So "Late" is strictly scheduledAt < Today 00:00? 
        // Or scheduledAt < Now?
        // Let's interpret: If Same Day -> 'today'. Else if < Now -> 'late'.
        if (taskDayStart.getTime() === todayStart.getTime()) {
            return 'today';
        }
        return 'late';
    }

    if (taskDayStart.getTime() === todayStart.getTime()) return 'today';

    // Week Check
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round((taskDayStart - todayStart) / oneDay);
    if (diffDays <= 7 && diffDays > 0) return 'week';

    // Month Check
    if (taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear()) {
        return 'month';
    }

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
