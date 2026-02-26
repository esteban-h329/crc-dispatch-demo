import * as React from 'react';
import {
  Body1,
  Caption1,
} from '@fluentui/react-components';
import {
  CallRegular,
  CallFilled,
  HistoryRegular,
  HistoryFilled,
  DataBarVerticalRegular,
  DataBarVerticalFilled,
  PersonRegular,
  CircleSmallFilled,
} from '@fluentui/react-icons';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

export type ViewTab = 'new-call' | 'history' | 'dashboard';

interface ISidebarProps {
  readonly activeView: ViewTab;
  readonly onNavigate: (view: ViewTab) => void;
  readonly dispatcherName: string;
}

interface INavItem {
  readonly key: ViewTab;
  readonly label: string;
  readonly icon: React.ReactElement;
  readonly activeIcon: React.ReactElement;
}

const NAV_ITEMS: ReadonlyArray<INavItem> = [
  {
    key: 'new-call',
    label: 'New Call',
    icon: <CallRegular />,
    activeIcon: <CallFilled />,
  },
  {
    key: 'history',
    label: 'Call History',
    icon: <HistoryRegular />,
    activeIcon: <HistoryFilled />,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DataBarVerticalRegular />,
    activeIcon: <DataBarVerticalFilled />,
  },
];

const SIDEBAR_WIDTH = 220;

const styles = {
  sidebar: {
    width: SIDEBAR_WIDTH,
    minWidth: SIDEBAR_WIDTH,
    background: `linear-gradient(180deg, #001636 0%, ${CRC_COLORS.sidebarBg} 35%, #00152E 100%)`,
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100vh',
    position: 'fixed' as const,
    left: 0,
    top: 0,
    zIndex: 100,
    borderRight: '1px solid rgba(0, 106, 244, 0.1)',
  },
  logo: {
    padding: '24px 20px 20px',
    borderBottom: `1px solid rgba(255, 255, 255, 0.06)`,
  },
  logoText: {
    fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
    fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
    fontSize: '20px',
    color: CRC_COLORS.sidebarTextActive,
    letterSpacing: '0.02em',
    margin: 0,
  },
  logoSubtext: {
    fontSize: '10px',
    color: CRC_COLORS.sidebarText,
    opacity: 0.6,
    marginTop: '3px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  nav: {
    flex: 1,
    padding: '16px 0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  navItem: (isActive: boolean): React.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '11px 20px',
    margin: '0 8px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: isActive ? CRC_COLORS.sidebarTextActive : CRC_COLORS.sidebarText,
    backgroundColor: isActive ? 'rgba(0, 106, 244, 0.25)' : 'transparent',
    fontSize: '14px',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 200ms ease',
    border: 'none',
    outline: 'none',
    width: `calc(100% - 16px)`,
    textAlign: 'left',
    fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
    borderLeft: isActive ? `4px solid ${CRC_COLORS.accentBlue}` : '4px solid transparent',
    boxShadow: isActive ? '0 2px 12px rgba(0, 106, 244, 0.25), inset 0 0 12px rgba(0, 106, 244, 0.06)' : 'none',
  }),
  navIcon: {
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    width: '20px',
    height: '20px',
    flexShrink: 0,
  },
  userSection: {
    padding: '16px 20px',
    borderTop: `1px solid rgba(255, 255, 255, 0.06)`,
    display: 'flex',
    alignItems: 'center' as const,
    gap: '10px',
    background: 'rgba(0, 16, 41, 0.3)',
  },
  userAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${CRC_COLORS.supportingBlue}, ${CRC_COLORS.accentBlue})`,
    display: 'flex',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    color: CRC_COLORS.sidebarTextActive,
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0, 106, 244, 0.25)',
  },
  userInfo: {
    overflow: 'hidden' as const,
    flex: 1,
  },
  userName: {
    color: CRC_COLORS.sidebarTextActive,
    fontSize: '13px',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
    display: 'block',
    letterSpacing: '0.01em',
  },
  userStatus: {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '4px',
    color: CRC_COLORS.success,
    fontSize: '11px',
  },
} as const;

export const Sidebar: React.FC<ISidebarProps> = ({
  activeView,
  onNavigate,
  dispatcherName,
}) => {
  return (
    <div style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logo}>
        <div style={styles.logoText}>CRC</div>
        <div style={styles.logoSubtext}>Dispatch Center</div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive = activeView === item.key;
          return (
              <button
                key={item.key}
                style={styles.navItem(isActive)}
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? 'page' : undefined}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 69, 159, 0.25)';
                    e.currentTarget.style.borderLeftColor = 'rgba(0, 106, 244, 0.4)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderLeftColor = 'transparent';
                    e.currentTarget.style.transform = 'none';
                  }
                }}
              >
                <span style={styles.navIcon}>
                  {isActive ? item.activeIcon : item.icon}
                </span>
                {item.label}
              </button>
          );
        })}
      </nav>

      {/* User Info */}
      <div style={styles.userSection}>
        <div style={styles.userAvatar}>
          <PersonRegular />
        </div>
        <div style={styles.userInfo}>
          <Body1 style={styles.userName}>{dispatcherName}</Body1>
          <div style={styles.userStatus}>
            <CircleSmallFilled />
            <Caption1 style={{ color: 'inherit' }}>Online</Caption1>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SIDEBAR_WIDTH };
