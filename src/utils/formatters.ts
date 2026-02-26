/**
 * Formats a duration in seconds to a human-readable string.
 * Examples: 45 -> "45s", 125 -> "2m 5s", 3665 -> "1h 1m"
 */
export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds < 1) return '0s';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.round(totalSeconds % 60);

  if (hours > 0) {
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    if (seconds === 0) return `${minutes}m`;
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

/**
 * Formats a Date to a localized date-time string.
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Formats a Date to a short time string (HH:MM AM/PM).
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
