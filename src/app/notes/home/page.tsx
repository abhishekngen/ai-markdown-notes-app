import { fetchNotes } from '@/server/db/notes-queries';
import NotesController from '@/components/notes/notes-controller';

export default async function Home() {
    const notes = (await fetchNotes()).data ?? [];
    return <NotesController notes={notes} />;
}
