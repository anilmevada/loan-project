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

type LoginState = 'initial' | 'otp_sent' | 'loading';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('initial');
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = () => {
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
    // Simulate sending OTP
    setTimeout(() => {
      setLoginState('otp_sent');
      toast({
        title: 'OTP Sent',
        description: `An OTP has been sent to ${email}. (Hint: use 123456)`,
      });
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The OTP you entered is incorrect. Please try again.',
      });
      return;
    }

    // If validation passes, navigate to dashboard
    router.push('/dashboard');
  };
  
  const handleBack = () => {
    setOtp('');
    setLoginState('initial');
  }

  return (
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="space-y-2 text-center">
            <div className="inline-block mx-auto">
                <Logo />
            </div>
          <CardTitle className="text-2xl">User Login</CardTitle>
          <CardDescription>
            {loginState === 'initial' 
                ? 'Enter your email to receive a secure login code.'
                : "We've sent a 6-digit code to your email."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
             {loginState === 'loading' ? (
                 <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 </div>
             ) : loginState === 'initial' ? (
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
                    <Button onClick={handleSendOtp} className="w-full">
                        Send OTP
                    </Button>
                </>
            ) : (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="otp">One-Time Password (OTP)</Label>
                        <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                        />
                    </div>
                    <Button onClick={handleVerifyOtp} className="w-full">
                      Verify & Login
                    </Button>
                    <Button variant="link" size="sm" onClick={handleBack} className="text-sm">
                        Use a different email
                    </Button>
                </>
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
