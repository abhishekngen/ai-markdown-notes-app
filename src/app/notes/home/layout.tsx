import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import '@mdxeditor/editor/style.css'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <SidebarProvider>{children}</SidebarProvider>
        </>
    );
}
