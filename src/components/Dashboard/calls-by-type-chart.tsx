import * as React from 'react';
import { CallType } from '../../models';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface ICallsByTypeChartProps {
  readonly data: ReadonlyArray<{ readonly type: CallType; readonly count: number }>;
}

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '14px',
  color: 'rgba(0, 32, 74, 0.75)',
  margin: '0 0 16px 0',
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: `1px solid ${CRC_COLORS.borderSubtle}`,
  borderRadius: '10px',
  padding: '20px',
};

const emptyStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(0, 32, 74, 0.4)',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
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
  minWidth: '140px',
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

export const CallsByTypeChart: React.FC<ICallsByTypeChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div style={containerStyle}>
        <h3 style={sectionTitleStyle}>Calls by Type</h3>
        <span style={emptyStyle}>No data available.</span>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count));

  return (
    <div style={containerStyle}>
      <h3 style={sectionTitleStyle}>Calls by Type</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {data.map((item) => (
          <div key={item.type} style={rowStyle}>
            <span style={labelStyle}>{item.type}</span>
            <div style={barTrackStyle}>
              <div
                style={{
                  height: '100%',
                  width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                  borderRadius: '4px',
                  backgroundColor: CRC_COLORS.accentBlue,
                  transition: 'width 400ms ease',
                }}
              />
            </div>
            <span style={countStyle}>{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
