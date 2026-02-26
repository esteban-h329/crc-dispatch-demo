import * as React from 'react';
import {
  Input,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import {
  SearchRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import { CallType, CallStatus, CallPriority } from '../../models';
import { ICallHistoryFilters } from './use-call-history';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface ICallHistoryFiltersProps {
  readonly filters: ICallHistoryFilters;
  readonly onSearchTextChange: (value: string) => void;
  readonly onCallTypeChange: (value: CallType | undefined) => void;
  readonly onStatusChange: (value: CallStatus | undefined) => void;
  readonly onPriorityChange: (value: CallPriority | undefined) => void;
  readonly totalCount: number;
  readonly filteredCount: number;
}

const ALL_OPTION = '__all__';

const callTypeOptions = Object.values(CallType);
const statusOptions = Object.values(CallStatus);
const priorityOptions = Object.values(CallPriority);

// ── Styles ──────────────────────────────────────────────────────────

const filterBarStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
};

const chipStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '2px 8px 2px 10px',
  borderRadius: '12px',
  backgroundColor: 'rgba(0, 106, 244, 0.08)',
  color: CRC_COLORS.accentBlue,
  fontSize: '12px',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
  fontWeight: 500,
  lineHeight: '20px',
  animation: 'crc-chip-slide-in 200ms ease',
};

const chipDismissStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: 'transparent',
  color: CRC_COLORS.accentBlue,
  cursor: 'pointer',
  padding: 0,
  fontSize: '12px',
};

const countTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'rgba(0, 32, 74, 0.5)',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
};

// ── Component ───────────────────────────────────────────────────────

export const CallHistoryFilters: React.FC<ICallHistoryFiltersProps> = ({
  filters,
  onSearchTextChange,
  onCallTypeChange,
  onStatusChange,
  onPriorityChange,
  totalCount,
  filteredCount,
}) => {
  // Debounced search — immediate local state, debounced parent callback
  const [localSearch, setLocalSearch] = React.useState(filters.searchText);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = React.useCallback(
    (_event: React.ChangeEvent<HTMLInputElement>) => {
      const value = _event.target.value;
      setLocalSearch(value);

      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearchTextChange(value);
      }, 300);
    },
    [onSearchTextChange],
  );

  React.useEffect(() => {
    return () => {
      if (debounceRef.current !== null) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleCallTypeSelect = React.useCallback(
    (_event: unknown, data: { optionValue?: string }) => {
      const value = data.optionValue;
      onCallTypeChange(value === ALL_OPTION ? undefined : (value as CallType));
    },
    [onCallTypeChange],
  );

  const handleStatusSelect = React.useCallback(
    (_event: unknown, data: { optionValue?: string }) => {
      const value = data.optionValue;
      onStatusChange(value === ALL_OPTION ? undefined : (value as CallStatus));
    },
    [onStatusChange],
  );

  const handlePrioritySelect = React.useCallback(
    (_event: unknown, data: { optionValue?: string }) => {
      const value = data.optionValue;
      onPriorityChange(value === ALL_OPTION ? undefined : (value as CallPriority));
    },
    [onPriorityChange],
  );

  const hasActiveFilters =
    filters.searchText.length > 0 ||
    filters.callType !== undefined ||
    filters.status !== undefined ||
    filters.priority !== undefined;

  // Build active filter chips
  const chips: Array<{ label: string; onDismiss: () => void }> = [];
  if (filters.callType !== undefined) {
    chips.push({ label: `Type: ${filters.callType}`, onDismiss: () => onCallTypeChange(undefined) });
  }
  if (filters.status !== undefined) {
    chips.push({ label: `Status: ${filters.status}`, onDismiss: () => onStatusChange(undefined) });
  }
  if (filters.priority !== undefined) {
    chips.push({ label: `Priority: ${filters.priority}`, onDismiss: () => onPriorityChange(undefined) });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Search + inline dropdowns */}
      <div style={filterBarStyle}>
        <Input
          placeholder="Search calls..."
          contentBefore={<SearchRegular />}
          value={localSearch}
          onChange={handleSearchChange}
          style={{ minWidth: '220px', flex: 1, maxWidth: '360px' }}
          appearance="outline"
          size="medium"
        />
        <Dropdown
          placeholder="All Types"
          value={filters.callType ?? ''}
          onOptionSelect={handleCallTypeSelect}
          style={{ minWidth: '160px' }}
          size="medium"
        >
          <Option value={ALL_OPTION}>All Types</Option>
          {callTypeOptions.map((type) => (
            <Option key={type} value={type}>{type}</Option>
          ))}
        </Dropdown>
        <Dropdown
          placeholder="All Statuses"
          value={filters.status ?? ''}
          onOptionSelect={handleStatusSelect}
          style={{ minWidth: '140px' }}
          size="medium"
        >
          <Option value={ALL_OPTION}>All Statuses</Option>
          {statusOptions.map((status) => (
            <Option key={status} value={status}>{status}</Option>
          ))}
        </Dropdown>
        <Dropdown
          placeholder="All Priorities"
          value={filters.priority ?? ''}
          onOptionSelect={handlePrioritySelect}
          style={{ minWidth: '140px' }}
          size="medium"
        >
          <Option value={ALL_OPTION}>All Priorities</Option>
          {priorityOptions.map((priority) => (
            <Option key={priority} value={priority}>{priority}</Option>
          ))}
        </Dropdown>
      </div>

      {/* Active filter chips + count */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {chips.map((chip) => (
            <span key={chip.label} style={chipStyle}>
              {chip.label}
              <button
                style={chipDismissStyle}
                onClick={chip.onDismiss}
                aria-label={`Remove filter: ${chip.label}`}
              >
                <DismissRegular />
              </button>
            </span>
          ))}
          <span style={countTextStyle}>
            Showing {filteredCount} of {totalCount}
          </span>
        </div>
      )}
    </div>
  );
};
