import * as React from 'react';
import {
  Spinner,
  tokens,
  Body1,
} from '@fluentui/react-components';
import { CRC_TYPOGRAPHY } from '../../config/theme';
import { ICall, CallStatus } from '../../models';
import { useCallHistory } from './use-call-history';
import { CallHistoryFilters } from './call-history-filters';
import { CallHistoryTable } from './call-history-table';
import { CallDetailDialog } from './call-detail-dialog';

interface ICallHistoryProps {
  readonly onResumeCall?: (callId: number) => void;
  readonly initialStatusFilter?: CallStatus;
}

export const CallHistory: React.FC<ICallHistoryProps> = ({ onResumeCall, initialStatusFilter }) => {
  const {
    filteredCalls,
    isLoading,
    error,
    filters,
    sort,
    setSearchText,
    setCallTypeFilter,
    setStatusFilter,
    setPriorityFilter,
    toggleSort,
    totalCount,
  } = useCallHistory(initialStatusFilter);

  const [selectedCall, setSelectedCall] = React.useState<ICall | undefined>(undefined);

  const handleSelectCall = React.useCallback((call: ICall) => {
    setSelectedCall(call);
  }, []);

  const handleCloseDetail = React.useCallback(() => {
    setSelectedCall(undefined);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalXXL }}>
        <Spinner label="Loading call history..." />
      </div>
    );
  }

  if (error !== undefined) {
    return (
      <div style={{ padding: tokens.spacingVerticalL, color: tokens.colorPaletteRedForeground1 }}>
        <Body1>Failed to load call history: {error}</Body1>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM }}>
      <h2
        style={{
          fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
          fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
          fontSize: '20px',
          color: 'rgba(0, 32, 74, 0.85)',
          margin: 0,
        }}
      >
        Call History
      </h2>

      <CallHistoryFilters
        filters={filters}
        onSearchTextChange={setSearchText}
        onCallTypeChange={setCallTypeFilter}
        onStatusChange={setStatusFilter}
        onPriorityChange={setPriorityFilter}
        totalCount={totalCount}
        filteredCount={filteredCalls.length}
      />

      <div key={filteredCalls.length} style={{ animation: 'crc-fade-in 100ms ease' }}>
        <CallHistoryTable
          calls={filteredCalls}
          selectedCallId={selectedCall?.id}
          onSelectCall={handleSelectCall}
          sortColumn={sort.column}
          sortDirection={sort.direction}
          onToggleSort={toggleSort}
          searchText={filters.searchText}
        />
      </div>

      <CallDetailDialog
        call={selectedCall}
        onClose={handleCloseDetail}
        onResumeCall={onResumeCall}
      />
    </div>
  );
};
