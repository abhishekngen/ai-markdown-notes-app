'use server';

import {getCurrentUser} from "@/server/auth/auth-actions";
import {createClient} from "@/lib/supabase/supabase-server";
import {Note} from "@/types/notes-types";
import {toast} from "react-toastify";

export async function fetchNotes() {
    const user = await getCurrentUser();
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('notes')
        .select()
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if(error) {
        console.log(error);
        return null;
    }

    return data as Note[]; // TODO change to proper type validation
}

export async function createNote(noteTitle: string, noteContent: string) {
    const user = await getCurrentUser();
    const supabase = await createClient();

    const { data, error } = await supabase.from('notes').insert([{note_title: noteTitle, note_content: noteContent, user_id: user.id}]).select().single();

    if(error) {
        console.log(error);
        toast("An error occurred!", {type: "error", autoClose: 3000});
    }
    return data as Note;
}

export async function updateNote(noteId: string, noteTitle: string, noteContent: string) {
    const supabase = await createClient();

    const { error } = await supabase.from('notes').update({note_title: noteTitle, note_content: noteContent}).eq('id', noteId).select();
    if(error) {
        console.log(error);
        toast("An error occurred!", {type: "error", autoClose: 3000});
    }
    return;
}

export async function deleteNote(noteId: string) {
    const supabase = await createClient();

    const { error } = await supabase.from('notes').delete().eq('id', noteId);

    if(error) {
        console.log(error);
        toast("An error occurred!", {type: "error", autoClose: 3000});
    }
    return;
}
