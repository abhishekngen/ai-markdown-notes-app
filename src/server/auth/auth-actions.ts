'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/supabase-server';

export async function login(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // TODO in practice, you should validate your inputs
    const credentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { data, error } = await supabase.auth.signInWithPassword(credentials);

    return { data, error };
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const credentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { data, error } = await supabase.auth.signUp(credentials);

    return { data, error };
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        },
    });

    if (error) {
        redirect('/login');
    }

    redirect(data.url);
}

export async function getCurrentUser() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        redirect('/login');
    }

    return data?.user;
}
