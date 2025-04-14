'use server';

import { getCurrentUser } from '@/server/auth/auth-actions';
import { createClient } from '@/lib/supabase/supabase-server';
import { Note } from '@/types/notes-types';

export async function fetchNotes() {
    try {
        const user = await getCurrentUser();
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('notes')
            .select()
            .eq('user_id', user.id)
            .order('last_updated_at', { ascending: false });

        if (error) {
            throw error;
        }

        return {
            data: data,
            error: null,
        };
        // return data as Note[]; // TODO change to proper type validation
    } catch (error) {
        return {
            data: null,
            error: Error(`Fetching notes failed: ${(error as Error).message}`),
        };
    }
}

export async function createNote(
    noteTitle: string,
    noteContent: string,
    noteContentRawText?: string
) {
    try {
        const user = await getCurrentUser();
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('notes')
            .insert([
                {
                    note_title: noteTitle,
                    note_content: noteContent,
                    note_content_raw_text: noteContentRawText ?? '',
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (error) {
            throw error;
        }
        return {
            data: data as Note,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: Error(`Creating note failed: ${(error as Error).message}`),
        };
    }
}

export async function updateNote(
    noteId: string,
    noteTitle: string,
    noteContent: string,
    noteContentRawText?: string
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('notes')
            .update({
                note_title: noteTitle,
                note_content: noteContent,
                note_content_raw_text: noteContentRawText ?? '',
            })
            .eq('id', noteId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return {
            data: data as Note,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: Error(`Updating note failed: ${(error as Error).message}`),
        };
    }
}

export async function deleteNote(noteId: string) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('notes')
            .delete()
            .eq('id', noteId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return {
            data: data as Note,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: Error(`Deleting note failed: ${(error as Error).message}`),
        };
    }
}

export async function upsertNoteChunks(
    noteId: string,
    noteChunks: string[],
    noteChunkEmbeddings: number[][]
) {
    try {
        const supabase = await createClient();

        const { error: deleteError } = await supabase
            .from('note_chunks')
            .delete()
            .eq('note_id', noteId);

        if (deleteError) {
            throw deleteError;
        }

        const chunkData = noteChunks.map((chunk, index) => ({
            note_id: noteId,
            note_chunk: chunk,
            embedding: noteChunkEmbeddings[index],
        }));

        const { data, error: insertError } = await supabase
            .from('note_chunks')
            .insert(chunkData);

        if (insertError) {
            throw insertError;
        }

        return {
            data,
            insertError,
        };
    } catch (error) {
        return {
            data: null,
            error: Error(
                `Upserting note chunks failed: ${(error as Error).message}`
            ),
        };
    }
}

export async function noteChunksRagSearch(
    queryEmbedding: number[],
    numberOfMatches: number
) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc('match_note_chunks', {
            query_embedding: queryEmbedding,
            match_threshold: 0.1,
            match_count: numberOfMatches,
        });

        if (error) {
            throw error;
        }

        return {
            data: data,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: Error(`RAG search failed: ${(error as Error).message}`),
        };
    }
}
