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

export default function CalculatorsPage() {
  // EMI Calculator State
  const [principal, setPrincipal] = useState(500000);
  const [interest, setInterest] = useState(8.5);
  const [tenure, setTenure] = useState(5);
  const [emi, setEmi] = useState('');

  // Eligibility Calculator State
  const [income, setIncome] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(15000);
  const [eligibility, setEligibility] = useState('');

  const calculateEmi = () => {
    if (principal > 0 && interest > 0 && tenure > 0) {
      const monthlyInterest = interest / 12 / 100;
      const numberOfMonths = tenure * 12;
      const emiValue =
        (principal *
          monthlyInterest *
          Math.pow(1 + monthlyInterest, numberOfMonths)) /
        (Math.pow(1 + monthlyInterest, numberOfMonths) - 1);
      setEmi(emiValue.toFixed(2));
    } else {
      setEmi('');
    }
  };

  const calculateEligibility = () => {
    if (income > 0) {
      const maxEmiPossible = income * 0.5 - existingEmi;
      if (maxEmiPossible > 0) {
        setEligibility(
          `You are likely eligible for a loan with a monthly EMI up to $${maxEmiPossible.toFixed(2)}.`
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
    <AppLayout>
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
                  <Label htmlFor="principal">Loan Amount ($)</Label>
                  <Input id="principal" type="number" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest">Interest Rate (% p.a.)</Label>
                  <Input id="interest" type="number" step="0.1" value={interest} onChange={(e) => setInterest(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenure">Loan Tenure (Years)</Label>
                  <Input id="tenure" type="number" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} />
                </div>
                <Button onClick={calculateEmi} className="w-full">
                  Calculate EMI
                </Button>
                {emi && (
                  <div className="text-center bg-accent/20 p-4 rounded-lg">
                    <p className="text-lg">Your Monthly EMI is</p>
                    <p className="text-3xl font-bold text-primary">${emi}</p>
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
                  <Label htmlFor="income">Monthly Income ($)</Label>
                  <Input id="income" type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existing-emi">
                    Total Existing Monthly EMIs ($)
                  </Label>
                  <Input id="existing-emi" type="number" value={existingEmi} onChange={(e) => setExistingEmi(Number(e.target.value))} />
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
    </AppLayout>
  );
}
