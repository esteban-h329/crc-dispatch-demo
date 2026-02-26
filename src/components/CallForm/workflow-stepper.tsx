import * as React from 'react';
import { Caption1 } from '@fluentui/react-components';
import { PersonRegular } from '@fluentui/react-icons';
import { IWorkflowStepDefinition, StepStatus } from '../../models';
import { StepStatusIndicator, INDICATOR_SIZE } from './step-status-indicator';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface IWorkflowStepperProps {
  readonly steps: ReadonlyArray<IWorkflowStepDefinition>;
  readonly activeStepIndex: number;
  readonly stepStatuses: ReadonlyArray<StepStatus>;
  readonly onStepSelect: (index: number) => void;
  readonly isCallerInfoActive?: boolean;
  readonly onCallerInfoSelect?: () => void;
}

const STEPPER_WIDTH = 220;

// Vertical connector line between step indicators
const connectorStyle = (isCompleted: boolean, isActive: boolean): React.CSSProperties => ({
  height: '2px',
  borderRadius: '2px',
  flex: 1,
  background: isCompleted
    ? `linear-gradient(to right, ${CRC_COLORS.success}, ${CRC_COLORS.successDark})`
    : isActive
      ? `linear-gradient(to right, ${CRC_COLORS.accentBlue}, rgba(0, 106, 244, 0.15))`
      : 'rgba(0, 32, 74, 0.08)',
  transition: 'background 300ms ease',
});

function stepItemStyle(isActive: boolean, isHovered: boolean, status: StepStatus): React.CSSProperties {
  const borderColor = status === StepStatus.Completed
    ? CRC_COLORS.success
    : isActive
      ? CRC_COLORS.accentBlue
      : 'transparent';

  return {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: isActive
      ? 'rgba(0, 106, 244, 0.07)'
      : isHovered
        ? 'rgba(0, 32, 74, 0.04)'
        : 'transparent',
    transition: 'all 200ms ease',
    border: 'none',
    outline: 'none',
    width: '100%',
    textAlign: 'left' as const,
    borderLeft: `2px solid ${borderColor}`,
    transform: isHovered && !isActive ? 'translateX(2px)' : 'none',
  };
}

const stepLabelStyle = (isActive: boolean, status: StepStatus): React.CSSProperties => ({
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: isActive ? 600 : 400,
  fontSize: '13px',
  color: status === StepStatus.Completed
    ? CRC_COLORS.successDark
    : isActive
      ? CRC_COLORS.accentBlue
      : 'rgba(0, 32, 74, 0.7)',
  lineHeight: 1.3,
  whiteSpace: 'normal' as const,
  wordBreak: 'break-word' as const,
});

const requiredDot: React.CSSProperties = {
  display: 'inline-block',
  width: '4px',
  height: '4px',
  borderRadius: '50%',
  backgroundColor: CRC_COLORS.danger,
  marginLeft: '4px',
  verticalAlign: 'middle',
};

export const WorkflowStepper: React.FC<IWorkflowStepperProps> = ({
  steps,
  activeStepIndex,
  stepStatuses,
  onStepSelect,
  isCallerInfoActive = false,
  onCallerInfoSelect,
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | undefined>(undefined);
  const [callerInfoHovered, setCallerInfoHovered] = React.useState(false);

  return (
    <nav
      style={{
        width: STEPPER_WIDTH,
        minWidth: STEPPER_WIDTH,
        display: 'flex',
        flexDirection: 'column',
        paddingRight: '16px',
        borderRight: `1px solid ${CRC_COLORS.borderSubtle}`,
      }}
      aria-label="Workflow steps"
    >
      {/* Caller Information entry — always completed since the form was filled */}
      {onCallerInfoSelect && (
        <>
          <button
            style={stepItemStyle(isCallerInfoActive, callerInfoHovered, StepStatus.Completed)}
            onClick={onCallerInfoSelect}
            onMouseEnter={() => setCallerInfoHovered(true)}
            onMouseLeave={() => setCallerInfoHovered(false)}
            aria-current={isCallerInfoActive ? 'step' : undefined}
          >
            <div
              style={{
                width: INDICATOR_SIZE,
                height: INDICATOR_SIZE,
                borderRadius: '50%',
                backgroundColor: isCallerInfoActive ? CRC_COLORS.accentBlue : CRC_COLORS.success,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '12px',
                flexShrink: 0,
              }}
            >
              <PersonRegular />
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={stepLabelStyle(isCallerInfoActive, StepStatus.Completed)}>
                Caller Information
              </div>
            </div>
          </button>
          <div
            style={{
              display: 'flex',
              paddingLeft: `${10 + INDICATOR_SIZE + 10}px`,
              paddingRight: '10px',
              margin: '5px 0',
            }}
          >
            <div style={connectorStyle(true, false)} />
          </div>
        </>
      )}

      {steps.map((step, index) => {
        const isActive = index === activeStepIndex;
        const isHovered = hoveredIndex === index;
        const isLast = index === steps.length - 1;
        const status = stepStatuses[index];

        return (
          <React.Fragment key={step.stepNumber}>
            {/* Step row */}
            <button
              style={stepItemStyle(isActive, isHovered, status)}
              onClick={() => onStepSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(undefined)}
              aria-current={isActive ? 'step' : undefined}
            >
              <StepStatusIndicator
                status={status}
                stepNumber={step.stepNumber}
                isActive={isActive}
              />
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={stepLabelStyle(isActive, status)}>
                  {step.title}
                  {step.isRequired && status === StepStatus.Pending && (
                    <span style={requiredDot} title="Required" />
                  )}
                </div>
                {isActive && (
                  <Caption1
                    style={{
                      display: 'block',
                      color: 'rgba(0, 32, 74, 0.5)',
                      fontSize: '11px',
                      marginTop: '1px',
                    }}
                  >
                    {step.isRequired ? 'Required' : 'Optional'}
                  </Caption1>
                )}
              </div>
            </button>

            {/* Connector line */}
            {!isLast && (
              <div
                style={{
                  display: 'flex',
                  paddingLeft: `${10 + INDICATOR_SIZE + 10}px`,
                  paddingRight: '10px',
                  margin: '5px 0',
                }}
              >
                <div style={connectorStyle(status === StepStatus.Completed, isActive)} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export { STEPPER_WIDTH };
