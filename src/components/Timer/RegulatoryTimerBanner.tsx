import * as React from 'react';
import { tokens } from '@fluentui/react-components';
import { TimerRegular } from '@fluentui/react-icons';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';
import type { IRegulatoryTimerResult } from '../../hooks/useRegulatoryTimer';

interface IRegulatoryTimerBannerProps {
  readonly timer: IRegulatoryTimerResult;
}

function getBannerColor(remaining: number, total: number): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} {
  const ratio = remaining / total;
  if (remaining <= 0) {
    return {
      bg: `${CRC_COLORS.danger}15`,
      border: CRC_COLORS.danger,
      text: CRC_COLORS.danger,
      icon: CRC_COLORS.danger,
    };
  }
  if (ratio <= 0.25) {
    return {
      bg: `${CRC_COLORS.danger}10`,
      border: CRC_COLORS.danger,
      text: CRC_COLORS.danger,
      icon: CRC_COLORS.danger,
    };
  }
  if (ratio <= 0.5) {
    return {
      bg: `${CRC_COLORS.warning}10`,
      border: CRC_COLORS.warning,
      text: '#92400E',
      icon: CRC_COLORS.warning,
    };
  }
  return {
    bg: `${CRC_COLORS.accentBlue}08`,
    border: CRC_COLORS.accentBlue,
    text: CRC_COLORS.navy,
    icon: CRC_COLORS.accentBlue,
  };
}

export const RegulatoryTimerBanner: React.FC<IRegulatoryTimerBannerProps> = ({ timer }) => {
  const colors = getBannerColor(timer.remainingSeconds, timer.totalSeconds);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        marginBottom: tokens.spacingVerticalM,
        borderRadius: '8px',
        border: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        animation: timer.isExpired ? 'crc-pulse-critical 1.5s ease-in-out infinite' : undefined,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <TimerRegular style={{ fontSize: '20px', color: colors.icon }} />
        <span
          style={{
            fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
            fontWeight: 600,
            fontSize: '14px',
            color: colors.text,
          }}
        >
          {timer.isExpired
            ? `EXPIRED — ${timer.label} notification deadline`
            : `${timer.label} — notification deadline`}
        </span>
      </div>
      <span
        style={{
          fontFamily: 'monospace',
          fontWeight: 700,
          fontSize: '18px',
          color: colors.text,
          letterSpacing: '0.05em',
        }}
      >
        {timer.formattedRemaining}
      </span>
    </div>
  );
};
