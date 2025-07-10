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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useState } from 'react';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Financial Calculators | LOAN BUDDY.COM',
    description: 'Plan your finances with our easy-to-use tools. Calculate your loan EMI and check your loan eligibility in seconds.',
};

function CalculatorsForm() {
  // EMI Calculator State
  const [principal, setPrincipal] = useState<number | string>('');
  const [interest, setInterest] = useState<number | string>('');
  const [tenure, setTenure] = useState<number | string>('');
  const [emi, setEmi] = useState('');

  // Eligibility Calculator State
  const [income, setIncome] = useState<number | string>('');
  const [existingEmi, setExistingEmi] = useState<number | string>('');
  const [eligibility, setEligibility] = useState('');

  const calculateEmi = () => {
    if (Number(principal) > 0 && Number(interest) > 0 && Number(tenure) > 0) {
      const monthlyInterest = Number(interest) / 12 / 100;
      const numberOfMonths = Number(tenure) * 12;
      const emiValue =
        (Number(principal) *
          monthlyInterest *
          Math.pow(1 + monthlyInterest, numberOfMonths)) /
        (Math.pow(1 + monthlyInterest, numberOfMonths) - 1);
      setEmi(emiValue.toFixed(2));
    } else {
      setEmi('');
    }
  };

  const calculateEligibility = () => {
    if (Number(income) > 0) {
      const maxEmiPossible = Number(income) * 0.5 - Number(existingEmi);
      if (maxEmiPossible > 0) {
        setEligibility(
          `You are likely eligible for a loan with a monthly EMI up to ₹${maxEmiPossible.toFixed(2)}.`
        );
      } else {
        setEligibility(
          'Based on your current income and expenses, you may not be eligible for an additional loan.'
        );
      }
    } else {
      setEligibility('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Calculators</h1>
        <p className="text-muted-foreground">
          Plan your finances with our easy-to-use tools.
        </p>
      </div>
      <Tabs defaultValue="emi" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="emi">EMI Calculator</TabsTrigger>
          <TabsTrigger value="eligibility">
            Loan Eligibility Calculator
          </TabsTrigger>
        </TabsList>
        <TabsContent value="emi">
          <Card>
            <CardHeader>
              <CardTitle>EMI Calculator</CardTitle>
              <CardDescription>
                Calculate the equated monthly installment (EMI) for your loan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Loan Amount (₹)</Label>
                <Input id="principal" type="number" placeholder="e.g., 500000" value={principal} onChange={(e) => setPrincipal(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interest">Interest Rate (% p.a.)</Label>
                <Input id="interest" type="number" step="0.1" placeholder="e.g., 8.5" value={interest} onChange={(e) => setInterest(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                <Input id="tenure" type="number" placeholder="e.g., 5" value={tenure} onChange={(e) => setTenure(e.target.value)} />
              </div>
              <Button onClick={calculateEmi} className="w-full">
                Calculate EMI
              </Button>
              {emi && (
                <div className="text-center bg-accent/20 p-4 rounded-lg">
                  <p className="text-lg">Your Monthly EMI is</p>
                  <p className="text-3xl font-bold text-primary">₹{emi}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="eligibility">
          <Card>
            <CardHeader>
              <CardTitle>Loan Eligibility Calculator</CardTitle>
              <CardDescription>
                Check your approximate loan eligibility based on your income.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="income">Monthly Income (₹)</Label>
                <Input id="income" type="number" placeholder="e.g., 100000" value={income} onChange={(e) => setIncome(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="existing-emi">
                  Total Existing Monthly EMIs (₹)
                </Label>
                <Input id="existing-emi" type="number" placeholder="e.g., 15000" value={existingEmi} onChange={(e) => setExistingEmi(e.target.value)} />
              </div>
              <Button onClick={calculateEligibility} className="w-full">
                Check Eligibility
              </Button>
              {eligibility && (
                <div className="text-center bg-accent/20 p-4 rounded-lg">
                  <p className="text-lg font-semibold">{eligibility}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    *This is an estimate. Actual eligibility may vary based on bank policies.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function CalculatorsPage() {
  return (
    <AppLayout>
      <title>{metadata.title as string}</title>
      <meta name="description" content={metadata.description as string} />
      <CalculatorsForm />
    </AppLayout>
  );
}