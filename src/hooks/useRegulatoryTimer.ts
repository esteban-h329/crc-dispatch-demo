import * as React from 'react';

export interface IRegulatoryTimerResult {
  readonly isActive: boolean;
  readonly remainingSeconds: number;
  readonly totalSeconds: number;
  readonly formattedRemaining: string;
  readonly isExpired: boolean;
  readonly label: string;
  readonly startedAt: number | undefined;
  readonly startTimer: () => void;
  readonly startFrom: (timestamp: number) => void;
  readonly resetTimer: () => void;
}

/**
 * Countdown timer for regulatory notification deadlines (30 min or 1 hour).
 * Uses Date.now() for precision — survives re-renders without drift.
 */
export function useRegulatoryTimer(
  durationMinutes: number,
  label: string,
): IRegulatoryTimerResult {
  const totalSeconds = durationMinutes * 60;
  const [isActive, setIsActive] = React.useState(false);
  const [startedAt, setStartedAt] = React.useState<number | undefined>(undefined);
  const [remainingSeconds, setRemainingSeconds] = React.useState(totalSeconds);

  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = React.useCallback(() => {
    if (isActive) return;
    const now = Date.now();
    setStartedAt(now);
    setIsActive(true);
    setRemainingSeconds(totalSeconds);
  }, [isActive, totalSeconds]);

  // Restore timer from a previously saved startedAt timestamp
  const startFrom = React.useCallback((timestamp: number) => {
    setStartedAt(timestamp);
    setIsActive(true);
    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
    setRemainingSeconds(Math.max(0, totalSeconds - elapsed));
  }, [totalSeconds]);

  const resetTimer = React.useCallback(() => {
    clearTimer();
    setIsActive(false);
    setStartedAt(undefined);
    setRemainingSeconds(totalSeconds);
  }, [clearTimer, totalSeconds]);

  React.useEffect(() => {
    if (!isActive || startedAt === undefined) {
      clearTimer();
      return;
    }

    const tick = (): void => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, totalSeconds - elapsed);
      setRemainingSeconds(remaining);
    };

    tick();
    intervalRef.current = setInterval(tick, 1000);

    return clearTimer;
  }, [isActive, startedAt, totalSeconds, clearTimer]);

  const formattedRemaining = React.useMemo(() => {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [remainingSeconds]);

  return {
    isActive,
    remainingSeconds,
    totalSeconds,
    formattedRemaining,
    isExpired: isActive && remainingSeconds <= 0,
    label,
    startedAt,
    startTimer,
    startFrom,
    resetTimer,
  };
}
