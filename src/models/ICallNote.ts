import { NoteType } from './enums';

export interface ICallNote {
  readonly id: number;
  readonly title: string;
  readonly callId: number;
  readonly noteText: string;
  readonly noteType: NoteType;
}
