'use client';
import React, { useEffect, useState } from 'react';
import { Note } from '@/types/notes-types';
import {
    updateNote as saveNoteInDB,
    createNote as createNoteInDB,
    fetchNotes,
} from '@/server/db/notes-queries';
import { NotesSidebar } from '@/components/notes/notes-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NotesEditor from '@/components/notes/notes-editor';
import { toast } from 'react-toastify';
import Chat from '@/components/ai/chat';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BotMessageSquare } from 'lucide-react';
import { useChat } from '@ai-sdk/react';

export default function NotesController() {
    const [notes, setNotes] = useState<Note[] | null>(null);
    const [currentNote, setCurrentNote] = useState<Note | null>(null);
    const [isAIChatOpen, setIsAIChatOpen] = useState(false);

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
    };

    const saveNote = async () => {
        if (currentNote && notes) {
            await saveNoteInDB(
                currentNote.id,
                currentNote.note_title,
                currentNote.note_content
            );
            setNotes(
                notes.map((note) => {
                    return note.id === currentNote.id ? currentNote : note;
                })
            );
            toast('Note saved!', { type: 'success', autoClose: 1000 });
        }
    };

    // TODO Lift this into server component
    useEffect(() => {
        async function loadNotes() {
            const fetchedNotes = await fetchNotes();
            setNotes(fetchedNotes);
        }

        loadNotes();
    }, []);

    // TODO move AI context parsing to backend

    return (
        <>
            <NotesSidebar
                notes={notes}
                setNotes={setNotes}
                currentNote={currentNote}
                setCurrentNote={setCurrentNote}
                createNote={createNote}
                setMessages={setMessages}
            />
            <main className="mt-10 sm:w-screen md:w-9/12 mx-auto">
                <div className="flex justify-between">
                    <SidebarTrigger />
                    <Button
                        className="mr-4 mb-1"
                        onClick={() => setIsAIChatOpen(!isAIChatOpen)}
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
                    <NotesEditor
                        currentNote={currentNote}
                        setCurrentNote={setCurrentNote}
                        createNote={createNote}
                        saveNote={saveNote}
                        messages={messages}
                        setMessages={setMessages}
                    />
                ) : (
                    <div className="h-[75vh] w-full mx-auto mt-2">
                        <Chat
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
