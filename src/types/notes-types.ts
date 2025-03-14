export interface Note {
    created_at: string | null;
    id: string;
    note_content: string;
    note_content_raw_text?: string;
    note_title: string;
    user_id: string;
    last_updated_at: string | null;
}
