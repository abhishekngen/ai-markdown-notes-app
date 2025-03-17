'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React from 'react';
import { useNoteStore } from '@/store/notes-store';
import { useShallow } from 'zustand/react/shallow';

const Tiptap = () => {
    const { currentNote, setCurrentNote } = useNoteStore(
        useShallow((state) => ({
            currentNote: state.currentNote,
            setCurrentNote: state.setCurrentNote,
        }))
    );

    const editor = useEditor(
        {
            extensions: [StarterKit],
            editorProps: {
                attributes: {
                    class: 'w-full p-2 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                    placeholder: 'Start typing your note here...',
                },
            },
            content: currentNote?.note_content,
            onUpdate: ({ editor }) => {
                if (currentNote) {
                    // Save the note content to the current note
                    setCurrentNote({
                        ...currentNote,
                        note_content: editor.getHTML(),
                        note_content_raw_text: editor.getText(),
                    });
                }
            },
            immediatelyRender: false,
        },
        [currentNote?.id]
    );

    return (
        <EditorContent
            key={currentNote?.id}
            editor={editor}
            className="h-[95%] flex-none field-sizing-fixed resize-none max-sm:border-none placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
    );
};

export default Tiptap;
