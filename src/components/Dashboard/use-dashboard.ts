import * as React from 'react';
import { ICall, CallType, CallStatus } from '../../models';
import { callsService } from '../../services';
import { useSharePointList } from '../../hooks/useSharePointList';
import { useAppContext } from '../../context/AppContext';

export interface ICallsByShift {
  readonly morning: number;
  readonly afternoon: number;
  readonly night: number;
}

export interface IDashboardStats {
  readonly callsToday: number;
  readonly averageDuration: number;
  readonly activeCalls: number;
  readonly escalatedCalls: number;
  readonly totalCalls: number;
  readonly callsByType: ReadonlyArray<{ readonly type: CallType; readonly count: number }>;
  readonly callsByStatus: ReadonlyArray<{ readonly status: CallStatus; readonly count: number }>;
  readonly longestCallToday: ICall | undefined;
  readonly callsByShift: ICallsByShift;
  readonly recentCalls: ReadonlyArray<ICall>;
}

export interface IUseDashboardResult {
  readonly stats: IDashboardStats;
  readonly isLoading: boolean;
  readonly error: string | undefined;
  readonly refresh: () => Promise<void>;
}

function mergeCalls(
  serviceCalls: ReadonlyArray<ICall>,
  sessionCalls: ReadonlyArray<ICall>,
): ReadonlyArray<ICall> {
  const seen = new Set<number>();
  const merged: ICall[] = [];

  for (const call of sessionCalls) {
    if (!seen.has(call.id)) {
      seen.add(call.id);
      merged.push(call);
    }
  }

  for (const call of serviceCalls) {
    if (!seen.has(call.id)) {
      seen.add(call.id);
      merged.push(call);
    }
  }

  return merged;
}

function computeStats(calls: ReadonlyArray<ICall>): IDashboardStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCalls = calls.filter((c) => c.startTime >= today);

  const callsWithDuration = calls.filter((c) => c.duration !== undefined);
  const averageDuration =
    callsWithDuration.length > 0
      ? callsWithDuration.reduce((sum, c) => sum + (c.duration ?? 0), 0) / callsWithDuration.length
      : 0;

  const activeCalls = calls.filter((c) => c.status === CallStatus.Active).length;
  const escalatedCalls = calls.filter((c) => c.status === CallStatus.Escalated).length;

  // Group by type
  const typeMap = new Map<CallType, number>();
  for (const call of calls) {
    typeMap.set(call.callType, (typeMap.get(call.callType) ?? 0) + 1);
  }
  const callsByType = Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  // Group by status
  const statusMap = new Map<CallStatus, number>();
  for (const call of calls) {
    statusMap.set(call.status, (statusMap.get(call.status) ?? 0) + 1);
  }
  const callsByStatus = Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  // Longest call today (by duration)
  const todayWithDuration = todayCalls.filter((c) => c.duration !== undefined && c.duration > 0);
  const longestCallToday = todayWithDuration.length > 0
    ? todayWithDuration.reduce((max, c) => (c.duration ?? 0) > (max.duration ?? 0) ? c : max)
    : undefined;

  // Group today's calls by shift
  const callsByShift: ICallsByShift = { morning: 0, afternoon: 0, night: 0 };
  for (const call of todayCalls) {
    const hour = call.startTime.getHours();
    if (hour >= 6 && hour < 14) {
      (callsByShift as { morning: number }).morning++;
    } else if (hour >= 14 && hour < 22) {
      (callsByShift as { afternoon: number }).afternoon++;
    } else {
      (callsByShift as { night: number }).night++;
    }
  }

  // Recent calls — last 5 sorted by startTime desc
  const recentCalls = [...calls]
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 5);

  return {
    callsToday: todayCalls.length,
    averageDuration,
    activeCalls,
    escalatedCalls,
    totalCalls: calls.length,
    callsByType,
    callsByStatus,
    longestCallToday,
    callsByShift,
    recentCalls,
  };
}

export function useDashboard(): IUseDashboardResult {
  const { state } = useAppContext();
  const { data: serviceCalls, isLoading, error, refresh } = useSharePointList<ICall>(
    () => callsService.getAll(),
  );

  const allCalls = React.useMemo(
    () => mergeCalls(serviceCalls, state.callHistory),
    [serviceCalls, state.callHistory],
  );

  const stats = React.useMemo(() => computeStats(allCalls), [allCalls]);

  return { stats, isLoading, error, refresh };
}
