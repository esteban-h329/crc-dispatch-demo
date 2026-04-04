import * as React from 'react';
import {
  Card,
  Title2,
  Body1,
  Button,
  Input,
  tokens,
} from '@fluentui/react-components';
import { AddRegular, ArrowEnterLeftRegular, TimerRegular, PersonRegular, CallRegular } from '@fluentui/react-icons';
import { useCallFormWorkflow } from './use-call-form-workflow';
import { CallTypeSelector } from './call-type-selector';
import { WorkflowStepper } from './workflow-stepper';
import { StepForm } from './step-form';
import { CallFormActions } from './call-form-actions';
import { QuickNotesPanel } from './quick-notes-panel';
import { StepStatus } from '../../models';
import { useAppContext } from '../../context/AppContext';
import type { ICallTimerResult } from '../../hooks/useCallTimer';
import { MiniTimer } from '../Timer/MiniTimer';
import { SuccessCheckmark } from '../common/SuccessCheckmark';
import { SavedIndicator } from '../common/SavedIndicator';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';
import { useRegulatoryTimer } from '../../hooks/useRegulatoryTimer';
import { RegulatoryTimerBanner } from '../Timer/RegulatoryTimerBanner';

// Per-call timer storage — persists across re-renders and re-mounts
const parkedTimerMap = new Map<number, number>();

// Per-call regulatory timer storage — saves startedAt + config for live countdown while parked
interface IParkedRegTimer {
  readonly startedAt: number;
  readonly totalSeconds: number;
  readonly label: string;
}
const parkedRegTimerMap = new Map<number, IParkedRegTimer>();

/**
 * Live countdown from a parked regulatory timer.
 * Ticks every second using the absolute startedAt timestamp.
 */
function useParkedRegCountdown(callId: number | undefined): {
  remaining: number;
  total: number;
  label: string;
  formatted: string;
  isExpired: boolean;
} | undefined {
  const entry = callId !== undefined ? parkedRegTimerMap.get(callId) : undefined;
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!entry) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [entry]);

  if (!entry) return undefined;

  // Suppress unused-var lint — tick drives re-renders
  void tick;

  const elapsed = Math.floor((Date.now() - entry.startedAt) / 1000);
  const remaining = Math.max(0, entry.totalSeconds - elapsed);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  return {
    remaining,
    total: entry.totalSeconds,
    label: entry.label,
    formatted: `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`,
    isExpired: remaining <= 0,
  };
}

export interface ICallFormProps {
  readonly onCallStarted?: () => void;
  readonly onCallEnded?: () => void;
  readonly timer?: ICallTimerResult;
  readonly resumeCallId?: number;
  readonly onResumeConsumed?: () => void;
}

export const CallForm: React.FC<ICallFormProps> = ({ onCallStarted, onCallEnded, timer, resumeCallId, onResumeConsumed }) => {
  const { state } = useAppContext();
  const workflow = useCallFormWorkflow(onCallStarted, onCallEnded);
  const prevStepRef = React.useRef(workflow.activeStepIndex);

  // Regulatory timer — countdown for notification deadlines
  const regTimerConfig = workflow.selectedCallType?.regulatoryTimer;
  const regulatoryTimer = useRegulatoryTimer(
    regTimerConfig?.durationMinutes ?? 30,
    regTimerConfig?.label ?? '',
  );

  // Live countdown for parked regulatory timer (shown in "on hold" banner)
  const parkedRegCountdown = useParkedRegCountdown(state.activeCall?.id);

  // Activate regulatory timer when trigger condition is met
  React.useEffect(() => {
    if (!regTimerConfig || regulatoryTimer.isActive) return;

    // Special case: always-on timer (Air Breakdown)
    if (regTimerConfig.triggerField === '_always' && workflow.callPhase === 'workflow-steps') {
      // Restore from parked map if available (preserves countdown across park/resume)
      if (workflow.callId !== undefined && parkedRegTimerMap.has(workflow.callId)) {
        const saved = parkedRegTimerMap.get(workflow.callId)!;
        regulatoryTimer.startFrom(saved.startedAt);
        parkedRegTimerMap.delete(workflow.callId);
      } else {
        regulatoryTimer.startTimer();
      }
      return;
    }

    const triggerData = workflow.stepDataMap[regTimerConfig.triggerStep];
    if (!triggerData) return;

    const fieldValue = String(triggerData[regTimerConfig.triggerField] ?? '');
    const matches = Array.isArray(regTimerConfig.triggerValue)
      ? regTimerConfig.triggerValue.includes(fieldValue)
      : fieldValue === regTimerConfig.triggerValue;

    if (matches) {
      // Restore from parked map if available (preserves countdown across park/resume)
      if (workflow.callId !== undefined && parkedRegTimerMap.has(workflow.callId)) {
        const saved = parkedRegTimerMap.get(workflow.callId)!;
        regulatoryTimer.startFrom(saved.startedAt);
        parkedRegTimerMap.delete(workflow.callId);
      } else {
        regulatoryTimer.startTimer();
      }
    }
  }, [workflow.stepDataMap, workflow.callPhase, workflow.callId, regTimerConfig]); // eslint-disable-line react-hooks/exhaustive-deps

  // Save timers to per-call maps on unmount (handles navigation between tabs)
  const callIdRef = React.useRef(workflow.callId);
  const timerRef = React.useRef(timer);
  const regTimerRef = React.useRef(regulatoryTimer);
  callIdRef.current = workflow.callId;
  timerRef.current = timer;
  regTimerRef.current = regulatoryTimer;
  React.useEffect(() => {
    return () => {
      const currentCallId = callIdRef.current;
      const currentTimer = timerRef.current;
      const currentRegTimer = regTimerRef.current;
      if (currentCallId !== undefined && currentTimer && currentTimer.elapsedSeconds > 0) {
        parkedTimerMap.set(currentCallId, currentTimer.elapsedSeconds);
      }
      if (currentCallId !== undefined && currentRegTimer.isActive && currentRegTimer.startedAt !== undefined) {
        parkedRegTimerMap.set(currentCallId, {
          startedAt: currentRegTimer.startedAt,
          totalSeconds: currentRegTimer.totalSeconds,
          label: currentRegTimer.label,
        });
      }
    };
  }, []);

  // Track auto-save events from the workflow hook
  const [showSaved, setShowSaved] = React.useState(false);
  React.useEffect(() => {
    if (workflow.lastAutoSavedAt === 0) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 100);
    return () => clearTimeout(t);
  }, [workflow.lastAutoSavedAt]);

  // Resume a specific call when requested (from header or call history)
  React.useEffect(() => {
    if (resumeCallId === undefined) return;

    workflow.resumeCall(resumeCallId)
      .then((result) => {
        if (result && timer) {
          const savedSeconds = parkedTimerMap.get(resumeCallId);
          if (savedSeconds !== undefined) {
            // Restore timer from where it was paused for this specific call
            timer.startFrom(savedSeconds);
          } else if (result.duration !== undefined) {
            // Resuming a completed call for editing — start from saved active duration
            timer.startFrom(result.duration);
          } else {
            // Fresh resume (active call with no parked timer), calculate from startTime
            const elapsedSeconds = Math.round(
              (Date.now() - result.startTime.getTime()) / 1000,
            );
            timer.startFrom(elapsedSeconds);
          }
        }
        // Regulatory timer restoration is handled by the trigger effect
        // Clear the resume request so it doesn't re-trigger
        onResumeConsumed?.();
      })
      .catch(() => {
        // Error handled in workflow hook
      });
  }, [resumeCallId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track step changes for slide animation
  React.useEffect(() => {
    prevStepRef.current = workflow.activeStepIndex;
  }, [workflow.activeStepIndex]);

  // Check if all required steps are completed
  const allRequiredDone = React.useMemo(() => {
    if (workflow.selectedCallType === undefined) return false;
    return workflow.selectedCallType.steps.every((step, index) => {
      if (!step.isRequired) return true;
      return workflow.stepStatuses[index] !== StepStatus.Pending;
    });
  }, [workflow.selectedCallType, workflow.stepStatuses]);

  const activeStep = workflow.steps[workflow.activeStepIndex];

  return (
    <Card style={{ padding: tokens.spacingVerticalL }}>
      {state.error && (
        <Body1
          style={{
            color: tokens.colorPaletteRedForeground1,
            marginBottom: tokens.spacingVerticalM,
            display: 'block',
          }}
        >
          {state.error}
        </Body1>
      )}

      {/* Banner: active call on hold — resume or start new */}
      {workflow.callPhase === 'type-selection' && state.activeCall && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            marginBottom: tokens.spacingVerticalM,
            borderRadius: '8px',
            border: `1px solid ${parkedRegCountdown ? (parkedRegCountdown.isExpired ? CRC_COLORS.danger : CRC_COLORS.warning) : CRC_COLORS.accentBlue}30`,
            backgroundColor: `${CRC_COLORS.accentBlue}08`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: CRC_COLORS.accentBlue,
                  animation: 'crc-pulse-critical 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
                  fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
                  fontSize: '14px',
                  color: CRC_COLORS.navy,
                }}
              >
                Active call on hold: {state.activeCall.callType}
              </span>
            </div>
            <Button
              appearance="primary"
              icon={<ArrowEnterLeftRegular />}
              size="small"
              onClick={() => {
                const callIdToResume = state.activeCall!.id;
                workflow.resumeCall(callIdToResume)
                  .then((result) => {
                    if (result && timer) {
                      const savedSeconds = parkedTimerMap.get(callIdToResume);
                      if (savedSeconds !== undefined) {
                        timer.startFrom(savedSeconds);
                      } else if (result.duration !== undefined) {
                        timer.startFrom(result.duration);
                      } else {
                        const elapsedSeconds = Math.round(
                          (Date.now() - result.startTime.getTime()) / 1000,
                        );
                        timer.startFrom(elapsedSeconds);
                      }
                    }
                    // Regulatory timer restoration is handled by the trigger effect
                  })
                  .catch(() => {
                    // Error handled in workflow hook
                  });
              }}
            >
              Resume Call
            </Button>
          </div>
          {/* Live regulatory countdown while call is parked */}
          {parkedRegCountdown && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                backgroundColor: parkedRegCountdown.isExpired
                  ? `${CRC_COLORS.danger}15`
                  : parkedRegCountdown.remaining <= parkedRegCountdown.total * 0.25
                    ? `${CRC_COLORS.danger}10`
                    : `${CRC_COLORS.warning}10`,
                borderTop: `1px solid ${parkedRegCountdown.isExpired ? CRC_COLORS.danger : CRC_COLORS.warning}30`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TimerRegular style={{ fontSize: '16px', color: parkedRegCountdown.isExpired ? CRC_COLORS.danger : CRC_COLORS.warning }} />
                <span
                  style={{
                    fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
                    fontWeight: 600,
                    fontSize: '13px',
                    color: parkedRegCountdown.isExpired ? CRC_COLORS.danger : '#92400E',
                  }}
                >
                  {parkedRegCountdown.isExpired
                    ? `EXPIRED — ${parkedRegCountdown.label} notification deadline`
                    : `${parkedRegCountdown.label} — notification deadline`}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: parkedRegCountdown.isExpired ? CRC_COLORS.danger : '#92400E',
                  letterSpacing: '0.05em',
                }}
              >
                {parkedRegCountdown.formatted}
              </span>
            </div>
          )}
        </div>
      )}

      {workflow.callPhase === 'type-selection' && (() => {
        const hasCallerInfo = workflow.callerInfo.contactPhone.trim().length > 0 || workflow.callerInfo.callerName.trim().length > 0;
        return (
          <div>
            {/* Caller info intake */}
            <div style={{
              marginBottom: '24px',
              padding: '20px 24px',
              backgroundColor: hasCallerInfo ? `${CRC_COLORS.success}08` : '#FAFBFD',
              borderRadius: '12px',
              border: `1.5px solid ${hasCallerInfo ? `${CRC_COLORS.success}30` : `${CRC_COLORS.accentBlue}20`}`,
              transition: 'all 300ms ease',
            }}>
              {/* Header with step indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: hasCallerInfo ? CRC_COLORS.success : CRC_COLORS.accentBlue,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: 'background-color 300ms ease',
                }}>
                  {hasCallerInfo ? '✓' : '1'}
                </div>
                <span style={{
                  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
                  fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
                  fontSize: '15px',
                  color: CRC_COLORS.navy,
                }}>
                  Caller Information
                </span>
                {!hasCallerInfo && (
                  <span style={{ fontSize: '12px', color: CRC_COLORS.accentBlue, fontWeight: 500 }}>
                    — Enter caller details to begin
                  </span>
                )}
              </div>

              {/* Fields row */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', color: CRC_COLORS.navy, marginBottom: '4px' }}>
                    Contact Phone Number
                  </label>
                  <Input
                    contentBefore={<CallRegular />}
                    placeholder="(___) ___-____"
                    value={workflow.callerInfo.contactPhone}
                    onChange={(_e, data) => workflow.setCallerInfo({ ...workflow.callerInfo, contactPhone: data.value })}
                    style={{ width: '100%' }}
                    appearance="outline"
                    size="medium"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '12px', color: CRC_COLORS.navy, marginBottom: '4px' }}>
                    Caller Name
                  </label>
                  <Input
                    contentBefore={<PersonRegular />}
                    placeholder="First and last name"
                    value={workflow.callerInfo.callerName}
                    onChange={(_e, data) => workflow.setCallerInfo({ ...workflow.callerInfo, callerName: data.value })}
                    style={{ width: '100%' }}
                    appearance="outline"
                    size="medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 indicator for call type selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: hasCallerInfo ? CRC_COLORS.accentBlue : '#CBD5E1',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                flexShrink: 0,
                transition: 'background-color 300ms ease',
              }}>
                2
              </div>
              <span style={{
                fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
                fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
                fontSize: '15px',
                color: hasCallerInfo ? CRC_COLORS.navy : '#94A3B8',
                transition: 'color 300ms ease',
              }}>
                Select Call Type
              </span>
            </div>

            <CallTypeSelector onSelect={workflow.selectCallType} disabled={!hasCallerInfo} />
          </div>
        );
      })()}

      {workflow.callPhase === 'workflow-steps' && activeStep !== undefined && (
        <div>
          {/* Regulatory timer banner */}
          {regulatoryTimer.isActive && regTimerConfig && (
            <RegulatoryTimerBanner timer={regulatoryTimer} />
          )}

          {/* Side-by-side: vertical stepper (left) + form area (right) */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
            {/* Left: Vertical Stepper */}
            <WorkflowStepper
              steps={workflow.steps}
              activeStepIndex={workflow.activeStepIndex}
              stepStatuses={workflow.stepStatuses}
              onStepSelect={workflow.goToStep}
            />

            {/* Center: Form area */}
            <div style={{ flex: 1, minWidth: 0, maxWidth: '720px' }}>
              {/* Form header with mini timer + auto-save indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacingVerticalS }}>
                <Title2 style={{ display: 'block' }}>
                  {activeStep.title}
                </Title2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <SavedIndicator visible={showSaved} />
                  {timer && <MiniTimer timer={timer} />}
                </div>
              </div>

              {/* Step Form */}
              <div
                key={activeStep.stepNumber}
                style={{
                  animation: 'crc-fade-in 150ms ease',
                }}
              >
                <StepForm
                  step={activeStep}
                  stepStatus={workflow.stepStatuses[workflow.activeStepIndex]}
                  initialData={workflow.stepDataMap[workflow.activeStepIndex] ?? {}}
                  stepDataMap={workflow.stepDataMap}
                  currentStepIndex={workflow.activeStepIndex}
                  onSave={(data) => workflow.saveStepData(workflow.activeStepIndex, data)}
                  onComplete={(data) =>
                    workflow.completeStep(workflow.activeStepIndex, data).catch(() => {
                      /* error handled in workflow hook */
                    })
                  }
                  onSkip={() => workflow.skipStep(workflow.activeStepIndex)}
                  onReopen={() => workflow.reopenStep(workflow.activeStepIndex)}
                  isSubmitting={workflow.isSubmitting}
                />
              </div>
            </div>

            {/* Right: Quick Notes panel */}
            <QuickNotesPanel
              notes={workflow.quickNotes}
              onAddNote={workflow.addQuickNote}
              onDeleteNote={workflow.deleteQuickNote}
            />
          </div>

          <CallFormActions
            onComplete={() => {
              if (workflow.callId !== undefined) {
                parkedTimerMap.delete(workflow.callId);
                parkedRegTimerMap.delete(workflow.callId);
              }
              regulatoryTimer.resetTimer();
              workflow.completeCall(timer?.elapsedSeconds).catch(() => {
                /* error handled in workflow hook */
              });
            }}
            onCancel={() => {
              if (workflow.callId !== undefined) {
                parkedTimerMap.delete(workflow.callId);
                parkedRegTimerMap.delete(workflow.callId);
              }
              regulatoryTimer.resetTimer();
              workflow.cancelCall().catch(() => {
                /* error handled in workflow hook */
              });
            }}
            onPark={() => {
              // Save per-call timer seconds before pausing
              if (workflow.callId !== undefined && timer) {
                parkedTimerMap.set(workflow.callId, timer.elapsedSeconds);
              }
              // Save regulatory timer so countdown continues visually while parked
              if (workflow.callId !== undefined && regulatoryTimer.isActive && regulatoryTimer.startedAt !== undefined) {
                parkedRegTimerMap.set(workflow.callId, {
                  startedAt: regulatoryTimer.startedAt,
                  totalSeconds: regulatoryTimer.totalSeconds,
                  label: regulatoryTimer.label,
                });
              }
              regulatoryTimer.resetTimer();
              timer?.pause();
              workflow.parkCall();
            }}
            isSubmitting={workflow.isSubmitting}
            canComplete={allRequiredDone}
          />
        </div>
      )}

      {workflow.callPhase === 'completed' && (
        <div style={{ textAlign: 'center', padding: '48px 24px', animation: 'crc-view-enter 400ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(16, 185, 129, 0.04), rgba(16, 185, 129, 0.08))',
              border: '1px solid rgba(16, 185, 129, 0.12)',
              borderRadius: '16px',
              padding: '40px',
              display: 'inline-block',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.08)',
            }}
          >
            <SuccessCheckmark
              visible={true}
              message="Call Completed Successfully"
            />
            <div style={{ marginTop: tokens.spacingVerticalL }}>
              <Body1 style={{ display: 'block', marginBottom: tokens.spacingVerticalXL, color: tokens.colorNeutralForeground3, fontSize: '14px', lineHeight: 1.5 }}>
                The call has been recorded successfully.
              </Body1>
              <Button
                appearance="primary"
                icon={<AddRegular />}
                onClick={workflow.resetForm}
                style={{ borderRadius: '8px', padding: '8px 24px' }}
              >
                Start New Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
