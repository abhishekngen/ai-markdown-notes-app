'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/supabase-server';
import { toast } from 'react-toastify';

export async function login(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // TODO in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        toast('An error occurred!', { type: 'error', autoClose: 3000 });
        redirect('/auth-error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        console.log(error);
        redirect('/auth-error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        // options: {
        //     queryParams: {
        //         access_type: "offline",
        //         prompt: "consent",
        //     },
        // },
    });

    if (error) {
        console.log(error);
        toast('An error occurred!', { type: 'error', autoClose: 3000 });
        redirect('/auth-error');
    }

    redirect(data.url);
}

export async function getCurrentUser() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
        toast('An error occurred!', { type: 'error', autoClose: 3000 });
        redirect('/login');
    }

    return data?.user;
}
