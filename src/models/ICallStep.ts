import { StepStatus } from './enums';

export interface ICallStep {
  readonly id: number;
  readonly title: string;
  readonly callId: number;
  readonly stepNumber: number;
  readonly stepData: Record<string, unknown>;
  readonly completedAt: Date | undefined;
  readonly completedById: number | undefined;
  readonly completedByName: string | undefined;
  readonly status: StepStatus;
}
