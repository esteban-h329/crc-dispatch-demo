import * as React from 'react';
import {
  Spinner,
  tokens,
  Body1,
} from '@fluentui/react-components';
import {
  CallRegular,
  TimerRegular,
  CircleRegular,
  WarningRegular,
} from '@fluentui/react-icons';
import { ICall, CallStatus } from '../../models';
import { formatDuration } from '../../utils/formatters';
import { useDashboard } from './use-dashboard';
import { StatCard } from './stat-card';
import { CallsByTypeChart } from './calls-by-type-chart';
import { CallsByStatusChart } from './calls-by-status-chart';
import { RecentCallsTable } from './recent-calls-table';
import { LongestCallCard } from './longest-call-card';
import { CallsByShiftCard } from './calls-by-shift-card';
import { CallDetailDialog } from '../CallHistory/call-detail-dialog';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface IDashboardProps {
  readonly onNavigateToHistory?: () => void;
  readonly onNavigateToHistoryWithFilter?: (status: CallStatus) => void;
  readonly onResumeCall?: (callId: number) => void;
}

export const Dashboard: React.FC<IDashboardProps> = ({ onNavigateToHistory, onNavigateToHistoryWithFilter, onResumeCall }) => {
  const { stats, isLoading, error } = useDashboard();
  const [selectedCall, setSelectedCall] = React.useState<ICall | undefined>(undefined);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: tokens.spacingVerticalXXL }}>
        <Spinner label="Loading dashboard..." />
      </div>
    );
  }

  if (error !== undefined) {
    return (
      <div style={{ padding: tokens.spacingVerticalL, color: tokens.colorPaletteRedForeground1 }}>
        <Body1>Failed to load dashboard: {error}</Body1>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2
        style={{
          fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
          fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
          fontSize: '20px',
          color: 'rgba(0, 32, 74, 0.85)',
          margin: 0,
        }}
      >
        Dashboard
      </h2>

      {/* Row 1: Stat cards */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <StatCard
          value={stats.callsToday}
          label="Calls Today"
          icon={<CallRegular />}
          accentColor={CRC_COLORS.accentBlue}
        />
        <StatCard
          value={stats.averageDuration > 0 ? formatDuration(stats.averageDuration) : '—'}
          label="Avg Duration"
          icon={<TimerRegular />}
          accentColor={CRC_COLORS.supportingBlue}
        />
        <StatCard
          value={stats.activeCalls}
          label="Active Now"
          icon={<CircleRegular />}
          accentColor={stats.activeCalls > 0 ? '#EF4444' : '#10B981'}
          actionLabel={stats.activeCalls > 0 ? 'View All' : undefined}
          onAction={stats.activeCalls > 0 ? () => onNavigateToHistoryWithFilter?.(CallStatus.Active) : undefined}
        />
        <StatCard
          value={stats.escalatedCalls}
          label="Escalated"
          icon={<WarningRegular />}
          accentColor={stats.escalatedCalls > 0 ? '#F59E0B' : 'rgba(0, 32, 74, 0.3)'}
        />
      </div>

      {/* Row 2: Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <CallsByTypeChart data={stats.callsByType} />
        <CallsByStatusChart data={stats.callsByStatus} />
      </div>

      {/* Row 3: Recent Calls */}
      <RecentCallsTable
        calls={stats.recentCalls}
        onViewAll={() => onNavigateToHistory?.()}
        onSelectCall={setSelectedCall}
      />

      {/* Row 4: Longest Call + Calls by Shift */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <LongestCallCard call={stats.longestCallToday} />
        <CallsByShiftCard shifts={stats.callsByShift} />
      </div>

      {/* Detail dialog for recent calls */}
      <CallDetailDialog
        call={selectedCall}
        onClose={() => setSelectedCall(undefined)}
        onResumeCall={onResumeCall}
      />
    </div>
  );
};
