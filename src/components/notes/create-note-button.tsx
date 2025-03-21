'use client';
import { createNote as createNoteInDB } from '@/server/db/notes-queries';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Note } from '@/types/notes-types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

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
                const { data: createdNote, error } = await createNoteInDB(
                    'Untitled Note',
                    ''
                );
                if (error) {
                    toast(error.message);
                } else {
                    setNotes([createdNote, ...notes]);
                    setCurrentNote(createdNote);
                    setOriginalNote(createdNote);
                    toast('Note created successfully');
                }
            }}
        >
            <Plus className="h-4 w-4 mr-2" />
            Create New Note
        </Button>
    );
}
