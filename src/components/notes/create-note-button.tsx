import { createNote as createNoteInDB } from '@/server/db/notes-queries';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Note } from '@/types/notes-types';
import { Plus } from 'lucide-react';

interface CreateNoteButtonProps {
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    setCurrentNote: (note: Note | null) => void;
    setOriginalNote: (note: Note | null) => void;
}

export default function CreateNoteButton({
    notes,
    setNotes,
    setCurrentNote,
    setOriginalNote,
}: CreateNoteButtonProps) {
    return (
        <Button
            onClick={async () => {
                const createdNote = await createNoteInDB('Untitled Note', '');
                setNotes([createdNote, ...notes]);
                setCurrentNote(createdNote);
                setOriginalNote(createdNote);
            }}
        >
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
        </Button>
    );
}
