import * as React from 'react';
import { TimerRegular } from '@fluentui/react-icons';
import { ICall } from '../../models';
import { formatDuration } from '../../utils/formatters';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface ILongestCallCardProps {
  readonly call: ICall | undefined;
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

const emptyStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(0, 32, 74, 0.4)',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
};

const callIdStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
  fontSize: '13px',
  color: CRC_COLORS.accentBlue,
  marginBottom: '4px',
};

const durationStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
  fontSize: '28px',
  lineHeight: 1,
  color: 'rgba(0, 32, 74, 0.85)',
  margin: '8px 0',
};

const detailStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
  fontSize: '12px',
  color: 'rgba(0, 32, 74, 0.55)',
  lineHeight: 1.4,
};

export const LongestCallCard: React.FC<ILongestCallCardProps> = ({ call }) => {
  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>
        <TimerRegular style={{ color: CRC_COLORS.supportingBlue, fontSize: '16px' }} />
        Longest Call Today
      </h3>

      {call === undefined ? (
        <span style={emptyStyle}>No calls today</span>
      ) : (
        <div>
          <div style={callIdStyle}>{call.title}</div>
          <div style={durationStyle}>
            {call.duration !== undefined ? formatDuration(call.duration) : '—'}
          </div>
          <div style={detailStyle}>
            {call.callType} — {call.callerName}
          </div>
        </div>
      )}
    </div>
  );
};
