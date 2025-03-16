import { create } from 'zustand';
import { Note } from '@/types/notes-types'

interface NotesStore {
    notes: Note[];
    currentNote: Note | null;
    originalNote: Note | null;
    setNotes: (notes: Note[]) => void;
    setCurrentNote: (note: Note | null) => void;
    setOriginalNote: (note: Note | null) => void;
}

export const useNoteStore = create<NotesStore>((set) => ({
    notes: [],
    currentNote: null,
    originalNote: null,
    setNotes: (notes: Note[]) => set({notes}),
    setCurrentNote: (note: Note | null) => {
        set((state) => {
            // const updatedNotes = note ? state.notes.map((oldNote) => {
            //     if(oldNote.id === note.id) {
            //         return oldNote;
            //     } else {
            //         return oldNote;
            //     }
            // }) : state.notes;
            return {currentNote: note};
        });
    },
    setOriginalNote: (note: Note | null) => set({originalNote: note}),
}));
