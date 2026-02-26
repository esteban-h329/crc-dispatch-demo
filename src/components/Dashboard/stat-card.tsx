import * as React from 'react';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface IStatCardProps {
  readonly value: string | number;
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly accentColor: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

const cardBase: React.CSSProperties = {
  flex: 1,
  minWidth: '160px',
  padding: '22px',
  borderRadius: '14px',
  backgroundColor: '#ffffff',
  border: `1px solid ${CRC_COLORS.borderSubtle}`,
  borderTopWidth: '4px',
  cursor: 'default',
  transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1), transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const StatCard: React.FC<IStatCardProps> = ({ value, label, icon, accentColor, actionLabel, onAction }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const style: React.CSSProperties = {
    ...cardBase,
    borderTopColor: accentColor,
    background: `linear-gradient(145deg, #ffffff 40%, ${accentColor}0A 100%)`,
    boxShadow: isHovered
      ? `0 12px 28px rgba(0, 32, 74, 0.12), 0 0 0 1px ${accentColor}20`
      : '0 2px 8px rgba(0, 32, 74, 0.06)',
    transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'none',
  };

  return (
    <div
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <span
          style={{
            color: accentColor,
            fontSize: '22px',
            display: 'flex',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: `${accentColor}10`,
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
            fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
            fontSize: '36px',
            lineHeight: 1,
            color: accentColor,
            letterSpacing: '-0.03em',
            animation: 'crc-number-pop 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {value}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span
          style={{
            fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
            fontSize: '12px',
            fontWeight: 500,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'rgba(0, 32, 74, 0.5)',
          }}
        >
          {label}
        </span>
        {actionLabel && onAction && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction();
            }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
              fontSize: '11px',
              fontWeight: 600,
              color: CRC_COLORS.accentBlue,
              letterSpacing: '0.01em',
              transition: 'opacity 150ms ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            {actionLabel} &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
