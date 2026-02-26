import * as React from 'react';

export interface ICallTimerResult {
  readonly elapsedSeconds: number;
  readonly isRunning: boolean;
  readonly formattedTime: string;
  readonly start: () => void;
  readonly startFrom: (seconds: number) => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly reset: () => void;
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Precise call timer using Date.now() reference instead of counter increment.
 * Uses an active flag ref to prevent stale interval callbacks from firing
 * after reset/pause.
 */
export const useCallTimer = (): ICallTimerResult => {
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  // Accumulated seconds from previous running sessions
  const baseSecondsRef = React.useRef(0);
  // Timestamp when the current running session started
  const sessionStartRef = React.useRef(0);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  // Guard: prevents stale interval ticks from updating state after stop
  const activeRef = React.useRef(false);

  // Clear any running interval
  const clearTimer = React.useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    activeRef.current = false;
  }, []);

  React.useEffect(() => {
    if (isRunning) {
      sessionStartRef.current = Date.now();
      activeRef.current = true;
      intervalRef.current = setInterval(() => {
        if (!activeRef.current) return;
        const sessionElapsed = Math.floor(
          (Date.now() - sessionStartRef.current) / 1000,
        );
        setElapsedSeconds(baseSecondsRef.current + sessionElapsed);
      }, 250);
    }

    return () => {
      clearTimer();
    };
  }, [isRunning, clearTimer]);

  const start = React.useCallback(() => {
    clearTimer();
    baseSecondsRef.current = 0;
    setElapsedSeconds(0);
    setIsRunning(true);
  }, [clearTimer]);

  const startFrom = React.useCallback((seconds: number) => {
    clearTimer();
    baseSecondsRef.current = Math.max(0, Math.floor(seconds));
    setElapsedSeconds(baseSecondsRef.current);
    setIsRunning(true);
  }, [clearTimer]);

  const pause = React.useCallback(() => {
    // Capture precise elapsed before stopping
    if (activeRef.current && sessionStartRef.current > 0) {
      const sessionElapsed = Math.floor(
        (Date.now() - sessionStartRef.current) / 1000,
      );
      baseSecondsRef.current = baseSecondsRef.current + sessionElapsed;
      setElapsedSeconds(baseSecondsRef.current);
    }
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resume = React.useCallback(() => {
    setIsRunning(true);
  }, []);

  const reset = React.useCallback(() => {
    clearTimer();
    baseSecondsRef.current = 0;
    sessionStartRef.current = 0;
    setIsRunning(false);
    setElapsedSeconds(0);
  }, [clearTimer]);

  return {
    elapsedSeconds,
    isRunning,
    formattedTime: formatTime(elapsedSeconds),
    start,
    startFrom,
    pause,
    resume,
    reset,
  };
};
