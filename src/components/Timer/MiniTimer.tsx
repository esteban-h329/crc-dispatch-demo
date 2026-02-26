import * as React from 'react';
import {
  TimerRegular,
} from '@fluentui/react-icons';
import type { ICallTimerResult } from '../../hooks/useCallTimer';
import {
  CRC_TYPOGRAPHY,
  TIMER_THRESHOLDS,
  TIMER_COLORS,
  CRC_COLORS,
} from '../../config/theme';

function getTimerColor(seconds: number, isRunning: boolean): string {
  if (!isRunning) return CRC_COLORS.sidebarText;
  if (seconds >= TIMER_THRESHOLDS.criticalSeconds) return TIMER_COLORS.critical;
  if (seconds >= TIMER_THRESHOLDS.warningSeconds) return TIMER_COLORS.warning;
  return TIMER_COLORS.normal;
}

interface IMiniTimerProps {
  readonly timer: ICallTimerResult;
}

const styles = {
  container: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(0, 32, 74, 0.04)',
    border: `1px solid ${CRC_COLORS.borderSubtle}`,
  },
  icon: (color: string) => ({
    fontSize: '14px',
    color,
    display: 'flex',
    alignItems: 'center' as const,
  }),
  time: (color: string) => ({
    fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
    fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
    fontSize: '13px',
    color,
    fontVariantNumeric: 'tabular-nums' as const,
    letterSpacing: '-0.01em',
    transition: 'color 1s ease',
    lineHeight: 1,
  }),
} as const;

/**
 * Compact timer display for the workflow steps area.
 * Shows HH:MM:SS only, no controls. Same dynamic color as the global header timer.
 */
export const MiniTimer: React.FC<IMiniTimerProps> = ({ timer }) => {
  const color = getTimerColor(timer.elapsedSeconds, timer.isRunning);

  if (timer.elapsedSeconds === 0 && !timer.isRunning) return null;

  return (
    <div style={styles.container}>
      <span style={styles.icon(color)}>
        <TimerRegular />
      </span>
      <span style={styles.time(color)}>
        {timer.formattedTime}
      </span>
    </div>
  );
};
