import * as React from 'react';
import {
  Dialog,
  DialogSurface,
  DialogBody,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Badge,
  Divider,
  Spinner,
  tokens,
  Body1,
  Caption1,
  Subtitle2,
} from '@fluentui/react-components';
import { DismissRegular, ArrowEnterLeftRegular, EditRegular } from '@fluentui/react-icons';
import { ICall, ICallStep, ICallNote, CallPriority, CallStatus, NoteType } from '../../models';
import { callStepsService, callNotesService } from '../../services';
import { StatusBadge } from '../common/StatusBadge';
import { StepStatusIndicator } from '../CallForm/step-status-indicator';
import { formatDuration, formatDateTime } from '../../utils/formatters';

interface ICallDetailDialogProps {
  readonly call: ICall | undefined;
  readonly onClose: () => void;
  readonly onResumeCall?: (callId: number) => void;
}

const PRIORITY_COLOR: Record<CallPriority, 'success' | 'warning' | 'danger' | 'informative'> = {
  [CallPriority.Low]: 'informative',
  [CallPriority.Medium]: 'success',
  [CallPriority.High]: 'warning',
  [CallPriority.Critical]: 'danger',
};

const NOTE_TYPE_COLOR: Record<NoteType, 'informative' | 'danger' | 'warning'> = {
  [NoteType.General]: 'informative',
  [NoteType.Escalation]: 'danger',
  [NoteType.FollowUp]: 'warning',
};

interface IInfoRowProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

const InfoRow: React.FC<IInfoRowProps> = ({ label, children }) => (
  <div style={{ display: 'flex', gap: tokens.spacingHorizontalM, padding: `${tokens.spacingVerticalXS} 0` }}>
    <Caption1 style={{ minWidth: '100px', color: tokens.colorNeutralForeground3 }}>{label}</Caption1>
    <Body1>{children}</Body1>
  </div>
);

export const CallDetailDialog: React.FC<ICallDetailDialogProps> = ({ call, onClose, onResumeCall }) => {
  const [steps, setSteps] = React.useState<ReadonlyArray<ICallStep>>([]);
  const [notes, setNotes] = React.useState<ReadonlyArray<ICallNote>>([]);
  const [isLoadingDetail, setIsLoadingDetail] = React.useState(false);

  React.useEffect(() => {
    if (call === undefined) {
      setSteps([]);
      setNotes([]);
      return;
    }

    let cancelled = false;
    setIsLoadingDetail(true);

    Promise.all([
      callStepsService.getByCallId(call.id),
      callNotesService.getByCallId(call.id),
    ])
      .then(([loadedSteps, loadedNotes]) => {
        if (!cancelled) {
          setSteps(loadedSteps);
          setNotes(loadedNotes);
          setIsLoadingDetail(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsLoadingDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [call]);

  return (
    <Dialog open={call !== undefined} onOpenChange={(_event, data) => { if (!data.open) onClose(); }}>
      <DialogSurface style={{ maxWidth: '640px', animation: 'crc-dialog-enter 200ms ease' }}>
        <DialogBody>
          <DialogTitle
            action={
              <Button appearance="subtle" icon={<DismissRegular />} onClick={onClose} aria-label="Close" />
            }
          >
            {call !== undefined ? call.title : ''}
          </DialogTitle>

          <DialogContent>
            {call !== undefined && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalM }}>
                {/* Header badges */}
                <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, alignItems: 'center' }}>
                  <StatusBadge status={call.status} />
                  <Badge color={PRIORITY_COLOR[call.priority]} appearance="tint">
                    {call.priority}
                  </Badge>
                  <Badge appearance="outline">{call.callType}</Badge>
                </div>

                {/* Call Info */}
                <div>
                  <InfoRow label="Caller">{call.callerName}</InfoRow>
                  <InfoRow label="Phone">{call.callerPhone}</InfoRow>
                  <InfoRow label="Location">{call.location}</InfoRow>
                  <InfoRow label="Dispatcher">{call.dispatcherName}</InfoRow>
                  <InfoRow label="Start Time">{formatDateTime(call.startTime)}</InfoRow>
                  {call.endTime !== undefined && (
                    <InfoRow label="End Time">{formatDateTime(call.endTime)}</InfoRow>
                  )}
                  {call.duration !== undefined && (
                    <InfoRow label="Duration">{formatDuration(call.duration)}</InfoRow>
                  )}
                  {call.completedByName !== undefined && (
                    <InfoRow label="Completed By">{call.completedByName}</InfoRow>
                  )}
                </div>

                {call.summary.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Subtitle2 style={{ display: 'block' }}>Brief Description</Subtitle2>
                      <Body1 style={{ display: 'block', marginTop: tokens.spacingVerticalXS, whiteSpace: 'pre-wrap' }}>
                        {call.summary}
                      </Body1>
                    </div>
                  </>
                )}

                {/* Steps section */}
                <Divider />
                <div>
                  <Subtitle2 style={{ display: 'block' }}>Workflow Steps</Subtitle2>
                  {isLoadingDetail ? (
                    <Spinner size="small" label="Loading steps..." />
                  ) : steps.length === 0 ? (
                    <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                      No steps recorded.
                    </Caption1>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS, marginTop: tokens.spacingVerticalS }}>
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: tokens.spacingHorizontalS,
                            padding: `${tokens.spacingVerticalXS} ${tokens.spacingHorizontalS}`,
                            background: tokens.colorNeutralBackground2,
                            borderRadius: tokens.borderRadiusMedium,
                          }}
                        >
                          <StepStatusIndicator status={step.status} stepNumber={step.stepNumber} isActive={false} />
                          <Body1 style={{ flex: 1 }}>{step.title}</Body1>
                          {step.completedAt !== undefined && (
                            <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>
                              {formatDateTime(step.completedAt)}
                            </Caption1>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes section */}
                {!isLoadingDetail && notes.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <Subtitle2 style={{ display: 'block' }}>Notes</Subtitle2>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacingVerticalXS, marginTop: tokens.spacingVerticalS }}>
                        {notes.map((note) => (
                          <div
                            key={note.id}
                            style={{
                              padding: `${tokens.spacingVerticalS} ${tokens.spacingHorizontalS}`,
                              background: tokens.colorNeutralBackground2,
                              borderRadius: tokens.borderRadiusMedium,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS, marginBottom: tokens.spacingVerticalXXS }}>
                              <Badge color={NOTE_TYPE_COLOR[note.noteType]} appearance="tint" size="small">
                                {note.noteType}
                              </Badge>
                              <Caption1 style={{ color: tokens.colorNeutralForeground3 }}>{note.title}</Caption1>
                            </div>
                            <Body1 style={{ whiteSpace: 'pre-wrap' }}>{note.noteText}</Body1>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>

          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              Close
            </Button>
            {call !== undefined && call.status === CallStatus.Active && onResumeCall && (
              <Button
                appearance="primary"
                icon={<ArrowEnterLeftRegular />}
                onClick={() => {
                  onResumeCall(call.id);
                  onClose();
                }}
              >
                Resume Call
              </Button>
            )}
            {call !== undefined && call.status === CallStatus.Completed && onResumeCall && (
              <Button
                appearance="outline"
                icon={<EditRegular />}
                onClick={() => {
                  onResumeCall(call.id);
                  onClose();
                }}
              >
                Edit Steps
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
