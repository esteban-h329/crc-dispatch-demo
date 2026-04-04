import * as React from 'react';
import { StepStatus, CallStatus, ICallFormData } from '../../models';
import { IWorkflowStepDefinition } from '../../models';
import { ICallTypeConfig, getCallTypeConfig } from '../../config/call-types';
import { callsService, callStepsService, callNotesService } from '../../services';
import { NoteType } from '../../models';
import { useAppContext } from '../../context/AppContext';
import { getLocationById } from '../../config/location-data';

export type CallPhase = 'type-selection' | 'workflow-steps' | 'completed';

const AUTO_SAVE_DELAY = 3000;

interface ICallFormWorkflowResult {
  readonly callPhase: CallPhase;
  readonly selectedCallType: ICallTypeConfig | undefined;
  readonly callId: number | undefined;
  readonly activeStepIndex: number;
  readonly steps: ReadonlyArray<IWorkflowStepDefinition>;
  readonly stepStatuses: ReadonlyArray<StepStatus>;
  readonly stepDataMap: Record<number, Record<string, unknown>>;
  readonly isSubmitting: boolean;
  readonly lastAutoSavedAt: number;

  readonly selectCallType: (config: ICallTypeConfig) => Promise<void>;
  readonly goToStep: (index: number) => void;
  readonly saveStepData: (index: number, data: Record<string, unknown>) => void;
  readonly completeStep: (index: number, data: Record<string, unknown>) => Promise<void>;
  readonly skipStep: (index: number) => void;
  readonly reopenStep: (index: number) => void;
  readonly completeCall: (activeTimerSeconds?: number) => Promise<void>;
  readonly cancelCall: () => Promise<void>;
  readonly resetForm: () => void;
  readonly parkCall: () => void;
  readonly resumeCall: (callId: number) => Promise<{ startTime: Date; duration: number | undefined } | undefined>;
  readonly addQuickNote: (noteText: string) => Promise<void>;
  readonly deleteQuickNote: (index: number) => Promise<void>;
  readonly quickNotes: ReadonlyArray<{ readonly id: number; readonly text: string; readonly timestamp: string }>;
}

export const useCallFormWorkflow = (
  onCallStarted?: () => void,
  onCallEnded?: () => void,
): ICallFormWorkflowResult => {
  const { dispatch } = useAppContext();

  const [callPhase, setCallPhase] = React.useState<CallPhase>('type-selection');
  const [selectedCallType, setSelectedCallType] = React.useState<ICallTypeConfig | undefined>(undefined);
  const [callId, setCallId] = React.useState<number | undefined>(undefined);
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [stepStatuses, setStepStatuses] = React.useState<StepStatus[]>([]);
  const [stepDataMap, setStepDataMap] = React.useState<Record<number, Record<string, unknown>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepIds, setStepIds] = React.useState<number[]>([]);
  const [lastAutoSavedAt, setLastAutoSavedAt] = React.useState(0);
  const [quickNotes, setQuickNotes] = React.useState<Array<{ id: number; text: string; timestamp: string }>>([]);
  const autoSaveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const steps = selectedCallType?.steps ?? [];

  // Cleanup auto-save timer on unmount
  React.useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current !== null) clearTimeout(autoSaveTimerRef.current);
    };
  }, []);

  const selectCallType = React.useCallback(async (config: ICallTypeConfig) => {
    setSelectedCallType(config);
    setStepStatuses(config.steps.map(() => StepStatus.Pending));
    setStepDataMap({});
    setActiveStepIndex(0);
    setIsSubmitting(true);

    try {
      const callTitle = callsService.generateNextCallTitle();
      const formData: ICallFormData = {
        callType: config.type,
        priority: config.defaultPriority,
        callerName: '',
        callerPhone: '',
        location: '',
        summary: '',
      };

      const newCallId = await callsService.create(formData, callTitle);
      setCallId(newCallId);

      // Create step records in the data store
      const ids: number[] = [];
      for (const step of config.steps) {
        const stepId = await callStepsService.create(newCallId, step.title, step.stepNumber);
        ids.push(stepId);
      }
      setStepIds(ids);

      // Set the active call in global state
      const call = await callsService.getById(newCallId);
      dispatch({ type: 'SET_ACTIVE_CALL', payload: call });

      setCallPhase('workflow-steps');
      onCallStarted?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create call';
      dispatch({ type: 'SET_ERROR', payload: message });
      // Reset on failure so user can try again
      setSelectedCallType(undefined);
      setStepStatuses([]);
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, onCallStarted]);

  const goToStep = React.useCallback((index: number) => {
    setActiveStepIndex(index);
  }, []);

  const saveStepData = React.useCallback((index: number, data: Record<string, unknown>) => {
    setStepDataMap((prev) => ({ ...prev, [index]: data }));

    // Debounced auto-save to service
    if (autoSaveTimerRef.current !== null) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      const stepId = stepIds[index];
      if (stepId === undefined) return;

      callStepsService.saveStepDraft(stepId, data)
        .then(() => {
          setLastAutoSavedAt(Date.now());
        })
        .catch(() => {
          // Auto-save failures are silent — data is still in local state
        });
    }, AUTO_SAVE_DELAY);
  }, [stepIds]);

  const completeStep = React.useCallback(
    async (index: number, data: Record<string, unknown>) => {
      const stepId = stepIds[index];
      if (stepId === undefined) return;

      setIsSubmitting(true);
      try {
        await callStepsService.completeStep(stepId, data);

        setStepDataMap((prev) => ({ ...prev, [index]: data }));
        setStepStatuses((prev) => {
          const updated = [...prev];
          updated[index] = StepStatus.Completed;
          return updated;
        });

        // Auto-advance to the next pending step
        const nextPending = findNextPendingStep(index, stepStatuses.length, (i) => {
          if (i === index) return StepStatus.Completed;
          return stepStatuses[i];
        });
        if (nextPending !== -1) {
          setActiveStepIndex(nextPending);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to complete step';
        dispatch({ type: 'SET_ERROR', payload: message });
      } finally {
        setIsSubmitting(false);
      }
    },
    [stepIds, stepStatuses, dispatch],
  );

  const skipStep = React.useCallback(
    (index: number) => {
      setStepStatuses((prev) => {
        const updated = [...prev];
        updated[index] = StepStatus.Skipped;
        return updated;
      });

      const nextPending = findNextPendingStep(index, stepStatuses.length, (i) => {
        if (i === index) return StepStatus.Skipped;
        return stepStatuses[i];
      });
      if (nextPending !== -1) {
        setActiveStepIndex(nextPending);
      }
    },
    [stepStatuses],
  );

  const reopenStep = React.useCallback(
    (index: number) => {
      setStepStatuses((prev) => {
        const updated = [...prev];
        updated[index] = StepStatus.Pending;
        return updated;
      });
      setActiveStepIndex(index);
    },
    [],
  );

  const completeCall = React.useCallback(async (activeTimerSeconds?: number) => {
    if (callId === undefined) return;
    setIsSubmitting(true);

    try {
      const call = await callsService.getById(callId);
      const endTime = new Date();
      // Use timer's active seconds if available; fall back to wall-clock
      const durationSeconds = activeTimerSeconds ?? Math.round(
        (endTime.getTime() - call.startTime.getTime()) / 1000,
      );

      // Populate call record with Step 1 data before closing
      const step1Data = stepDataMap[0] ?? {};
      // Location is an object from LocationPicker — resolve the location name
      const locationValue = step1Data.location;
      let locationString = '';
      if (typeof locationValue === 'object' && locationValue !== null) {
        const locId = String((locationValue as Record<string, unknown>).locationId ?? '');
        const resolved = getLocationById(locId);
        locationString = resolved?.name ?? locId;
      } else {
        locationString = String(locationValue ?? '');
      }
      await callsService.update(callId, {
        status: CallStatus.Completed,
        endTime,
        duration: durationSeconds,
        completedById: 1,
        completedByName: 'Current User',
        summary: String(step1Data.briefDescription ?? ''),
        callerName: String(step1Data.callerName ?? ''),
        callerPhone: String(step1Data.contactNumber ?? ''),
        location: locationString,
      } as Record<string, unknown>);

      const completedCall = await callsService.getById(callId);
      dispatch({ type: 'ADD_CALL_TO_HISTORY', payload: completedCall });
      dispatch({ type: 'CLEAR_ACTIVE_CALL' });
      setCallPhase('completed');
      onCallEnded?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete call';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      setIsSubmitting(false);
    }
  }, [callId, stepDataMap, dispatch, onCallEnded]);

  const cancelCall = React.useCallback(async () => {
    if (callId !== undefined) {
      try {
        await callsService.update(callId, {
          status: CallStatus.Cancelled,
          endTime: new Date(),
        } as Record<string, unknown>);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to cancel call on server';
        dispatch({ type: 'SET_ERROR', payload: message });
      }
    }

    dispatch({ type: 'CLEAR_ACTIVE_CALL' });
    setCallPhase('type-selection');
    setSelectedCallType(undefined);
    setCallId(undefined);
    setStepStatuses([]);
    setStepDataMap({});
    setStepIds([]);
    setActiveStepIndex(0);
    onCallEnded?.();
  }, [callId, dispatch, onCallEnded]);

  const addQuickNote = React.useCallback(async (noteText: string) => {
    if (callId === undefined || noteText.trim().length === 0) return;

    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const title = `Note @ ${timestamp}`;

    try {
      const noteId = await callNotesService.create(callId, title, noteText.trim(), NoteType.General);
      setQuickNotes((prev) => [...prev, { id: noteId, text: noteText.trim(), timestamp }]);
    } catch {
      // Still add to local state with a temporary ID so it's visible
      setQuickNotes((prev) => [...prev, { id: -Date.now(), text: noteText.trim(), timestamp }]);
    }
  }, [callId]);

  const deleteQuickNote = React.useCallback(async (index: number) => {
    const note = quickNotes[index];
    if (note === undefined) return;

    // Remove from local state immediately
    setQuickNotes((prev) => prev.filter((_, i) => i !== index));

    // Delete from service if it has a valid ID
    if (note.id > 0) {
      try {
        await callNotesService.delete(note.id);
      } catch {
        // Deletion failure is non-blocking — note is already removed from UI
      }
    }
  }, [quickNotes]);

  // Park the current call — keeps it Active in context so header shows "Resume"
  const parkCall = React.useCallback(() => {
    // NOTE: intentionally NOT dispatching CLEAR_ACTIVE_CALL so the header keeps showing resume
    setCallPhase('type-selection');
    setSelectedCallType(undefined);
    setCallId(undefined);
    setStepStatuses([]);
    setStepDataMap({});
    setStepIds([]);
    setActiveStepIndex(0);
    setQuickNotes([]);
  }, []);

  const resumeCall = React.useCallback(async (resumeCallId: number): Promise<{ startTime: Date; duration: number | undefined } | undefined> => {
    setIsSubmitting(true);
    try {
      let call = await callsService.getById(resumeCallId);
      const config = getCallTypeConfig(call.callType);
      if (config === undefined) {
        dispatch({ type: 'SET_ERROR', payload: `Unknown call type: ${call.callType}` });
        return undefined;
      }

      // Reopen completed calls — set status back to Active for editing
      if (call.status === CallStatus.Completed) {
        await callsService.update(resumeCallId, {
          status: CallStatus.Active,
          endTime: undefined,
        } as Record<string, unknown>);
        call = await callsService.getById(resumeCallId);
        // Update the call in history so it shows as Active
        dispatch({ type: 'UPDATE_CALL_IN_HISTORY', payload: call });
      }

      // Load persisted steps from the data store
      const persistedSteps = await callStepsService.getByCallId(resumeCallId);

      // Rebuild local state from persisted data
      const statuses: StepStatus[] = config.steps.map(() => StepStatus.Pending);
      const dataMap: Record<number, Record<string, unknown>> = {};
      const ids: number[] = new Array<number>(config.steps.length).fill(0);

      for (const persisted of persistedSteps) {
        // stepNumber is 1-based in the config, map to 0-based index
        const index = persisted.stepNumber - 1;
        if (index >= 0 && index < config.steps.length) {
          statuses[index] = persisted.status;
          ids[index] = persisted.id;
          if (persisted.stepData && Object.keys(persisted.stepData).length > 0) {
            dataMap[index] = persisted.stepData;
          }
        }
      }

      setSelectedCallType(config);
      setCallId(resumeCallId);
      setStepStatuses(statuses);
      setStepDataMap(dataMap);
      setStepIds(ids);

      // Navigate to the first pending step, or step 0 if all done
      const firstPending = statuses.indexOf(StepStatus.Pending);
      setActiveStepIndex(firstPending !== -1 ? firstPending : 0);

      // Load existing notes
      const persistedNotes = await callNotesService.getByCallId(resumeCallId);
      setQuickNotes(
        persistedNotes.map((note) => ({
          id: note.id,
          text: note.noteText,
          timestamp: note.title.replace('Note @ ', ''),
        })),
      );

      dispatch({ type: 'SET_ACTIVE_CALL', payload: call });
      setCallPhase('workflow-steps');
      return { startTime: call.startTime, duration: call.duration };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resume call';
      dispatch({ type: 'SET_ERROR', payload: message });
      return undefined;
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch]);

  const resetForm = React.useCallback(() => {
    setCallPhase('type-selection');
    setSelectedCallType(undefined);
    setCallId(undefined);
    setStepStatuses([]);
    setStepDataMap({});
    setStepIds([]);
    setActiveStepIndex(0);
    setQuickNotes([]);
  }, []);

  return {
    callPhase,
    selectedCallType,
    callId,
    activeStepIndex,
    steps,
    stepStatuses,
    stepDataMap,
    isSubmitting,
    lastAutoSavedAt,
    selectCallType,
    goToStep,
    saveStepData,
    completeStep,
    skipStep,
    reopenStep,
    completeCall,
    cancelCall,
    parkCall,
    resumeCall,
    resetForm,
    addQuickNote,
    deleteQuickNote,
    quickNotes,
  };
};

// Find the next pending step after the given index, wrapping around if needed
function findNextPendingStep(
  currentIndex: number,
  totalSteps: number,
  getStatus: (index: number) => StepStatus,
): number {
  for (let offset = 1; offset < totalSteps; offset++) {
    const index = (currentIndex + offset) % totalSteps;
    if (getStatus(index) === StepStatus.Pending) {
      return index;
    }
  }
  return -1;
}
