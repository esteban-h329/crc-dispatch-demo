import { ICall, ICallStep, ICallNote, CallType, CallStatus, CallPriority } from '../../models';

let _nextId = 100;

function nextId(): number {
  return _nextId++;
}

const SIMULATED_DELAY_MS = 150;

async function simulateDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
}

// In-memory stores
const calls: Map<number, ICall> = new Map();
const callSteps: Map<number, ICallStep> = new Map();
const callNotes: Map<number, ICallNote> = new Map();

// Pre-seed with sample data
function seedData(): void {
  const sampleCall: ICall = {
    id: nextId(),
    title: 'CALL-20260209-001',
    callType: CallType.Fire,
    dispatcherId: 1,
    dispatcherName: 'John Dispatcher',
    startTime: new Date('2026-02-09T08:30:00'),
    endTime: new Date('2026-02-09T09:15:00'),
    duration: 2700,
    status: CallStatus.Completed,
    priority: CallPriority.Critical,
    summary: 'Small fire at Well Pad 7. Past incipient, 911 called, contained.',
    callerName: 'Mike Field',
    callerPhone: '(661) 555-0101',
    location: 'Well Pad 7, Section 12',
    completedById: 1,
    completedByName: 'John Dispatcher',
  };
  calls.set(sampleCall.id, sampleCall);

  const sampleCall2: ICall = {
    id: nextId(),
    title: 'CALL-20260209-002',
    callType: CallType.SpillsReleases,
    dispatcherId: 1,
    dispatcherName: 'John Dispatcher',
    startTime: new Date('2026-02-09T14:00:00'),
    endTime: new Date('2026-02-09T15:30:00'),
    duration: 5400,
    status: CallStatus.Completed,
    priority: CallPriority.High,
    summary: 'Produced water spill near Tank Battery 3. Contained and cleanup initiated.',
    callerName: 'Sarah Operations',
    callerPhone: '(661) 555-0202',
    location: 'Tank Battery 3, North Field',
    completedById: 1,
    completedByName: 'John Dispatcher',
  };
  calls.set(sampleCall2.id, sampleCall2);
}

seedData();

export const mockStore = {
  simulateDelay,

  // Calls
  getAllCalls(): ReadonlyArray<ICall> {
    return Array.from(calls.values()).sort(
      (a, b) => b.startTime.getTime() - a.startTime.getTime(),
    );
  },

  getCallById(id: number): ICall | undefined {
    return calls.get(id);
  },

  addCall(data: Omit<ICall, 'id'>): number {
    const id = nextId();
    calls.set(id, { ...data, id });
    return id;
  },

  updateCall(id: number, data: Partial<ICall>): void {
    const existing = calls.get(id);
    if (existing === undefined) {
      throw new Error(`Call with id ${id} not found`);
    }
    calls.set(id, { ...existing, ...data });
  },

  // Call Steps
  getStepsByCallId(callId: number): ReadonlyArray<ICallStep> {
    return Array.from(callSteps.values())
      .filter((step) => step.callId === callId)
      .sort((a, b) => a.stepNumber - b.stepNumber);
  },

  addStep(data: Omit<ICallStep, 'id'>): number {
    const id = nextId();
    callSteps.set(id, { ...data, id });
    return id;
  },

  updateStep(id: number, data: Partial<ICallStep>): void {
    const existing = callSteps.get(id);
    if (existing === undefined) {
      throw new Error(`CallStep with id ${id} not found`);
    }
    callSteps.set(id, { ...existing, ...data });
  },

  // Call Notes
  getNotesByCallId(callId: number): ReadonlyArray<ICallNote> {
    return Array.from(callNotes.values())
      .filter((note) => note.callId === callId)
      .sort((a, b) => b.id - a.id);
  },

  addNote(data: Omit<ICallNote, 'id'>): number {
    const id = nextId();
    callNotes.set(id, { ...data, id });
    return id;
  },

  deleteNote(id: number): void {
    if (!callNotes.has(id)) {
      throw new Error(`CallNote with id ${id} not found`);
    }
    callNotes.delete(id);
  },

  // Utility
  getTodayCallCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from(calls.values()).filter(
      (call) => call.startTime >= today,
    ).length;
  },
};
