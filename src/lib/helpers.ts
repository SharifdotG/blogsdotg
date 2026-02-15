import { format, formatDistanceToNow } from "date-fns";

/**
 * Format a timestamp to a human-readable date
 */
export function formatDate(timestamp: number): string {
    return format(new Date(timestamp), "MMM d, yyyy");
}

/**
 * Format a timestamp to relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(timestamp: number): string {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

/**
 * Estimate reading time from HTML content
 */
export function estimateReadingTime(content: string): string {
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
