import * as React from 'react';
import { Button } from '@fluentui/react-components';
import { ArrowRightRegular } from '@fluentui/react-icons';
import { ICall } from '../../models';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatTime } from '../../utils/formatters';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface IRecentCallsTableProps {
  readonly calls: ReadonlyArray<ICall>;
  readonly onViewAll: () => void;
  readonly onSelectCall: (call: ICall) => void;
}


const containerStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: `1px solid ${CRC_COLORS.borderSubtle}`,
  borderRadius: '10px',
  padding: '20px',
};

const titleStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '14px',
  color: 'rgba(0, 32, 74, 0.75)',
  margin: '0 0 12px 0',
};

const headerRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 1.2fr 1fr 0.7fr 0.7fr 0.7fr',
  gap: '8px',
  padding: '6px 10px',
  borderBottom: `1px solid ${CRC_COLORS.borderDefault}`,
};

const headerCellStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
  color: 'rgba(0, 32, 74, 0.45)',
};

const cellStyle: React.CSSProperties = {
  fontSize: '13px',
  color: 'rgba(0, 32, 74, 0.8)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

function dataRowStyle(isHovered: boolean): React.CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.2fr 1fr 0.7fr 0.7fr 0.7fr',
    gap: '8px',
    padding: '8px 10px',
    cursor: 'pointer',
    backgroundColor: isHovered ? CRC_COLORS.hoverRow : 'transparent',
    borderBottom: `1px solid ${CRC_COLORS.borderSubtle}`,
    transition: 'background-color 150ms ease',
    alignItems: 'center',
  };
}

export const RecentCallsTable: React.FC<IRecentCallsTableProps> = ({ calls, onViewAll, onSelectCall }) => {
  const [hoveredId, setHoveredId] = React.useState<number | undefined>(undefined);

  return (
    <div style={containerStyle}>
      <h3 style={titleStyle}>Recent Calls</h3>

      {calls.length === 0 ? (
        <span style={{ fontSize: '13px', color: 'rgba(0, 32, 74, 0.4)' }}>
          No calls yet.
        </span>
      ) : (
        <>
          <div style={headerRowStyle}>
            <span style={headerCellStyle}>Call ID</span>
            <span style={headerCellStyle}>Type</span>
            <span style={headerCellStyle}>Caller</span>
            <span style={headerCellStyle}>Status</span>
            <span style={headerCellStyle}>Priority</span>
            <span style={headerCellStyle}>Time</span>
          </div>

          {calls.map((call) => (
            <div
              key={call.id}
              style={dataRowStyle(hoveredId === call.id)}
              onClick={() => onSelectCall(call)}
              onMouseEnter={() => setHoveredId(call.id)}
              onMouseLeave={() => setHoveredId(undefined)}
            >
              <span style={{ ...cellStyle, fontWeight: 600 }}>{call.title}</span>
              <span style={cellStyle}>{call.callType}</span>
              <span style={cellStyle}>{call.callerName}</span>
              <span style={cellStyle}><StatusBadge status={call.status} /></span>
              <span style={cellStyle}>
                <PriorityBadge priority={call.priority} />
              </span>
              <span style={{ ...cellStyle, fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(call.startTime)}
              </span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <Button
              appearance="subtle"
              icon={<ArrowRightRegular />}
              iconPosition="after"
              size="small"
              onClick={onViewAll}
            >
              View All
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
