import * as React from 'react';
import { CallPriority } from '../../models';
import { CRC_TYPOGRAPHY } from '../../config/theme';

interface IPriorityBadgeProps {
  readonly priority: CallPriority;
}

const PRIORITY_STYLES: Record<CallPriority, { bg: string; color: string }> = {
  [CallPriority.Critical]: { bg: '#FEE2E2', color: '#DC2626' },
  [CallPriority.High]: { bg: '#FEF3C7', color: '#D97706' },
  [CallPriority.Medium]: { bg: '#DBEAFE', color: '#2563EB' },
  [CallPriority.Low]: { bg: '#F3F4F6', color: '#6B7280' },
};

const baseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  letterSpacing: '0.02em',
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
};

export const PriorityBadge: React.FC<IPriorityBadgeProps> = ({ priority }) => {
  const colors = PRIORITY_STYLES[priority];
  const isCritical = priority === CallPriority.Critical;

  return (
    <span
      style={{
        ...baseStyle,
        backgroundColor: colors.bg,
        color: colors.color,
        animation: isCritical ? 'crc-pulse-critical 3s ease-in-out infinite' : undefined,
      }}
    >
      {priority}
    </span>
  );
};
