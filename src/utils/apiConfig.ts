
export const getApiBaseUrl = (): string => {
    if (typeof window === 'undefined') return '';

    // Check if running on localhost
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
        return 'http://localhost:4000';
    }

    return '';
};
