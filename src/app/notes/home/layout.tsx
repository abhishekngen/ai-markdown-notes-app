import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {NotesSidebar} from "@/components/notes/notes-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <NotesSidebar/>
            <main className="m-2 w-9/12">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    )
}
