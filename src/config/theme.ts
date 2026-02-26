import {
  createLightTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';

/**
 * CRC Brand Variant ramp — derived from the official CRC palette:
 *   Navy #00204A → Supporting Blue #00459F → Accent Blue #006AF4
 *
 * Shade 30 = CRC Navy, 60 = Supporting Blue, 80 = Accent Blue (primary).
 * Fluent UI maps shade 80 to colorBrandBackground (primary buttons, active states).
 */
const crcBrand: BrandVariants = {
  10: '#001029',
  20: '#001A3D',
  30: '#00204A',
  40: '#002D66',
  50: '#003A82',
  60: '#00459F',
  70: '#0053B8',
  80: '#006AF4',
  90: '#2E82F6',
  100: '#4D94F7',
  110: '#6BA6F9',
  120: '#89B8FA',
  130: '#A7CAFB',
  140: '#C5DCFC',
  150: '#E2EEFD',
  160: '#F0F6FE',
};

/**
 * CRC Light Theme — extends Fluent UI's light theme with CRC brand colors
 * and overrides for the dispatch-specific semantic palette.
 */
const baseCrcTheme = createLightTheme(crcBrand);

export const crcTheme: Theme = {
  ...baseCrcTheme,

  // Surface: Almost White background per CRC brand guidelines
  colorNeutralBackground1: '#F9F9F9',
  colorNeutralBackground2: '#F3F3F3',
  colorNeutralBackground3: '#EDEDEE',

  // Subtle background adjustments for cards on the Almost White surface
  colorNeutralBackground1Hover: '#F0F4F8',
  colorNeutralBackground1Selected: '#E8EDF3',

  // Semantic: Success (completed steps, green timer)
  colorPaletteGreenBackground1: '#ECFDF5',
  colorPaletteGreenBackground2: '#D1FAE5',
  colorPaletteGreenBackground3: '#10B981',
  colorPaletteGreenForeground1: '#10B981',
  colorPaletteGreenForeground2: '#059669',
  colorPaletteGreenForeground3: '#047857',
  colorPaletteGreenBorderActive: '#10B981',

  // Semantic: Warning (yellow timer, medium alerts)
  colorPaletteYellowBackground1: '#FFFBEB',
  colorPaletteYellowBackground2: '#FEF3C7',
  colorPaletteYellowBackground3: '#F59E0B',
  colorPaletteYellowForeground1: '#F59E0B',
  colorPaletteYellowForeground2: '#D97706',
  colorPaletteYellowForeground3: '#B45309',

  // Semantic: Danger (red timer, critical priority, errors)
  colorPaletteRedBackground1: '#FEF2F2',
  colorPaletteRedBackground2: '#FEE2E2',
  colorPaletteRedBackground3: '#EF4444',
  colorPaletteRedForeground1: '#EF4444',
  colorPaletteRedForeground2: '#DC2626',
  colorPaletteRedForeground3: '#B91C1C',
  colorPaletteRedBorderActive: '#EF4444',
};

// ── CRC Design Tokens (non-Fluent) ──────────────────────────────────
// Exported constants for components that need direct color references
// outside of Fluent UI's token system (e.g., custom CSS, inline styles).

export const CRC_COLORS = {
  navy: '#00204A',
  supportingBlue: '#00459F',
  accentBlue: '#006AF4',
  almostWhite: '#F9F9F9',

  success: '#10B981',
  successDark: '#059669',
  warning: '#F59E0B',
  warningDark: '#D97706',
  danger: '#EF4444',
  dangerDark: '#DC2626',

  // Sidebar & header specific
  sidebarBg: '#00204A',
  headerBg: '#00204A',
  sidebarText: '#C5DCFC',
  sidebarTextActive: '#FFFFFF',
  sidebarAccent: '#006AF4',

  // Neutral helpers
  hoverRow: '#F0F4F8',
  borderSubtle: 'rgba(0, 32, 74, 0.08)',
  borderDefault: 'rgba(0, 32, 74, 0.14)',
} as const;

// Timer color thresholds (seconds)
export const TIMER_THRESHOLDS = {
  warningSeconds: 900,  // 15 minutes
  criticalSeconds: 1800, // 30 minutes
} as const;

export const TIMER_COLORS = {
  normal: CRC_COLORS.success,
  warning: CRC_COLORS.warning,
  critical: CRC_COLORS.danger,
} as const;

// Typography — Alexandria for headings, Segoe UI for body (Fluent default)
export const CRC_TYPOGRAPHY = {
  fontFamilyHeading: "'Alexandria', 'Segoe UI', -apple-system, sans-serif",
  fontFamilyBody: "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif",
  fontWeightBold: 700,
  fontWeightRegular: 400,
  fontWeightLight: 300,
} as const;

// ── Font Loader ─────────────────────────────────────────────────────
// SPFx css-loader cannot handle @import url() in SCSS modules,
// so we inject the Google Fonts <link> element at runtime.
const ALEXANDRIA_FONT_ID = 'crc-alexandria-font';
const ALEXANDRIA_URL =
  'https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;700&display=swap';

export function loadAlexandriaFont(): void {
  if (document.getElementById(ALEXANDRIA_FONT_ID)) return;

  const link = document.createElement('link');
  link.id = ALEXANDRIA_FONT_ID;
  link.rel = 'stylesheet';
  link.href = ALEXANDRIA_URL;
  document.head.appendChild(link);

  injectAnimationKeyframes();
}

// ── Global CSS keyframes for micro-interactions ─────────────────────

const CRC_KEYFRAMES_ID = 'crc-animation-keyframes';

function injectAnimationKeyframes(): void {
  if (document.getElementById(CRC_KEYFRAMES_ID)) return;

  const style = document.createElement('style');
  style.id = CRC_KEYFRAMES_ID;
  style.textContent = `
    @keyframes crc-checkmark-pop {
      0% { opacity: 0; transform: scale(0.3); }
      20% { opacity: 1; transform: scale(1.1); }
      35% { transform: scale(1); }
      75% { opacity: 1; transform: scale(1); }
      100% { opacity: 0; transform: scale(0.95); }
    }
    @keyframes crc-pulse-critical {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes crc-slide-in-right {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes crc-fade-in-out {
      0% { opacity: 0; }
      15% { opacity: 1; }
      75% { opacity: 1; }
      100% { opacity: 0; }
    }
    @keyframes crc-chip-slide-in {
      from { opacity: 0; transform: translateX(-8px) scale(0.95); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }
    @keyframes crc-live-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.85; transform: scale(1.05); }
    }
    @keyframes crc-paused-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes crc-button-press {
      0% { transform: scale(1); }
      50% { transform: scale(0.98); }
      100% { transform: scale(1); }
    }

    @keyframes crc-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes crc-slide-in-left {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes crc-dialog-enter {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes crc-card-press {
      0% { transform: scale(1); }
      50% { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes crc-subtle-bounce {
      0% { transform: scale(1); }
      50% { transform: scale(0.97); }
      100% { transform: scale(1); }
    }
    @keyframes crc-expand-in {
      0% { opacity: 0; transform: scaleY(0.95); }
      100% { opacity: 1; transform: scaleY(1); }
    }

    /* Staggered card entrance — applied via inline animation-delay */
    @keyframes crc-card-enter {
      0% { opacity: 0; transform: translateY(12px) scale(0.97); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Step completion celebration */
    @keyframes crc-step-complete {
      0% { transform: scale(1); }
      30% { transform: scale(1.15); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }

    /* Timer glow pulse when running */
    @keyframes crc-timer-glow {
      0%, 100% { text-shadow: 0 0 8px currentColor; }
      50% { text-shadow: 0 0 16px currentColor, 0 0 32px currentColor; }
    }

    /* Sidebar active indicator slide */
    @keyframes crc-indicator-slide {
      from { transform: scaleY(0); opacity: 0; }
      to { transform: scaleY(1); opacity: 1; }
    }

    /* Smooth view transition */
    @keyframes crc-view-enter {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* Stat number count-up feel */
    @keyframes crc-number-pop {
      0% { transform: scale(0.8); opacity: 0; }
      60% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }

    /* Primary button micro-interactions */
    .fui-Button[class*="primary"]:not(:disabled):hover {
      box-shadow: 0 4px 14px rgba(0, 106, 244, 0.35);
      transform: translateY(-1px);
    }
    .fui-Button[class*="primary"]:not(:disabled):active {
      animation: crc-button-press 100ms ease;
      transform: translateY(0);
    }

    /* Outline button hover effect */
    .fui-Button[class*="outline"]:not(:disabled):hover {
      box-shadow: 0 2px 8px rgba(0, 32, 74, 0.08);
    }

    /* Input focus glow */
    .fui-Input:focus-within {
      box-shadow: 0 0 0 2px rgba(0, 106, 244, 0.12);
    }

    /* Table row transition */
    .fui-TableRow {
      transition: background-color 150ms ease, border-left-color 150ms ease;
    }

    /* Card hover lift — utility class injected globally */
    .crc-card-hover {
      transition: box-shadow 200ms ease, transform 200ms ease;
    }
    .crc-card-hover:hover {
      box-shadow: 0 8px 24px rgba(0, 32, 74, 0.12);
      transform: translateY(-2px);
    }
  `;
  document.head.appendChild(style);
}
