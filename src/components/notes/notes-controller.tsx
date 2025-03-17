'use client';
import { Note } from '@/types/notes-types';
import { useNoteStore } from '@/store/notes-store';
import NotesSidebar from '@/components/notes/notes-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import NotesEditor from '@/components/notes/notes-editor';
import React, { useEffect, useState } from 'react';
import Chat from '@/components/ai/chat';
import { ArrowLeft, BotMessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { useChat } from '@ai-sdk/react';

interface NotesControllerProps {
    notes: Note[];
}

export default function NotesController({ notes }: NotesControllerProps) {
    const currentNote = useNoteStore((state) => state.currentNote);
    const setOriginalNote = useNoteStore((state) => state.setOriginalNote);

    useEffect(() => {
        useNoteStore.setState({ notes });
    }, [notes]);

    const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);

    const chat = useChat({
        api: '/api/chat',
    });

    return (
        <>
            <NotesSidebar />
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
                    <NotesEditor />
                ) : (
                    <div className="h-[75vh] w-full mx-auto mt-2">
                        <Chat {...chat} />
                    </div>
                )}
            </main>
        </>
    );
}
