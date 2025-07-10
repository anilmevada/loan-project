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
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type CheckState = 'initial' | 'loading' | 'result';

export default function CreditScorePage() {
  const [checkState, setCheckState] = useState<CheckState>('initial');
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (checkState === 'loading') {
      const timer = setTimeout(() => {
        // Simulate a score between 600 and 850
        const randomScore = Math.floor(Math.random() * (850 - 600 + 1)) + 600;
        setScore(randomScore);
        setCheckState('result');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [checkState]);

  const handleCheckScore = () => {
    setCheckState('loading');
  };

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
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-3xl">Check Your Credit Score</CardTitle>
            <CardDescription>
              Get your latest credit score from CIBIL for free, in minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[250px] flex items-center justify-center">
            {checkState === 'initial' && (
              <Button size="lg" onClick={handleCheckScore}>
                Check Your Score for FREE
              </Button>
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
              <div className="w-full space-y-4 animate-in fade-in duration-500">
                <p className="text-sm text-muted-foreground">Your CIBIL Score is</p>
                <p className={`text-7xl font-bold ${scoreInfo.color}`}>
                  {score}
                </p>
                <Progress value={progressValue} aria-label={`Credit score of ${score}`} />
                <p className={`font-semibold ${scoreInfo.color}`}>{scoreInfo.text}</p>
                <Button variant="outline" onClick={() => setCheckState('initial')}>Check Again</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
