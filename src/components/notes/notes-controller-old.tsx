'use client';
import React, { useEffect, useState } from 'react';
import { Note } from '@/types/notes-types';
import {
    updateNote as saveNoteInDB,
    createNote as createNoteInDB,
    fetchNotes,
} from '@/server/db/notes-queries';
import { NotesSidebarOld } from '@/components/notes/notes-sidebar-old';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NotesEditorOld from '@/components/notes/notes-editor-old';
import ChatOld from '@/components/ai/chatOld';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BotMessageSquare } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

export default function NotesControllerOld() {
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [originalNote, setOriginalNote] = useState<Note | null>(null);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        status,
        setMessages,
    } = useChat({
        api: '/api/chat',
    });

    // TODO do error handling here
    const createNote = async (noteTitle: string, noteContent: string) => {
        const createdNote = await createNoteInDB(noteTitle, noteContent);
        if (notes) {
            setNotes([createdNote, ...notes]);
        } else {
            setNotes([createdNote]);
        }
        setCurrentNote(createdNote);
        setOriginalNote(createdNote);
    };

    const saveNote = async () => {
        if (currentNote && notes) {
            await saveNoteInDB(
                currentNote.id,
                currentNote.note_title,
                currentNote.note_content,
                currentNote.note_content_raw_text
            );
            setNotes(
                notes.map((note) => {
                    return note.id === currentNote.id ? currentNote : note;
                })
            );
        }
    };

    // TODO Lift this into server component
    useEffect(() => {
        async function loadNotes() {
            const fetchedNotes = await fetchNotes();
            setNotes(fetchedNotes);
            setIsLoading(false);
        }

        loadNotes();
    }, []);

    // TODO move AI context parsing to backend

    return (
        <>
            <NotesSidebarOld
                notes={notes}
                setNotes={setNotes}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                setOriginalNote={setOriginalNote}
                createNote={createNote}
                setMessages={setMessages}
                isLoading={isLoading}
            />
            <main className="mt-10 sm:w-screen md:w-9/12 mx-auto">
                <div className="flex justify-between">
                    <SidebarTrigger />
                    <Button
                        className="mr-4 mb-1"
                        onClick={() => {
                            setOriginalNote(currentNote);
                            setIsAIChatOpen(!isAIChatOpen);
                        }}
                        disabled={!currentNote}
                    >
                        {isAIChatOpen ? (
                            <>
                                Return to Note
                                <ArrowLeft />
                            </>
                        ) : (
                            <>
                                Chat to AI
                                <BotMessageSquare />
                            </>
                        )}
                    </Button>
                </div>
                {!isAIChatOpen ? (
                    <NotesEditorOld
                        currentNote={currentNote}
                        setCurrentNote={setCurrentNote}
                        originalNote={originalNote}
                        createNote={createNote}
                        saveNote={saveNote}
                        messages={messages}
                        setMessages={setMessages}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="h-[75vh] w-full mx-auto mt-2">
                        <ChatOld
                            messages={messages}
                            input={input}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            status={status}
                        />
                    </div>
                )}
            </main>
        </>
    );
}
// TODO Fetch notes in layout.tsx and pass notes as prop to NotesController instead of fetching in NotesController. Then have
// NotesController either display NotesEditor or the AI chat page. Or better yet quickly figure out providers and do that jazz.
