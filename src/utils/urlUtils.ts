/**
 * Ensures a URL is absolute by adding a protocol if it's missing.
 * This prevents the browser from treating external links (e.g., "facebook.com")
 * as relative paths on the current site.
 * 
 * @param url The URL to format
 * @returns The formatted absolute URL
 */
export const formatUrl = (url: string): string => {
    if (!url) return '';

    const trimmedUrl = url.trim();

    // Pass through common protocols and anchors
    if (
        trimmedUrl.startsWith('http://') ||
        trimmedUrl.startsWith('https://') ||
        trimmedUrl.startsWith('mailto:') ||
        trimmedUrl.startsWith('tel:') ||
        trimmedUrl.startsWith('#') ||
        trimmedUrl.startsWith('/') ||
        trimmedUrl.startsWith('?')
    ) {
        return trimmedUrl;
    }

    // If it looks like a domain (contains a dot and no spaces), add https://
    // Example: "facebook.com", "google.com/search"
    if (trimmedUrl.includes('.') && !trimmedUrl.includes(' ')) {
        return `https://${trimmedUrl}`;
    }

    // Default fallback
    return trimmedUrl;
};
