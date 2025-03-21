'use client';
import { useNoteStore } from '@/store/notes-store';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { deleteNote } from '@/server/db/notes-queries';
import { Trash } from 'lucide-react';
import LogoutButton from '@/components/auth/logout';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import CreateNoteButton from '@/components/notes/create-note-button';
import { toast } from 'sonner';

export default function NotesSidebar() {
    const { notes, setNotes, currentNote, setCurrentNote, setOriginalNote } =
        useNoteStore(
            useShallow((state) => ({
                notes: state.notes,
                setNotes: state.setNotes,
                currentNote: state.currentNote,
                setCurrentNote: state.setCurrentNote,
                setOriginalNote: state.setOriginalNote,
            }))
        );

    const { isMobile, toggleSidebar } = useSidebar();

    return (
        <Sidebar>
            <SidebarHeader className="p-4">
                <h1 className="text-2xl font-bold text-center">notes:</h1>
            </SidebarHeader>
            <SidebarContent className="px-4">
                <CreateNoteButton
                    notes={notes}
                    setNotes={setNotes}
                    setCurrentNote={setCurrentNote}
                    setOriginalNote={setOriginalNote}
                />
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
                                              ? currentNote?.note_content_raw_text
                                              : note.note_content_raw_text?.substring(
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
                                          const { data: deletedNote, error } =
                                              await deleteNote(note.id);
                                          if (error) {
                                              toast(error.message);
                                          } else {
                                              setNotes(
                                                  notes.filter(
                                                      (prevNote) =>
                                                          prevNote.id !==
                                                          note.id
                                                  )
                                              );
                                              if (currentNote?.id === note.id) {
                                                  setCurrentNote(null);
                                                  setOriginalNote(null);
                                              }
                                              toast(
                                                  `${deletedNote!.note_title} deleted!`
                                              );
                                          }
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
