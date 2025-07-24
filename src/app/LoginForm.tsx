'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/Logo';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getAuth, sendSignInLinkToEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type LoginState = 'initial' | 'link_sent' | 'loading';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('initial');
  const router = useRouter();
  const { toast } = useToast();

  const handleSendLink = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
      });
      return;
    }

    setLoginState('loading');

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: `${window.location.origin}/finish-login`,
      // This must be true.
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      window.localStorage.setItem('emailForSignIn', email);
      setLoginState('link_sent');
      toast({
        title: 'Secure Link Sent',
        description: `A sign-in link has been sent to ${email}. Check your inbox!`,
      });
    } catch (error: any) {
      setLoginState('initial');
      const errorCode = error.code;
      const errorMessage = error.message;
      toast({
        variant: 'destructive',
        title: 'Error Sending Link',
        description: errorMessage,
      });
    }
  };


  return (
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-2 text-center">
            <div className="inline-block mx-auto">
                <Logo />
            </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            {loginState !== 'link_sent'
                ? 'Enter your email to receive a secure login link.'
                : "We've sent a magic link to your email. Click it to log in."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             {loginState === 'loading' ? (
                 <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
              ) : loginState !== 'link_sent' ? (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSendLink} className="w-full">
                        Send Secure Link
                    </Button>
                </>
            ) : (
                <div className="text-center p-4 bg-accent/20 rounded-md">
                    <p>Please check your email inbox and click the link to complete your login.</p>
                </div>
            )}

            <Button variant="outline" className="w-full">
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
  )
}
