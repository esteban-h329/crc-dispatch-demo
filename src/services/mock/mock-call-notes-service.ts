import { mockStore } from './mock-store';
import { ICallNote, NoteType } from '../../models';

export const mockCallNotesService = {
  async getByCallId(callId: number): Promise<ReadonlyArray<ICallNote>> {
    await mockStore.simulateDelay();
    return mockStore.getNotesByCallId(callId);
  },

  async create(callId: number, title: string, noteText: string, noteType: NoteType): Promise<number> {
    await mockStore.simulateDelay();
    return mockStore.addNote({
      title,
      callId,
      noteText,
      noteType,
    });
  },

  async delete(noteId: number): Promise<void> {
    await mockStore.simulateDelay();
    mockStore.deleteNote(noteId);
  },
};
