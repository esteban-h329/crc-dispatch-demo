import { mockStore } from './mock-store';
import { ICallStep, StepStatus } from '../../models';

export const mockCallStepsService = {
  async getByCallId(callId: number): Promise<ReadonlyArray<ICallStep>> {
    await mockStore.simulateDelay();
    return mockStore.getStepsByCallId(callId);
  },

  async create(callId: number, stepTitle: string, stepNumber: number): Promise<number> {
    await mockStore.simulateDelay();
    return mockStore.addStep({
      title: stepTitle,
      callId,
      stepNumber,
      stepData: {},
      completedAt: undefined,
      completedById: undefined,
      completedByName: undefined,
      status: StepStatus.Pending,
    });
  },

  async update(id: number, data: Record<string, unknown>): Promise<void> {
    await mockStore.simulateDelay();
    mockStore.updateStep(id, data as Partial<ICallStep>);
  },

  async saveStepDraft(id: number, stepData: Record<string, unknown>): Promise<void> {
    await mockStore.simulateDelay();
    mockStore.updateStep(id, { stepData });
  },

  async completeStep(id: number, stepData: Record<string, unknown>): Promise<void> {
    await mockStore.simulateDelay();
    mockStore.updateStep(id, {
      status: StepStatus.Completed,
      stepData,
      completedAt: new Date(),
      completedById: 1,
      completedByName: 'Current User',
    });
  },
};
