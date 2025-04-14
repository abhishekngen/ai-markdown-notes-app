import { useNoteStore } from '@/store/notes-store';
import { render, screen, waitFor, act } from '@testing-library/react';
import NotesController from '@/components/notes/notes-controller';
import NotesEditor from '@/components/notes/notes-editor';
import Chat from '@/components/ai/chat';
import { makeMockNote } from '@/tests/utils/mock-note';
import userEvent from '@testing-library/user-event';
import { updateNote as saveNoteInDB } from '@/server/db/notes-queries';
import React from 'react';

vi.mock('@/components/notes/notes-editor', () => ({
    default: vi.fn(() => <div>Mocked Child</div>),
}));
const notesEditorModule = await vi.importActual<
    typeof import('@/components/notes/notes-editor')
>('@/components/notes/notes-editor');
const NotesEditorActual = notesEditorModule.default;

vi.mock('@/components/notes/notes-sidebar', () => ({
    default: vi.fn(() => <div>Mocked Child</div>),
}));
const notesSidebarModule = await vi.importActual<
    typeof import('@/components/notes/notes-sidebar')
>('@/components/notes/notes-sidebar');
const NotesSidebarActual = notesSidebarModule.default;

vi.mock('@/components/ui/sidebar', async () => {
    const actual = await vi.importActual<
        typeof import('@/components/ui/sidebar')
    >('@/components/ui/sidebar');

    return {
        ...actual,
        SidebarTrigger: vi.fn(() => <div>Mocked Child</div>),
        useSidebar: vi.fn(() => ({
            isMobile: false,
            toggleSidebar: vi.fn(),
        })),
        Sidebar: ({ children }: React.PropsWithChildren) => (
            <div data-testid="mock-sidebar">{children}</div> // vi.fn() creates a mock function that is spied on - this doesn't need to be spied on. This is mocking the component function that takes in a props argument. But interestingly, React also passes in props as children
        ),
        SidebarContent: ({ children }: React.PropsWithChildren) => (
            <div data-testid="mock-sidebar-content">{children}</div>
        ),
        SidebarHeader: ({ children }: React.PropsWithChildren) => (
            <div data-testid="mock-sidebar-header">{children}</div>
        ),
        SidebarFooter: ({ children }: React.PropsWithChildren) => (
            <div data-testid="mock-sidebar-footer">{children}</div>
        ),
    };
});
vi.mock('@/components/auth/logout', () => ({
    default: vi.fn(() => <button>Mocked Logout Button</button>),
}));

vi.mock('@/components/ai/chat', () => ({
    default: vi.fn(() => <div>Mocked Child</div>), // is it ok to pass props to this lol - ig yh as it takes any args
}));
vi.mock('@ai-sdk/react');
vi.mock('@/server/db/notes-queries');
vi.mock('@/server/vector-operations/text-chunking');
vi.mock('@/server/vector-operations/text-embeddings');
vi.mock('openai');

// TODO abstract into another function probably
function getBoundingClientRect() {
    const rec = {
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
    };
    return { ...rec, toJSON: () => rec };
}

class FakeDOMRectList extends DOMRect {
    item(index: string | number) {
        // @ts-expect-error cannot take index type
        return this[index];
    }
}

document.elementFromPoint = () => null;
HTMLElement.prototype.getBoundingClientRect = getBoundingClientRect;
// @ts-expect-error for tiptap editor

HTMLElement.prototype.getClientRects = () => new FakeDOMRectList();
Range.prototype.getBoundingClientRect = getBoundingClientRect;
// @ts-expect-error for tiptap editor
Range.prototype.getClientRects = () => new FakeDOMRectList();

const originalNotesState = useNoteStore.getState();

afterEach(() => {
    vi.clearAllMocks();
    act(() => useNoteStore.setState(originalNotesState)); // Causes a state change to a component (despite being unmounted) so needs to be wrapped in act
});

describe('notes controller tests', () => {
    it('should initially render with notes editor component and disabled ai chat button since no note is selected', () => {
        render(<NotesController notes={[]} />);
        expect(NotesEditor).toHaveBeenCalled();

        const aiChatButton = screen.getByRole('button', { name: /Chat/i });
        expect(aiChatButton).toBeDisabled();
    });

    it('should render AI Chat when a note is selected and button is clicked', async () => {
        const mockNote = makeMockNote();
        useNoteStore.setState({
            currentNote: mockNote,
        });

        render(<NotesController notes={[mockNote]} />);

        const aiChatButton = await screen.findByRole('button', {
            name: /chat/i,
        });

        const user = userEvent.setup();

        await user.click(aiChatButton);

        expect(Chat).toHaveBeenCalled();
    });
});

describe('notes editor tests', () => {
    it('should render with appropriate text when no note is selected', () => {
        render(<NotesEditorActual />);
        expect(screen.getByText(/no note/i)).toBeInTheDocument();
        expect(screen.getByText(/create a note/i)).toBeInTheDocument();
    });

    it('editing the title triggers an automatic save', async () => {
        const mockNote = makeMockNote({
            note_title: '',
            note_content: '',
        });
        useNoteStore.setState({
            currentNote: mockNote,
            originalNote: mockNote,
        });

        render(<NotesEditorActual />);
        const titleInput = await screen.findByPlaceholderText(/title/i);
        const user = userEvent.setup();

        await user.type(titleInput, 'a');

        await waitFor(
            () => {
                expect(saveNoteInDB).toHaveBeenCalled();
            },
            { timeout: 500 }
        );
    });

    it('editing the note content triggers an automatic save and updates the html preview', async () => {
        const mockNote = makeMockNote({
            note_title: 'mock title',
            note_content: '<p>mock note</p>',
        });
        useNoteStore.setState({
            currentNote: mockNote,
            originalNote: mockNote,
        });

        render(<NotesEditorActual />);
        const contentInput =
            await screen.findByPlaceholderText(/start typing/i);
        const user = userEvent.setup();

        await user.click(contentInput);
        await user.type(contentInput, 'a');

        await waitFor(
            () => {
                expect(saveNoteInDB).toHaveBeenCalled();
            },
            { timeout: 500 }
        );

        const htmlPreviewTabButton = await screen.findByRole('tab', {
            name: /preview/i,
        });

        await user.click(htmlPreviewTabButton);
        const htmlPreview = await screen.findByText(/mock notea/i);
        expect(htmlPreview).toBeInTheDocument();
    });
});

describe('notes sidebar tests', () => {
    it('should render with appropriate text when no note is selected', () => {
        render(<NotesSidebarActual />);
        expect(screen.getByText(/no notes/i)).toBeInTheDocument();
        expect(screen.getByText(/create new note/i)).toBeInTheDocument();
    });

    it('clicking a note selects that note', async () => {
        const mockNote = makeMockNote({
            id: '1',
            note_title: 'mock title',
            note_content: '<p>mock note</p>',
            note_content_raw_text: 'mock note',
        });
        useNoteStore.setState({
            notes: [mockNote],
        });

        render(<NotesSidebarActual />);
        const titleInput = screen.getByText('mock title');
        const user = userEvent.setup();

        await user.click(titleInput);

        expect(useNoteStore.getState().currentNote).eql(mockNote); // Does deep comparison as opposed to .eq
    });
});
