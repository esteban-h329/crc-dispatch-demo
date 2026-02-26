import * as React from 'react';
import { ICall, CallType, CallStatus, CallPriority } from '../../models';
import { callsService } from '../../services';
import { useSharePointList } from '../../hooks/useSharePointList';
import { useAppContext } from '../../context/AppContext';

export type SortColumn = 'title' | 'callType' | 'callerName' | 'status' | 'priority' | 'duration' | 'startTime' | 'summary';
export type SortDirection = 'asc' | 'desc';

export interface ICallHistoryFilters {
  readonly searchText: string;
  readonly callType: CallType | undefined;
  readonly status: CallStatus | undefined;
  readonly priority: CallPriority | undefined;
}

export interface ICallHistorySort {
  readonly column: SortColumn;
  readonly direction: SortDirection;
}

export interface IUseCallHistoryResult {
  readonly filteredCalls: ReadonlyArray<ICall>;
  readonly isLoading: boolean;
  readonly error: string | undefined;
  readonly refresh: () => Promise<void>;
  readonly filters: ICallHistoryFilters;
  readonly sort: ICallHistorySort;
  readonly setSearchText: (value: string) => void;
  readonly setCallTypeFilter: (value: CallType | undefined) => void;
  readonly setStatusFilter: (value: CallStatus | undefined) => void;
  readonly setPriorityFilter: (value: CallPriority | undefined) => void;
  readonly toggleSort: (column: SortColumn) => void;
  readonly totalCount: number;
}

function matchesSearch(call: ICall, searchText: string): boolean {
  const lower = searchText.toLowerCase();
  return (
    call.title.toLowerCase().includes(lower) ||
    call.callerName.toLowerCase().includes(lower) ||
    call.callerPhone.toLowerCase().includes(lower) ||
    call.location.toLowerCase().includes(lower) ||
    call.summary.toLowerCase().includes(lower)
  );
}

function compareCalls(a: ICall, b: ICall, column: SortColumn, direction: SortDirection): number {
  let comparison = 0;

  switch (column) {
    case 'title':
      comparison = a.title.localeCompare(b.title);
      break;
    case 'callType':
      comparison = a.callType.localeCompare(b.callType);
      break;
    case 'callerName':
      comparison = a.callerName.localeCompare(b.callerName);
      break;
    case 'status':
      comparison = a.status.localeCompare(b.status);
      break;
    case 'priority':
      comparison = a.priority.localeCompare(b.priority);
      break;
    case 'duration':
      comparison = (a.duration ?? 0) - (b.duration ?? 0);
      break;
    case 'startTime':
      comparison = a.startTime.getTime() - b.startTime.getTime();
      break;
    case 'summary':
      comparison = a.summary.localeCompare(b.summary);
      break;
  }

  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Merges calls from the service with calls added during the current session
 * (from AppContext), deduplicating by id.
 */
function mergeCalls(
  serviceCalls: ReadonlyArray<ICall>,
  sessionCalls: ReadonlyArray<ICall>,
): ReadonlyArray<ICall> {
  const seen = new Set<number>();
  const merged: ICall[] = [];

  // Session calls take priority (more recent state)
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

export function useCallHistory(initialStatusFilter?: CallStatus): IUseCallHistoryResult {
  const { state } = useAppContext();
  const { data: serviceCalls, isLoading, error, refresh } = useSharePointList<ICall>(
    () => callsService.getAll(),
  );

  const [filters, setFilters] = React.useState<ICallHistoryFilters>({
    searchText: '',
    callType: undefined,
    status: initialStatusFilter,
    priority: undefined,
  });

  const [sort, setSort] = React.useState<ICallHistorySort>({
    column: 'startTime',
    direction: 'desc',
  });

  const allCalls = React.useMemo(
    () => mergeCalls(serviceCalls, state.callHistory),
    [serviceCalls, state.callHistory],
  );

  const filteredCalls = React.useMemo(() => {
    let result = [...allCalls];

    if (filters.searchText.length > 0) {
      result = result.filter((call) => matchesSearch(call, filters.searchText));
    }
    if (filters.callType !== undefined) {
      result = result.filter((call) => call.callType === filters.callType);
    }
    if (filters.status !== undefined) {
      result = result.filter((call) => call.status === filters.status);
    }
    if (filters.priority !== undefined) {
      result = result.filter((call) => call.priority === filters.priority);
    }

    result.sort((a, b) => compareCalls(a, b, sort.column, sort.direction));

    return result;
  }, [allCalls, filters, sort]);

  const setSearchText = React.useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, searchText: value }));
  }, []);

  const setCallTypeFilter = React.useCallback((value: CallType | undefined) => {
    setFilters((prev) => ({ ...prev, callType: value }));
  }, []);

  const setStatusFilter = React.useCallback((value: CallStatus | undefined) => {
    setFilters((prev) => ({ ...prev, status: value }));
  }, []);

  const setPriorityFilter = React.useCallback((value: CallPriority | undefined) => {
    setFilters((prev) => ({ ...prev, priority: value }));
  }, []);

  const toggleSort = React.useCallback((column: SortColumn) => {
    setSort((prev) => ({
      column,
      direction: prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return {
    filteredCalls,
    isLoading,
    error,
    refresh,
    filters,
    sort,
    setSearchText,
    setCallTypeFilter,
    setStatusFilter,
    setPriorityFilter,
    toggleSort,
    totalCount: allCalls.length,
  };
}
