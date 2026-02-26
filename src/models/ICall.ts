import { CallType, CallStatus, CallPriority } from './enums';

export interface ICall {
  readonly id: number;
  readonly title: string;
  readonly callType: CallType;
  readonly dispatcherId: number;
  readonly dispatcherName: string;
  readonly startTime: Date;
  readonly endTime: Date | undefined;
  readonly duration: number | undefined;
  readonly status: CallStatus;
  readonly priority: CallPriority;
  readonly summary: string;
  readonly callerName: string;
  readonly callerPhone: string;
  readonly location: string;
  readonly completedById: number | undefined;
  readonly completedByName: string | undefined;
}

export interface ICallFormData {
  readonly callType: CallType;
  readonly priority: CallPriority;
  readonly callerName: string;
  readonly callerPhone: string;
  readonly location: string;
  readonly summary: string;
}
