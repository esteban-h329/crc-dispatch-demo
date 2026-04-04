import * as React from 'react';
import {
  Body1,
  Caption1,
  Badge,
  Input,
  tokens,
} from '@fluentui/react-components';
import {
  SearchRegular,
  CheckmarkCircleFilled,
  // Call type icons
  BeakerRegular,
  FireRegular,
  HeartPulseRegular,
  WarningRegular,
  PlugDisconnectedRegular,
  CloudFlowRegular,
  VehicleCarRegular,
  ShieldLockRegular,
  WeatherThunderstormRegular,
  ClipboardRegular,
} from '@fluentui/react-icons';
import { CALL_TYPE_CONFIGS, ICallTypeConfig } from '../../config/call-types';
import { CallType, CallPriority } from '../../models';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

// ── Icon map per call type ──────────────────────────────────────────
const CALL_TYPE_ICONS: Record<CallType, React.ReactElement> = {
  [CallType.SpillsReleases]: <BeakerRegular />,
  [CallType.Fire]: <FireRegular />,
  [CallType.InjuryIllness]: <HeartPulseRegular />,
  [CallType.WellRelease]: <WarningRegular />,
  [CallType.LineStrike]: <PlugDisconnectedRegular />,
  [CallType.AirBreakdown]: <CloudFlowRegular />,
  [CallType.MVI]: <VehicleCarRegular />,
  [CallType.SecurityEvent]: <ShieldLockRegular />,
  [CallType.WeatherAlert]: <WeatherThunderstormRegular />,
  [CallType.GeneralOperations]: <ClipboardRegular />,
};

// ── Priority → left border color ────────────────────────────────────
const PRIORITY_BORDER_COLOR: Record<CallPriority, string> = {
  [CallPriority.Critical]: CRC_COLORS.danger,
  [CallPriority.High]: CRC_COLORS.warning,
  [CallPriority.Medium]: CRC_COLORS.accentBlue,
  [CallPriority.Low]: CRC_COLORS.success,
};

function getPriorityBadgeColor(priority: CallPriority): 'danger' | 'severe' | 'informative' | 'success' {
  switch (priority) {
    case CallPriority.Critical: return 'danger';
    case CallPriority.High: return 'severe';
    case CallPriority.Medium: return 'informative';
    case CallPriority.Low: return 'success';
    default: return 'informative';
  }
}

// ── Styles ──────────────────────────────────────────────────────────

const sectionTitle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
  fontSize: '22px',
  color: CRC_COLORS.navy,
  letterSpacing: '-0.02em',
  margin: 0,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: '16px',
};

function cardStyle(borderColor: string, isHovered: boolean, isSelected: boolean, index: number): React.CSSProperties {
  return {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px',
    minHeight: '100px',
    borderRadius: '12px',
    borderTop: `1px solid ${isSelected ? CRC_COLORS.accentBlue : isHovered ? 'rgba(0, 32, 74, 0.2)' : 'rgba(0, 32, 74, 0.1)'}`,
    borderRight: `1px solid ${isSelected ? CRC_COLORS.accentBlue : isHovered ? 'rgba(0, 32, 74, 0.2)' : 'rgba(0, 32, 74, 0.1)'}`,
    borderBottom: `1px solid ${isSelected ? CRC_COLORS.accentBlue : isHovered ? 'rgba(0, 32, 74, 0.2)' : 'rgba(0, 32, 74, 0.1)'}`,
    borderLeft: isSelected
      ? `5px solid ${CRC_COLORS.accentBlue}`
      : `5px solid ${borderColor}`,
    backgroundColor: isSelected ? 'rgba(0, 106, 244, 0.05)' : isHovered ? '#FAFCFF' : '#FFFFFF',
    cursor: 'pointer',
    transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isSelected
      ? `0 0 0 3px rgba(0, 106, 244, 0.12), 0 4px 12px rgba(0, 106, 244, 0.1)`
      : isHovered
        ? '0 12px 32px rgba(0, 32, 74, 0.15), 0 4px 8px rgba(0, 32, 74, 0.08)'
        : '0 2px 8px rgba(0, 32, 74, 0.06)',
    transform: isHovered && !isSelected ? 'translateY(-4px) scale(1.01)' : 'none',
    animation: isSelected
      ? 'crc-card-press 200ms ease'
      : `crc-card-enter 400ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 50}ms both`,
  };
}

const iconContainerStyle = (borderColor: string, isHovered: boolean): React.CSSProperties => ({
  width: '52px',
  height: '52px',
  borderRadius: '14px',
  background: isHovered
    ? `linear-gradient(135deg, ${borderColor}25, ${borderColor}12)`
    : `linear-gradient(135deg, ${borderColor}15, ${borderColor}08)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: borderColor,
  fontSize: '28px',
  flexShrink: 0,
  transition: 'all 280ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: isHovered ? 'scale(1.12) rotate(-3deg)' : 'scale(1)',
  boxShadow: isHovered ? `0 4px 12px ${borderColor}20` : 'none',
});

const cardContentStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const cardLabelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '14px',
  margin: 0,
  lineHeight: 1.3,
};

const cardDescStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  color: tokens.colorNeutralForeground3,
  margin: '6px 0 0',
  lineHeight: 1.5,
};

const selectedCheckStyle: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  color: CRC_COLORS.accentBlue,
  fontSize: '18px',
};

// ── Component ───────────────────────────────────────────────────────

interface ICallTypeSelectorProps {
  readonly onSelect: (config: ICallTypeConfig) => void;
}

export const CallTypeSelector: React.FC<ICallTypeSelectorProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [hoveredType, setHoveredType] = React.useState<CallType | undefined>(undefined);
  const [selectedType, setSelectedType] = React.useState<CallType | undefined>(undefined);

  const filteredConfigs = React.useMemo(() => {
    if (searchQuery.trim() === '') return CALL_TYPE_CONFIGS;
    const query = searchQuery.toLowerCase();
    return CALL_TYPE_CONFIGS.filter(
      (config) =>
        config.label.toLowerCase().includes(query) ||
        config.description.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleSelect = React.useCallback(
    (config: ICallTypeConfig) => {
      setSelectedType(config.type);
      // Brief delay so the user sees the selected state before transitioning
      setTimeout(() => onSelect(config), 200);
    },
    [onSelect],
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={sectionTitle}>Select Call Type</h2>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: '16px', maxWidth: '400px' }}>
        <Input
          contentBefore={<SearchRegular />}
          placeholder="Search call type..."
          value={searchQuery}
          onChange={(_e, data) => setSearchQuery(data.value)}
          style={{ width: '100%' }}
          appearance="outline"
          size="medium"
        />
      </div>

      {/* Cards grid */}
      <div style={gridStyle}>
        {filteredConfigs.map((config, index) => {
          const borderColor = PRIORITY_BORDER_COLOR[config.defaultPriority];
          const isHovered = hoveredType === config.type;
          const isSelected = selectedType === config.type;

          return (
            <div
              key={config.type}
              role="button"
              tabIndex={0}
              style={cardStyle(borderColor, isHovered, isSelected, index)}
              onClick={() => handleSelect(config)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(config);
                }
              }}
              onMouseEnter={() => setHoveredType(config.type)}
              onMouseLeave={() => setHoveredType(undefined)}
            >
              {/* Icon */}
              <div style={iconContainerStyle(borderColor, isHovered)}>
                {CALL_TYPE_ICONS[config.type]}
              </div>

              {/* Content */}
              <div style={cardContentStyle}>
                <Body1 style={cardLabelStyle}>{config.label}</Body1>
                <Caption1 style={cardDescStyle}>{config.description}</Caption1>
              </div>

              {/* Priority badge */}
              <Badge
                appearance="tint"
                color={getPriorityBadgeColor(config.defaultPriority)}
                size="small"
              >
                {config.defaultPriority}
              </Badge>

              {/* Selected checkmark */}
              {isSelected && (
                <span style={selectedCheckStyle}>
                  <CheckmarkCircleFilled />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredConfigs.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 48px' }}>
          <SearchRegular style={{ fontSize: '40px', color: CRC_COLORS.borderDefault, marginBottom: '12px' }} />
          <Body1 style={{ display: 'block', fontWeight: 600, color: tokens.colorNeutralForeground2 }}>
            No call types match your search
          </Body1>
          <Body1 style={{ display: 'block', fontSize: '12px', color: tokens.colorNeutralForeground3, marginTop: '4px' }}>
            Try a different keyword for &quot;{searchQuery}&quot;
          </Body1>
        </div>
      )}
    </div>
  );
};
