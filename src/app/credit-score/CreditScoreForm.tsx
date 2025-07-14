'use client';

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

type CheckState = 'initial' | 'loading' | 'result';

export default function CreditScoreForm() {
  const { toast } = useToast();
  const [checkState, setCheckState] = useState<CheckState>('initial');
  const [score, setScore] = useState(0);
  const [pan, setPan] = useState('');
  const [aadhar, setAadhar] = useState('');

  useEffect(() => {
    const storedScore = localStorage.getItem('userCreditScore');
    if (storedScore) {
      try {
        const { score: savedScore, pan: savedPan, aadhar: savedAadhar } = JSON.parse(storedScore);
        if (savedScore && savedPan && savedAadhar) {
          setScore(savedScore);
          setPan(savedPan);
          setAadhar(savedAadhar);
          setCheckState('result');
        }
      } catch (e) {
        console.error("Failed to parse user credit score from localStorage", e);
        localStorage.removeItem('userCreditScore');
      }
    }
  }, []);

  useEffect(() => {
    if (checkState === 'loading') {
      const timer = setTimeout(() => {
        const randomScore = Math.floor(Math.random() * (850 - 600 + 1)) + 600;
        setScore(randomScore);

        const newScoreEntry = { score: randomScore, date: new Date().toISOString(), pan, aadhar };

        localStorage.setItem('userCreditScore', JSON.stringify(newScoreEntry));

        const allScoresJSON = localStorage.getItem('allCreditScores');
        let allScores = [];
        if (allScoresJSON) {
          try {
            allScores = JSON.parse(allScoresJSON);
            if (!Array.isArray(allScores)) allScores = [];
          } catch (e) {
            allScores = [];
          }
        }
        
        allScores.push(newScoreEntry);
        localStorage.setItem('allCreditScores', JSON.stringify(allScores));
        
        setCheckState('result');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [checkState, pan, aadhar]);

  const handlePanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    let formattedPan = '';

    for (let i = 0; i < value.length && i < 10; i++) {
        const char = value[i];
        if (i < 5) { // First 5 are letters
            if (char >= 'A' && char <= 'Z') {
                formattedPan += char;
            }
        } else if (i < 9) { // Next 4 are numbers
            if (char >= '0' && char <= '9') {
                formattedPan += char;
            }
        } else { // Last one is a letter
            if (char >= 'A' && char <= 'Z') {
                formattedPan += char;
            }
        }
    }
    setPan(formattedPan);
  };

  const handleCheckScore = () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) {
        toast({
            variant: 'destructive',
            title: 'Invalid PAN Number',
            description: 'Please enter a valid 10-character PAN number.',
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
    localStorage.removeItem('userCreditScore');
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
                      <Input id="pan" value={pan} onChange={handlePanChange} placeholder="ABCDE1234F" maxLength={10} required />
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
