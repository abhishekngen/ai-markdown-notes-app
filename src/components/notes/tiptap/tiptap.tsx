'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Note } from '@/types/notes-types';
import React from 'react';
import { UIMessage } from 'ai';
import { Message } from '@ai-sdk/react';

interface TiptapProps {
    currentNote: Note | null;
    setCurrentNote: React.Dispatch<React.SetStateAction<Note | null>>;
    messages: UIMessage[];
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
}

const Tiptap = ({
    currentNote,
    setCurrentNote,
    messages,
    setMessages,
}: TiptapProps) => {
    const editor = useEditor(
        {
            extensions: [StarterKit],
            editorProps: {
                attributes: {
                    class: 'w-full p-2',
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
                    const contextToAdd = currentNote
                        ? `
                                    Hey AI, below is a note written by the user. Please only answer questions about this note.
                                    
                                    Note Title: ${currentNote.note_title}
                                    
                                    Note content: 
                                    ${editor.getHTML()}
                                    `
                        : 'Do not answer any question.';
                    if (messages.length > 0) {
                        setMessages(
                            messages.map((message) => {
                                if (message.role === 'system') {
                                    return {
                                        id: '',
                                        role: 'system',
                                        content: contextToAdd,
                                    };
                                } else {
                                    return message;
                                }
                            })
                        );
                    } else {
                        setMessages([
                            {
                                id: '',
                                role: 'system',
                                content: contextToAdd,
                            },
                        ]);
                    }
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
            className="h-[95%] flex-none field-sizing-fixed resize-none max-sm:border-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        />
    );
};

export default Tiptap;
