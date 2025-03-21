'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/supabase-client';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    async function handleLogout() {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return <Button onClick={handleLogout}>Log Out</Button>;
}
