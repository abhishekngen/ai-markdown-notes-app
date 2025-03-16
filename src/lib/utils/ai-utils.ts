import { Note } from '@/types/notes-types'

export function generateAIContext(currentNote: Note | null) {
    return currentNote
        ? `
                                Hey AI, below is a note written by the user. Please only answer questions about this note.
                                
                                Note Title: ${currentNote.note_title}
                                
                                Note content: 
                                ${currentNote.note_content ?? '(Empty)'}
                                `
        : 'Do not answer any question.';
}
