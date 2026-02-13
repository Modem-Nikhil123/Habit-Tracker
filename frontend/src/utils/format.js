export const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
};

export const formatDate = (dateString, options = {}) => {
    const date = new Date(dateString);
    const defaultOptions = {
        month: 'short',
        day: 'numeric',
    };
    return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};
