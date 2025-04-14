import { Note } from '@/types/notes-types';

export function generateAIContext(currentNote: Note | null) {
    return currentNote
        ? `
                                Hey AI, below is a note written by the user. The user will ask you questions about this note and other notes they have written.
                                
                                Note Title: ${currentNote.note_title}
                                
                                Note content: 
                                ${currentNote.note_content}
                                `
        : 'Do not answer any question.';
}
