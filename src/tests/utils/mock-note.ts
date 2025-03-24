import { Note } from '@/types/notes-types';

export function makeMockNote(overrides: Partial<Note> = {}): Note {
    return {
        id: 'mock_note',
        note_title: 'Mock Note',
        note_content: 'This is a mock note',
        note_content_raw_text: 'This is a mock note',
        created_at: null,
        last_updated_at: null,
        user_id: 'mock_user_id',
        ...overrides,
    };
}
