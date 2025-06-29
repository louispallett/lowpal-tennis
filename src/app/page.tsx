import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/home');
}

/*

Still need to:

Create account page for users to update details and password
Create forgot password functionality
Handle confirmation emails, etc.
ERROR HANDLING!

*/