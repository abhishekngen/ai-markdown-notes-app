'use client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Note } from '@/types/notes-types';
import { Message } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import Tiptap from '@/components/notes/tiptap/tiptap'

interface NotesEditorProps {
    currentNote: Note | null;
    setCurrentNote: React.Dispatch<React.SetStateAction<Note | null>>;
    originalNote: Note | null;
    createNote: (noteTitle: string, noteContent: string) => Promise<void>;
    saveNote: () => Promise<void>;
    messages: UIMessage[];
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
}

export default function NotesEditor({
    currentNote,
    setCurrentNote,
    originalNote,
    createNote,
    saveNote,
    messages,
    setMessages,
}: NotesEditorProps) {
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const saveStateTimeout = setTimeout(() => {
            if (
                currentNote?.note_title !== originalNote?.note_title ||
                currentNote?.note_content !== originalNote?.note_content
            ) {
                setIsSaving(true);
            }
        }, 350);

        const timeout = setTimeout(async () => {
            if (
                currentNote?.note_title !== originalNote?.note_title ||
                currentNote?.note_content !== originalNote?.note_content
            ) {
                console.log(currentNote);
                console.log(originalNote);

                await saveNote();
                setIsSaving(false);
            }
        }, 1000);

        return () => {
            clearTimeout(saveStateTimeout);
            clearTimeout(timeout);
        };
    }, [currentNote?.note_title, currentNote?.note_content]);

    return (
        <Card className="h-[75vh] min-h-100 max-sm:p-0 max-sm:shadow-none max-sm:border-none mx-auto mt-2">
            <CardHeader className="pb-3 max-sm:px-0">
                <CardTitle className="max-sm:w-[95%] max-sm:mx-auto md:text-xl">
                    {currentNote ? (
                        <Input
                            value={currentNote.note_title}
                            onFocus={(e) =>
                                currentNote?.note_title === 'Untitled Note' &&
                                e.target.select()
                            }
                            onChange={(e) => {
                                setCurrentNote({
                                    ...currentNote,
                                    note_title: e.target.value,
                                });
                                const contextToAdd = currentNote
                                    ? `
                                Hey AI, below is a note written by the user. Please only answer questions about this note.
                                
                                Note Title: ${e.target.value}
                                
                                Note content: 
                                ${currentNote.note_content}
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
                            }}
                            className="font-bold md:text-xl"
                            placeholder="Note title"
                        />
                    ) : (
                        'Select or create a note'
                    )}
                </CardTitle>
                {currentNote && currentNote.last_updated_at && (
                    <CardDescription className="mt-2 max-sm:mx-auto">
                        Last edited:{' '}
                        {new Date(
                            currentNote.last_updated_at
                        ).toLocaleDateString()}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="h-11/12 max-sm:p-0">
                {currentNote ? (
                    <Tabs
                        defaultValue="edit"
                        className="h-full max-sm:w-screen"
                    >
                        <TabsList className="mb-2 max-sm:mx-auto">
                            <TabsTrigger value="edit">Edit</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="edit"
                            className="h-full max-sm:w-[95%] max-sm:mx-auto"
                        >
                            <Tiptap currentNote={currentNote} setCurrentNote={setCurrentNote} messages={messages} setMessages={setMessages} />
                            {/*<Textarea*/}
                            {/*    value={currentNote.note_content}*/}
                            {/*    onChange={(e) => {*/}
                            {/*        setCurrentNote({*/}
                            {/*            ...currentNote,*/}
                            {/*            note_content: e.target.value,*/}
                            {/*        });*/}
                            {/*        const contextToAdd = currentNote*/}
                            {/*            ? `*/}
                            {/*        Hey AI, below is a note written by the user. Please only answer questions about this note.*/}
                            {/*        */}
                            {/*        Note Title: ${currentNote.note_title}*/}
                            {/*        */}
                            {/*        Note content: */}
                            {/*        ${e.target.value}*/}
                            {/*        `*/}
                            {/*            : 'Do not answer any question.';*/}
                            {/*        if (messages.length > 0) {*/}
                            {/*            setMessages(*/}
                            {/*                messages.map((message) => {*/}
                            {/*                    if (message.role === 'system') {*/}
                            {/*                        return {*/}
                            {/*                            id: '',*/}
                            {/*                            role: 'system',*/}
                            {/*                            content: contextToAdd,*/}
                            {/*                        };*/}
                            {/*                    } else {*/}
                            {/*                        return message;*/}
                            {/*                    }*/}
                            {/*                })*/}
                            {/*            );*/}
                            {/*        } else {*/}
                            {/*            setMessages([*/}
                            {/*                {*/}
                            {/*                    id: '',*/}
                            {/*                    role: 'system',*/}
                            {/*                    content: contextToAdd,*/}
                            {/*                },*/}
                            {/*            ]);*/}
                            {/*        }*/}
                            {/*    }}*/}
                            {/*    placeholder="Write your markdown here..."*/}
                            {/*    className="h-[95%] flex-none field-sizing-fixed resize-none font-mono max-sm:border-none"*/}
                            {/*/>*/}
                        </TabsContent>
                        <TabsContent
                            value="preview"
                            className="h-full max-sm:w-[95%] max-sm:mx-auto"
                        >
                            <ScrollArea className="h-[95%] md:border rounded-md p-4">
                                {currentNote.note_content ? (
                                    <ReactMarkdown>
                                        {currentNote.note_content}
                                    </ReactMarkdown>
                                ) : (
                                    <p className="text-muted-foreground">
                                        Nothing to preview
                                    </p>
                                )}
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="flex items-center justify-center h-full md:border rounded-md">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-4">
                                No note selected
                            </p>
                            <Button
                                onClick={async () =>
                                    await createNote('Untitled Note', '')
                                }
                            >
                                <Plus className="h-4 w-4 mr-2" /> Create a new
                                note
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
            {currentNote && (
                <CardFooter>
                    <CardDescription className="flex gap-1 items-center">
                        {isSaving ? (
                            <>
                                <p>Saving...</p>
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-t-transparent"></span>
                            </>
                        ) : (
                            <p>Saved</p>
                        )}
                    </CardDescription>
                </CardFooter>
            )}
        </Card>
    );
}
