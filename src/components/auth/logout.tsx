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

    return (
        <Button
            onClick={handleLogout}
            // className="px-4 py-2 bg-red-500 text-white rounded"
        >
            Log Out
        </Button>
    );
}
