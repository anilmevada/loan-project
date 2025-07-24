'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function FinishLoginPageContent() {
    const router = useRouter();
    const { toast } = useToast();
    const [message, setMessage] = useState('Verifying your login link...');

    useEffect(() => {
        const finishSignIn = async () => {
            if (isSignInWithEmailLink(auth, window.location.href)) {
                let email = window.localStorage.getItem('emailForSignIn');
                if (!email) {
                    // User opened the link on a different device. To prevent session fixation
                    // attacks, ask the user to provide the email again. For simplicity,
                    // we'll show an error here.
                    setMessage('Login failed. Please try signing in from the same device.');
                    toast({
                        variant: 'destructive',
                        title: 'Login Failed',
                        description: 'Your email is not available on this device. Please try again from the original device.'
                    });
                    router.push('/login');
                    return;
                }

                try {
                    await signInWithEmailLink(auth, email, window.location.href);
                    window.localStorage.removeItem('emailForSignIn');
                    setMessage('Successfully logged in! Redirecting to your dashboard...');
                    toast({
                        title: 'Login Successful!',
                        description: 'Welcome back!',
                    });
                    router.push('/dashboard');
                } catch (error: any) {
                    setMessage('Login failed. The link may have expired or been used already.');
                    toast({
                        variant: 'destructive',
                        title: 'Login Failed',
                        description: 'The sign-in link is invalid. It may have expired or already been used. Please try again.',
                    });
                    router.push('/login');
                }
            } else {
                 setMessage('Invalid login link. Redirecting...');
                 router.push('/login');
            }
        };

        finishSignIn();
    }, [router, toast]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h1 className="text-xl font-semibold">{message}</h1>
        </div>
    );
}


export default function FinishLoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FinishLoginPageContent />
        </Suspense>
    )
}
