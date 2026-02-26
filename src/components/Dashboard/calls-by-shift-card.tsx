import * as React from 'react';
import { ClockRegular } from '@fluentui/react-icons';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';
import type { ICallsByShift } from './use-dashboard';

interface ICallsByShiftCardProps {
  readonly shifts: ICallsByShift;
}

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: `1px solid ${CRC_COLORS.borderSubtle}`,
  borderRadius: '10px',
  padding: '20px',
  flex: 1,
};

const titleStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '14px',
  color: 'rgba(0, 32, 74, 0.75)',
  margin: '0 0 16px 0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '6px 0',
};

const labelStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
  fontSize: '13px',
  color: 'rgba(0, 32, 74, 0.75)',
  minWidth: '150px',
  flexShrink: 0,
};

const countStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '13px',
  color: 'rgba(0, 32, 74, 0.85)',
  minWidth: '28px',
  textAlign: 'right',
  flexShrink: 0,
};

const barTrackStyle: React.CSSProperties = {
  flex: 1,
  height: '8px',
  borderRadius: '4px',
  backgroundColor: 'rgba(0, 106, 244, 0.08)',
  overflow: 'hidden',
};

const SHIFTS = [
  { key: 'morning' as const, label: 'Morning (6am–2pm)', color: '#F59E0B' },
  { key: 'afternoon' as const, label: 'Afternoon (2pm–10pm)', color: CRC_COLORS.accentBlue },
  { key: 'night' as const, label: 'Night (10pm–6am)', color: CRC_COLORS.supportingBlue },
];

export const CallsByShiftCard: React.FC<ICallsByShiftCardProps> = ({ shifts }) => {
  const maxCount = Math.max(shifts.morning, shifts.afternoon, shifts.night, 1);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        <ClockRegular style={{ color: CRC_COLORS.supportingBlue, fontSize: '16px' }} />
        Calls by Shift
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {SHIFTS.map((shift) => (
          <div key={shift.key} style={rowStyle}>
            <span style={labelStyle}>{shift.label}</span>
            <div style={barTrackStyle}>
              <div
                style={{
                  height: '100%',
                  width: `${(shifts[shift.key] / maxCount) * 100}%`,
                  borderRadius: '4px',
                  backgroundColor: shift.color,
                  transition: 'width 400ms ease',
                }}
              />
            </div>
            <span style={countStyle}>{shifts[shift.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
