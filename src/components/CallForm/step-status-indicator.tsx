import * as React from 'react';
import {
  CheckmarkRegular,
  ArrowRightRegular,
} from '@fluentui/react-icons';
import { StepStatus } from '../../models';
import { CRC_COLORS } from '../../config/theme';

interface IStepStatusIndicatorProps {
  readonly status: StepStatus;
  readonly stepNumber: number;
  readonly isActive: boolean;
}

const INDICATOR_SIZE = 28;

const baseCircle: React.CSSProperties = {
  width: INDICATOR_SIZE,
  height: INDICATOR_SIZE,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 600,
  flexShrink: 0,
  transition: 'all 200ms ease',
};

export const StepStatusIndicator: React.FC<IStepStatusIndicatorProps> = ({
  status,
  stepNumber,
  isActive,
}) => {
  if (status === StepStatus.Completed) {
    return (
      <div
        style={{
          ...baseCircle,
          background: `linear-gradient(135deg, ${CRC_COLORS.success}, ${CRC_COLORS.successDark})`,
          color: '#FFFFFF',
          boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)',
          animation: 'crc-step-complete 400ms ease',
        }}
      >
        <CheckmarkRegular style={{ fontSize: '14px' }} />
      </div>
    );
  }

  if (status === StepStatus.Skipped) {
    return (
      <div
        style={{
          ...baseCircle,
          backgroundColor: 'rgba(0, 32, 74, 0.06)',
          color: 'rgba(0, 32, 74, 0.35)',
          border: '1px dashed rgba(0, 32, 74, 0.15)',
        }}
      >
        <ArrowRightRegular style={{ fontSize: '14px' }} />
      </div>
    );
  }

  // Pending — active vs inactive
  if (isActive) {
    return (
      <div
        style={{
          ...baseCircle,
          background: `linear-gradient(135deg, ${CRC_COLORS.accentBlue}, #0053B8)`,
          color: '#FFFFFF',
          boxShadow: '0 0 0 4px rgba(0, 106, 244, 0.15), 0 2px 8px rgba(0, 106, 244, 0.25)',
        }}
      >
        {stepNumber}
      </div>
    );
  }

  return (
    <div
      style={{
        ...baseCircle,
        backgroundColor: 'rgba(0, 32, 74, 0.03)',
        border: '2px solid rgba(0, 32, 74, 0.15)',
        color: 'rgba(0, 32, 74, 0.4)',
      }}
    >
      {stepNumber}
    </div>
  );
};

export { INDICATOR_SIZE };
