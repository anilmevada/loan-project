'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
import Link from 'next/link';

type LoginState = 'initial' | 'otp_sent' | 'loading' | 'error';

// This is the ID of the div where the reCAPTCHA will be rendered.
const RECAPTCHA_CONTAINER_ID = 'recaptcha-container';

export default function LoginForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loginState, setLoginState] = useState<LoginState>('initial');
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Initialize reCAPTCHA on component mount
  useEffect(() => {
    // Check if the verifier has already been created
    if (recaptchaVerifier.current) return;

    // We need to make sure the container exists before creating the verifier
    const recaptchaContainer = document.getElementById(RECAPTCHA_CONTAINER_ID);
    if (!recaptchaContainer) return;
    
    try {
      recaptchaVerifier.current = new RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
           toast({
            variant: 'destructive',
            title: 'reCAPTCHA Expired',
            description: 'Please try sending the OTP again.',
           });
           setLoginState('initial');
        }
      });
    } catch (error) {
      console.error("Error creating RecaptchaVerifier:", error)
    }

    return () => {
      // Cleanup the verifier on unmount if it exists
      recaptchaVerifier.current?.clear();
    };
  }, [toast]);
  

  const handleSendOtp = async () => {
    // Simple validation for phone number format (e.g., +1234567890)
    // You can make this more robust as needed.
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        variant: 'destructive',
        title: 'Invalid Phone Number',
        description: 'Please enter a valid phone number with a country code (e.g., +1234567890).',
      });
      return;
    }
    
    if (!recaptchaVerifier.current) {
        toast({
            variant: 'destructive',
            title: 'reCAPTCHA not ready',
            description: 'Please wait a moment and try again.',
        });
        return;
    }

    setLoginState('loading');

    try {
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier.current
      );
      setConfirmationResult(result);
      setLoginState('otp_sent');
      toast({
        title: 'OTP Sent!',
        description: `A 6-digit code has been sent to ${phoneNumber}.`,
      });
    } catch (error: any) {
      console.error('Firebase OTP Error:', error);
      setLoginState('initial');
      toast({
        variant: 'destructive',
        title: 'Failed to Send OTP',
        description: error.message || 'An unexpected error occurred. Please check the console.',
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter the 6-digit code.',
      });
      return;
    }

    if (!confirmationResult) {
       toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: 'Something went wrong. Please try sending the OTP again.',
      });
      setLoginState('initial');
      return;
    }
    
    setLoginState('loading');

    try {
      await confirmationResult.confirm(otp);
      toast({
        title: 'Login Successful!',
        description: 'Welcome back!',
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Firebase Verify OTP Error:', error);
      setLoginState('otp_sent'); // Go back to OTP entry
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect. Please try again.',
      });
    }
  };
  
  const handleBack = () => {
    setOtp('');
    setPhoneNumber('');
    setConfirmationResult(null);
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
          {loginState !== 'otp_sent'
            ? 'Enter your phone number to receive a login code.'
            : "We've sent a 6-digit code to your phone."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {loginState === 'loading' ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : loginState !== 'otp_sent' ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1234567890"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
              <Button
                variant="link"
                size="sm"
                onClick={handleBack}
                className="text-sm"
              >
                Use a different number
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
  );
}
