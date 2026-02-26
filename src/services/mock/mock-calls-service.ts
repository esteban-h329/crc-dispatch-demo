import { mockStore } from './mock-store';
import { ICall, ICallFormData, CallStatus } from '../../models';
import { generateCallId } from '../../utils/call-id-generator';

export const mockCallsService = {
  async getAll(): Promise<ReadonlyArray<ICall>> {
    await mockStore.simulateDelay();
    return mockStore.getAllCalls();
  },

  async getById(id: number): Promise<ICall> {
    await mockStore.simulateDelay();
    const call = mockStore.getCallById(id);
    if (call === undefined) {
      throw new Error(`Call with id ${id} not found`);
    }
    return call;
  },

  async create(data: ICallFormData, callTitle: string): Promise<number> {
    await mockStore.simulateDelay();
    return mockStore.addCall({
      title: callTitle,
      callType: data.callType,
      dispatcherId: 1,
      dispatcherName: 'Current User',
      startTime: new Date(),
      endTime: undefined,
      duration: undefined,
      status: CallStatus.Active,
      priority: data.priority,
      summary: data.summary,
      callerName: data.callerName,
      callerPhone: data.callerPhone,
      location: data.location,
      completedById: undefined,
      completedByName: undefined,
    });
  },

  async update(id: number, data: Record<string, unknown>): Promise<void> {
    await mockStore.simulateDelay();
    mockStore.updateCall(id, data as Partial<ICall>);
  },

  generateNextCallTitle(): string {
    const seq = mockStore.getTodayCallCount() + 1;
    return generateCallId(seq);
  },
};
