import { Note } from '@/types/notes-types';

export function generateAIContext(currentNote: Note | null) {
    return currentNote
        ? `
                                Hey AI, below is a note written by the user. Please only answer questions about this note. Note that the content of the note can change as you can tell by the conversation.
                                
                                Note Title: ${currentNote.note_title}
                                
                                Note content: 
                                ${currentNote.note_content}
                                `
        : 'Do not answer any question.';
}
