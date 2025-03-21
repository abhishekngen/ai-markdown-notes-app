import { describe, expect, it } from 'vitest';
import { generateAIContext } from '@/lib/utils/ai-utils';
import { Note } from '@/types/notes-types';

describe('ai-utils', () => {
    it('should not allow the AI to answer when there is no note', () => {
        const note = null;
        const generatedContext = generateAIContext(note);

        expect(generatedContext).eq('Do not answer any question.');
    });

    it('should give the correct note context when not empty', () => {
        const note: Note = {
            created_at: null,
            id: '',
            last_updated_at: null,
            note_title: 'title',
            user_id: '',
            note_content: 'content',
        };
        const generatedContext = generateAIContext(note);

        expect(generatedContext).contains('title');
        expect(generatedContext).contains('content');
    });
});
