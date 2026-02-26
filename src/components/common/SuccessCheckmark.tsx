import * as React from 'react';
import { CheckmarkCircleRegular } from '@fluentui/react-icons';

interface ISuccessCheckmarkProps {
  /** Whether to show the animation */
  readonly visible: boolean;
  /** Called when the animation finishes */
  readonly onComplete?: () => void;
  /** Optional message below the checkmark */
  readonly message?: string;
}

const ANIMATION_DURATION = 1800;

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '24px',
};

const messageStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#10B981',
};

/**
 * Animated checkmark that scales in, holds, then fades out.
 * Keyframes are injected globally by loadAlexandriaFont() in theme.ts.
 */
export const SuccessCheckmark: React.FC<ISuccessCheckmarkProps> = ({
  visible,
  onComplete,
  message = 'Success!',
}) => {
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      onComplete?.();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [visible, onComplete]);

  if (!shouldRender) return null;

  return (
    <div style={containerStyle}>
      <span
        style={{
          display: 'inline-flex',
          color: '#10B981',
          fontSize: '48px',
          animation: 'crc-checkmark-pop 1.8s ease forwards',
        }}
      >
        <CheckmarkCircleRegular />
      </span>
      <span style={{ ...messageStyle, animation: 'crc-checkmark-pop 1.8s ease forwards' }}>
        {message}
      </span>
    </div>
  );
};
