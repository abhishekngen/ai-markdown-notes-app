import { redirect } from 'next/navigation';

export default function LogOutPage() {
    redirect('/login');
}
