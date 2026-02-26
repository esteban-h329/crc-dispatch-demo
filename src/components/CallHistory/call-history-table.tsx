import * as React from 'react';
import {
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Tooltip,
  tokens,
  Body1,
} from '@fluentui/react-components';
import {
  ArrowUpRegular,
  ArrowDownRegular,
  ClipboardSearchRegular,
} from '@fluentui/react-icons';
import { ICall } from '../../models';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatDuration, formatDateTime } from '../../utils/formatters';
import { SortColumn, SortDirection } from './use-call-history';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface ICallHistoryTableProps {
  readonly calls: ReadonlyArray<ICall>;
  readonly selectedCallId: number | undefined;
  readonly onSelectCall: (call: ICall) => void;
  readonly sortColumn: SortColumn;
  readonly sortDirection: SortDirection;
  readonly onToggleSort: (column: SortColumn) => void;
  readonly searchText?: string;
}


interface IColumnDef {
  readonly key: SortColumn;
  readonly label: string;
  readonly width: string;
}

const COLUMNS: ReadonlyArray<IColumnDef> = [
  { key: 'title', label: 'Call ID', width: '12%' },
  { key: 'callType', label: 'Type', width: '12%' },
  { key: 'callerName', label: 'Caller', width: '12%' },
  { key: 'summary', label: 'Brief Description', width: '20%' },
  { key: 'status', label: 'Status', width: '10%' },
  { key: 'priority', label: 'Priority', width: '9%' },
  { key: 'duration', label: 'Duration', width: '9%' },
  { key: 'startTime', label: 'Date', width: '16%' },
];

// ── Styles ──────────────────────────────────────────────────────────

const headerCellStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '11px',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'rgba(0, 32, 74, 0.5)',
  cursor: 'pointer',
  padding: '10px 12px',
};

function rowStyle(isSelected: boolean, isHovered: boolean, index: number): React.CSSProperties {
  const zebraBackground = index % 2 === 0 ? 'rgba(0, 32, 74, 0.018)' : 'transparent';
  return {
    cursor: 'pointer',
    borderLeft: isSelected ? `3px solid ${CRC_COLORS.accentBlue}` : '3px solid transparent',
    backgroundColor: isSelected
      ? 'rgba(0, 106, 244, 0.06)'
      : isHovered
        ? 'rgba(0, 106, 244, 0.03)'
        : zebraBackground,
    transition: 'all 200ms ease',
    transform: isHovered && !isSelected ? 'translateX(2px)' : 'none',
  };
}

const cellStyle: React.CSSProperties = {
  padding: '8px 12px',
  fontSize: '13px',
  lineHeight: 1.4,
};

const summaryCellStyle: React.CSSProperties = {
  ...cellStyle,
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const highlightStyle: React.CSSProperties = {
  backgroundColor: 'rgba(245, 158, 11, 0.2)',
  borderRadius: '2px',
  padding: '0 1px',
};

// ── Helpers ─────────────────────────────────────────────────────────

const SortIcon: React.FC<{
  readonly column: SortColumn;
  readonly activeColumn: SortColumn;
  readonly direction: SortDirection;
}> = ({ column, activeColumn, direction }) => {
  if (column !== activeColumn) return null;
  return direction === 'asc' ? <ArrowUpRegular fontSize={12} /> : <ArrowDownRegular fontSize={12} />;
};

/** Highlights matching portions of text when a search query is active. */
function highlightText(text: string, query: string): React.ReactNode {
  if (query.length === 0) return text;

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark style={highlightStyle}>{text.slice(index, index + query.length)}</mark>
      {text.slice(index + query.length)}
    </>
  );
}

// ── Component ───────────────────────────────────────────────────────

export const CallHistoryTable: React.FC<ICallHistoryTableProps> = ({
  calls,
  selectedCallId,
  onSelectCall,
  sortColumn,
  sortDirection,
  onToggleSort,
  searchText = '',
}) => {
  const [hoveredId, setHoveredId] = React.useState<number | undefined>(undefined);

  if (calls.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 48px', textAlign: 'center' }}>
        <ClipboardSearchRegular style={{ fontSize: '40px', color: CRC_COLORS.borderDefault, marginBottom: '12px' }} />
        <Body1 style={{ fontWeight: 600, color: tokens.colorNeutralForeground2 }}>
          No calls found matching your filters
        </Body1>
        <Body1 style={{ fontSize: '12px', color: tokens.colorNeutralForeground3, marginTop: '4px' }}>
          Try adjusting your search or filter criteria
        </Body1>
      </div>
    );
  }

  return (
    <div
      style={{
        overflowX: 'auto',
        border: `1px solid ${CRC_COLORS.borderSubtle}`,
        borderRadius: '12px',
        boxShadow: '0 1px 4px rgba(0, 32, 74, 0.04)',
      }}
    >
      <Table size="small">
        <TableHeader>
          <TableRow
            style={{
              background: 'linear-gradient(180deg, rgba(0, 32, 74, 0.035), rgba(0, 32, 74, 0.02))',
              borderBottom: `2px solid ${CRC_COLORS.borderSubtle}`,
            }}
          >
            {COLUMNS.map((col) => (
              <TableHeaderCell
                key={col.key}
                style={{ ...headerCellStyle, width: col.width }}
                onClick={() => onToggleSort(col.key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {col.label}
                  <SortIcon column={col.key} activeColumn={sortColumn} direction={sortDirection} />
                </div>
              </TableHeaderCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {calls.map((call, index) => {
            const isSelected = call.id === selectedCallId;
            const isHovered = call.id === hoveredId;

            return (
              <TableRow
                key={call.id}
                onClick={() => onSelectCall(call)}
                onMouseEnter={() => setHoveredId(call.id)}
                onMouseLeave={() => setHoveredId(undefined)}
                style={rowStyle(isSelected, isHovered, index)}
              >
                <TableCell style={cellStyle}>
                  <strong>{highlightText(call.title, searchText)}</strong>
                </TableCell>
                <TableCell style={cellStyle}>
                  {highlightText(call.callType, searchText)}
                </TableCell>
                <TableCell style={cellStyle}>
                  {highlightText(call.callerName, searchText)}
                </TableCell>
                <TableCell style={summaryCellStyle}>
                  {call.summary ? (
                    <Tooltip
                      content={call.summary}
                      relationship="description"
                      positioning="above"
                    >
                      <span>{highlightText(call.summary, searchText)}</span>
                    </Tooltip>
                  ) : (
                    <span style={{ color: tokens.colorNeutralForeground4 }}>—</span>
                  )}
                </TableCell>
                <TableCell style={cellStyle}>
                  <StatusBadge status={call.status} />
                </TableCell>
                <TableCell style={cellStyle}>
                  <PriorityBadge priority={call.priority} />
                </TableCell>
                <TableCell style={cellStyle}>
                  {call.duration !== undefined ? formatDuration(call.duration) : '—'}
                </TableCell>
                <TableCell style={cellStyle}>
                  {formatDateTime(call.startTime)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
