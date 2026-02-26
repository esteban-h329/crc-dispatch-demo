import * as React from 'react';
import { CheckmarkRegular } from '@fluentui/react-icons';
import { CRC_TYPOGRAPHY } from '../../config/theme';

interface ISavedIndicatorProps {
  /** Set to true to trigger the animation */
  readonly visible: boolean;
}

const DISPLAY_DURATION = 2000;

const indicatorStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  fontSize: '12px',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
  fontWeight: 500,
  color: '#10B981',
  animation: 'crc-fade-in-out 2s ease forwards',
};

/**
 * "Saved" indicator that fades in, holds 1s, then fades out.
 * Relies on keyframes injected by SuccessCheckmark.
 */
export const SavedIndicator: React.FC<ISavedIndicatorProps> = ({ visible }) => {
  const [shouldRender, setShouldRender] = React.useState(false);
  const [key, setKey] = React.useState(0);

  React.useEffect(() => {
    if (!visible) return;

    setShouldRender(true);
    setKey((prev) => prev + 1);

    const timer = setTimeout(() => {
      setShouldRender(false);
    }, DISPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [visible]);

  if (!shouldRender) return null;

  return (
    <span key={key} style={indicatorStyle}>
      <CheckmarkRegular fontSize={14} />
      Saved
    </span>
  );
};
