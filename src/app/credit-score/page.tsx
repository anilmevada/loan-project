'use client';

import AppLayout from '@/components/AppLayout';
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
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Free Credit Score Check | LOAN BUDDY.COM',
    description: 'Check your CIBIL credit score for free in just a few steps. Get an instant and secure report to understand your financial health.',
};

type CheckState = 'initial' | 'loading' | 'result';

function CreditScoreForm() {
  const { toast } = useToast();
  const [checkState, setCheckState] = useState<CheckState>('initial');
  const [score, setScore] = useState(0);
  const [pan, setPan] = useState('');
  const [aadhar, setAadhar] = useState('');

  useEffect(() => {
    // Check if a score is already in localStorage
    const storedScore = localStorage.getItem('creditScore');
    if (storedScore) {
      setScore(JSON.parse(storedScore).score);
      setCheckState('result');
    }
  }, []);


  useEffect(() => {
    if (checkState === 'loading') {
      const timer = setTimeout(() => {
        // Simulate a score between 600 and 850
        const randomScore = Math.floor(Math.random() * (850 - 600 + 1)) + 600;
        setScore(randomScore);
        // Save the new score and date to localStorage
        localStorage.setItem('creditScore', JSON.stringify({ score: randomScore, date: new Date() }));
        setCheckState('result');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [checkState]);

  const handleCheckScore = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
        toast({
            variant: 'destructive',
            title: 'Invalid PAN Number',
            description: 'Please enter a valid PAN in the format ABCDE1234F.',
        });
        return;
    }
      
    if (aadhar.length !== 12) {
      toast({
        variant: 'destructive',
        title: 'Invalid Aadhar Number',
        description: 'Please enter a valid 12-digit Aadhar number.',
      });
      return;
    }
    setCheckState('loading');
  };

  const handleReset = () => {
    setPan('');
    setAadhar('');
    localStorage.removeItem('creditScore');
    setCheckState('initial');
  }

  const getScoreDescription = (s: number) => {
    if (s >= 800) return { text: 'Excellent', color: 'text-green-600' };
    if (s >= 740) return { text: 'Very Good', color: 'text-green-500' };
    if (s >= 670) return { text: 'Good', color: 'text-yellow-500' };
    if (s >= 580) return { text: 'Fair', color: 'text-orange-500' };
    return { text: 'Poor', color: 'text-red-500' };
  };

  const scoreInfo = getScoreDescription(score);
  // Normalize score from 300-850 range to 0-100 for progress bar
  const progressValue = ((score - 300) / (850 - 300)) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Check Your Credit Score</CardTitle>
          <CardDescription>
            Enter your Aadhar and PAN details to get your latest CIBIL score for free.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] flex items-center justify-center">
          {checkState === 'initial' && (
            <div className="w-full max-w-sm space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="pan">PAN Card Number</Label>
                      <Input id="pan" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} required />
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="aadhar">Aadhar Card Number</Label>
                      <Input id="aadhar" type="text" value={aadhar} onChange={(e) => setAadhar(e.target.value.replace(/\D/g, '').slice(0, 12))} placeholder="xxxx xxxx xxxx" maxLength={12} required />
                  </div>
               </div>
              <Button size="lg" onClick={handleCheckScore} disabled={!pan || !aadhar} className="w-full">
                Check Your Score for FREE
              </Button>
            </div>
          )}
          {checkState === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">
                Securely fetching your credit report...
              </p>
            </div>
          )}
          {checkState === 'result' && (
            <div className="w-full space-y-4 animate-in fade-in duration-500 text-center">
              <p className="text-sm text-muted-foreground">Your CIBIL Score is</p>
              <p className={`text-7xl font-bold ${scoreInfo.color}`}>
                {score}
              </p>
              <Progress value={progressValue} aria-label={`Credit score of ${score}`} />
              <p className={`font-semibold ${scoreInfo.color}`}>{scoreInfo.text}</p>
              <Button variant="outline" onClick={handleReset}>Check Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreditScorePage() {
    return (
        <AppLayout>
            <title>{metadata.title as string}</title>
            <meta name="description" content={metadata.description as string} />
            <CreditScoreForm />
        </AppLayout>
    );
}