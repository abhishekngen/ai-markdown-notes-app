'use client';
import { useNoteStore } from '@/store/notes-store'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Tiptap from '@/components/notes/tiptap/tiptap'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    createNote as createNoteInDB,
    createNote,
    updateNote as saveNoteInDB,
} from '@/server/db/notes-queries'
// @ts-expect-error html is not typed in package
import { html as beautifyHtml } from 'js-beautify';
import { useShallow } from 'zustand/react/shallow'
import CreateNoteButton from '@/components/notes/create-note-button'

export default function NotesEditor() {
    const { currentNote, setCurrentNote, originalNote, setOriginalNote, notes, setNotes } = useNoteStore(useShallow((state) => ({
        currentNote: state.currentNote,
        setCurrentNote: state.setCurrentNote,
        originalNote: state.originalNote,
        setOriginalNote: state.setOriginalNote,
        notes: state.notes,
        setNotes: state.setNotes,
    }))); // Use useShallow otherwise React thinks this object is a new object on every render!

    const saveNote = async () => {
        if(currentNote) {
            await saveNoteInDB(
                currentNote.id,
                currentNote.note_title,
                currentNote.note_content,
                currentNote.note_content_raw_text
            );
        }
    }

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
                            <TabsTrigger value="preview">
                                HTML Preview
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent
                            value="edit"
                            className="h-full max-sm:w-[95%] max-sm:mx-auto"
                        >
                            <Tiptap />
                        </TabsContent>
                        <TabsContent
                            value="preview"
                            className="h-full max-sm:w-[95%] max-sm:mx-auto"
                        >
                            <ScrollArea className="h-[95%] md:border rounded-md p-4">
                                {currentNote.note_content ? (
                                    <pre className="whitespace-pre-wrap break-all">
                                        {beautifyHtml(currentNote.note_content)}
                                    </pre>
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
                            {(
                                <>
                                    <p className="text-muted-foreground mb-4">
                                        No note selected
                                    </p>
                                    <CreateNoteButton notes={notes} setNotes={setNotes} setCurrentNote={setCurrentNote} setOriginalNote={setOriginalNote} />
                                </>
                            )}
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
