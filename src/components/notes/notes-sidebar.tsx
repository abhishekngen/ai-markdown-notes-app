'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from '@/components/ui/sidebar';

import { Note } from '@/types/notes-types';
import { Button } from '@/components/ui/button';
import React from 'react';
import { Message } from '@ai-sdk/react';
import { Trash } from 'lucide-react';
import { deleteNote } from '@/server/db/notes-queries';
import { toast } from 'react-toastify';
import LogoutButton from '@/components/auth/logout';

interface NotesSidebarProps {
    notes: Note[] | null;
    setNotes: React.Dispatch<React.SetStateAction<Note[] | null>>;
    currentNote: Note | null;
    setCurrentNote: React.Dispatch<React.SetStateAction<Note | null>>;
    setOriginalNote: React.Dispatch<React.SetStateAction<Note | null>>;
    createNote: (noteTitle: string, noteContent: string) => Promise<void>;
    setMessages: (
        messages: Message[] | ((messages: Message[]) => Message[])
    ) => void;
}

export function NotesSidebar({
    notes,
    setNotes,
    currentNote,
    setCurrentNote,
    setOriginalNote,
    createNote,
    setMessages,
}: NotesSidebarProps) {
    const { isMobile, toggleSidebar } = useSidebar();

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <h1 className="text-2xl font-bold text-center">notes:</h1>
            </SidebarHeader>
            <SidebarContent className="px-4">
                <Button
                    onClick={async () => {
                        await createNote('Untitled Note', '');
                        setMessages([
                            {
                                id: '',
                                role: 'system',
                                content:
                                    'Hey AI, there is no note content available. Let the user know they need to write something first.',
                            },
                        ]);
                    }}
                >
                    Create New Note
                </Button>
                {notes
                    ? notes.map((note) => {
                          return (
                              <div
                                  key={note.id}
                                  className={`flex items-center justify-between p-3 rounded-md cursor-pointer hover:bg-muted ${
                                      currentNote?.id === note.id
                                          ? 'bg-muted'
                                          : ''
                                  }`}
                                  onClick={() => {
                                      setCurrentNote(note);
                                      setOriginalNote({ ...note });
                                      if (!note.note_content.trim()) {
                                          setMessages([
                                              {
                                                  id: '',
                                                  role: 'system',
                                                  content:
                                                      'Hey AI, there is no note content available. Let the user know they need to write something first.',
                                              },
                                          ]);
                                      } else {
                                          const contextToAdd = `
                                    Hey AI, below is a note written by the user. Please only answer questions about this note.
                                    
                                    Note Title: ${note.note_title}
                                    
                                    Note content: 
                                    ${note.note_content}
                                    `;

                                          setMessages([
                                              {
                                                  id: '',
                                                  role: 'system',
                                                  content: contextToAdd,
                                              },
                                          ]);
                                      }
                                      if (isMobile) {
                                          toggleSidebar();
                                      }
                                  }}
                              >
                                  <div className={`flex-1`}>
                                      <h3 className="font-medium truncate">
                                          {note.id === currentNote?.id
                                              ? currentNote.note_title
                                              : note.note_title}
                                      </h3>
                                      <p className="w-40 text-sm text-muted-foreground truncate">
                                          {note.id === currentNote?.id
                                              ? currentNote?.note_content
                                              : note.note_content.substring(
                                                    0,
                                                    60
                                                )}
                                      </p>
                                  </div>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={async (e) => {
                                          e.stopPropagation(); // Prevents triggering note selection
                                          await deleteNote(note.id);
                                          setNotes(
                                              notes.filter(
                                                  (prevNote) =>
                                                      prevNote.id !== note.id
                                              )
                                          );
                                          if (currentNote?.id === note.id) {
                                              setCurrentNote(null);
                                              setOriginalNote(null);
                                          }
                                          toast('Note deleted', {
                                              type: 'success',
                                              autoClose: 1000,
                                          });
                                      }}
                                      className="hover:text-red-500"
                                  >
                                      <Trash className="w-4 h-4" />
                                  </Button>
                              </div>
                          );
                      })
                    : 'No notes found'}
            </SidebarContent>
            <SidebarFooter className="px-4">
                <LogoutButton />
            </SidebarFooter>
        </Sidebar>
    );
}
