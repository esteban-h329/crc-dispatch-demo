import * as React from 'react';
import {
  Badge,
  Caption1,
} from '@fluentui/react-components';
import {
  CircleRegular,
  ArrowEnterLeftRegular,
} from '@fluentui/react-icons';
import type { ICall } from '../../models';
import type { ICallTimerResult } from '../../hooks/useCallTimer';
import { formatDuration } from '../../utils/formatters';
import {
  CRC_COLORS,
  CRC_TYPOGRAPHY,
  TIMER_THRESHOLDS,
  TIMER_COLORS,
} from '../../config/theme';
import { SIDEBAR_WIDTH } from './Sidebar';

function getTimerColor(seconds: number): string {
  if (seconds >= TIMER_THRESHOLDS.criticalSeconds) return TIMER_COLORS.critical;
  if (seconds >= TIMER_THRESHOLDS.warningSeconds) return TIMER_COLORS.warning;
  return TIMER_COLORS.normal;
}

interface IHeaderProps {
  readonly activeCall: ICall | undefined;
  readonly timer: ICallTimerResult;
  readonly dispatcherName: string;
  readonly onResumeCall?: () => void;
  readonly callsToday?: number;
  readonly averageDuration?: number;
  readonly animateResume?: boolean;
}

const HEADER_HEIGHT = 56;

const styles = {
  header: {
    position: 'fixed' as const,
    top: 0,
    left: SIDEBAR_WIDTH,
    right: 0,
    height: HEADER_HEIGHT,
    background: `linear-gradient(135deg, ${CRC_COLORS.headerBg} 0%, #002D66 60%, #003A82 100%)`,
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    padding: '0 28px',
    zIndex: 99,
    borderBottom: '2px solid ${CRC_COLORS.accentBlue}',
    boxShadow: '0 4px 20px rgba(0, 16, 41, 0.4), inset 0 -1px 0 rgba(0, 106, 244, 0.3)',
  },
  timerSection: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '12px',
  },
  timerValue: (seconds: number, isRunning: boolean) => ({
    fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
    fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
    fontSize: '26px',
    color: isRunning ? getTimerColor(seconds) : CRC_COLORS.sidebarText,
    fontVariantNumeric: 'tabular-nums' as const,
    letterSpacing: '-0.02em',
    transition: 'color 1s ease, text-shadow 1s ease',
    lineHeight: 1,
    opacity: !isRunning && seconds > 0 ? 0.6 : 1,
    textShadow: isRunning
      ? `0 0 20px ${getTimerColor(seconds)}40`
      : 'none',
  }),
  centerSection: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '8px',
  },
  callTypeLabel: {
    fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
    fontWeight: CRC_TYPOGRAPHY.fontWeightRegular,
    fontSize: '14px',
    color: CRC_COLORS.sidebarText,
  },
  noActiveCall: {
    fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
    fontWeight: CRC_TYPOGRAPHY.fontWeightRegular,
    fontSize: '14px',
    color: 'rgba(197, 220, 252, 0.45)',
    letterSpacing: '0.01em',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '10px',
  },
  dispatcherName: {
    fontSize: '13px',
    color: CRC_COLORS.sidebarText,
    fontWeight: 500,
    letterSpacing: '0.01em',
  },
} as const;

function resumeButtonStyleFn(animate: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: `linear-gradient(135deg, ${CRC_COLORS.accentBlue}, #0053B8)`,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    padding: '8px 22px',
    cursor: 'pointer',
    transition: 'all 200ms ease',
    animation: animate ? 'crc-live-pulse 2s ease-in-out infinite' : 'none',
    boxShadow: '0 4px 16px rgba(0, 106, 244, 0.45)',
  };
}

const resumeLabelStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
  fontSize: '12px',
  color: '#FFFFFF',
  letterSpacing: '0.03em',
  textTransform: 'uppercase' as const,
};

export const Header: React.FC<IHeaderProps> = ({
  activeCall,
  timer,
  dispatcherName,
  onResumeCall,
  callsToday,
  averageDuration,
  animateResume = false,
}) => {
  return (
    <div style={styles.header}>
      {/* Left: Timer + status badge */}
      <div style={styles.timerSection}>
        <span style={styles.timerValue(timer.elapsedSeconds, timer.isRunning)}>
          {timer.formattedTime}
        </span>

        {timer.isRunning && (
          <Badge
            size="small"
            appearance="filled"
            color="success"
            style={{ animation: 'crc-live-pulse 2s ease-in-out infinite' }}
          >
            LIVE
          </Badge>
        )}

        {!timer.isRunning && timer.elapsedSeconds > 0 && (
          <Badge
            size="small"
            appearance="tint"
            color="warning"
            style={{ animation: 'crc-paused-blink 2s ease-in-out infinite' }}
          >
            PAUSED
          </Badge>
        )}
      </div>

      {/* Center: Call Type (prominent resume button when active) */}
      <div style={styles.centerSection}>
        {activeCall && onResumeCall ? (
          <button
            style={resumeButtonStyleFn(animateResume)}
            onClick={onResumeCall}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0053B8';
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 106, 244, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = CRC_COLORS.accentBlue;
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 106, 244, 0.4)';
            }}
          >
            <ArrowEnterLeftRegular style={{ color: '#FFFFFF', fontSize: '16px' }} />
            <span style={resumeLabelStyle}>Resume</span>
            <span style={styles.callTypeLabel}>{activeCall.callType}</span>
            <Badge size="small" appearance="tint" color="informative">
              {activeCall.priority}
            </Badge>
          </button>
        ) : activeCall ? (
          <>
            <CircleRegular style={{ color: CRC_COLORS.accentBlue, fontSize: '8px' }} />
            <span style={styles.callTypeLabel}>{activeCall.callType}</span>
            <Badge size="small" appearance="tint" color="informative">
              {activeCall.priority}
            </Badge>
          </>
        ) : (
          <span style={styles.noActiveCall}>
            No active call
            {callsToday !== undefined && (
              <>
                <span style={{ margin: '0 8px', opacity: 0.4 }}>&bull;</span>
                {callsToday} {callsToday === 1 ? 'call' : 'calls'} today
              </>
            )}
            {averageDuration !== undefined && averageDuration > 0 && (
              <>
                <span style={{ margin: '0 8px', opacity: 0.4 }}>&bull;</span>
                Avg: {formatDuration(averageDuration)}
              </>
            )}
          </span>
        )}
      </div>

      {/* Right: Dispatcher info */}
      <div style={styles.rightSection}>
        <Caption1 style={styles.dispatcherName}>{dispatcherName}</Caption1>
      </div>
    </div>
  );
};

export { HEADER_HEIGHT };
