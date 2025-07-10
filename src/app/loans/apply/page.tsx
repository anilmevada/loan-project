'use client';

import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function LoanApplicationForm() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialLoanType = searchParams.get('type') || '';
  
  const [loanType, setLoanType] = useState(initialLoanType);
  const [loanAmount, setLoanAmount] = useState('');

  useEffect(() => {
    setLoanType(initialLoanType);
    if (!initialLoanType) {
        toast({
            variant: 'destructive',
            title: 'No Loan Type Selected',
            description: 'Please select a loan from the loans page first.',
        });
        router.push('/loans');
    }
  }, [initialLoanType, router, toast]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!loanType) {
        toast({
            variant: 'destructive',
            title: 'Loan Type Required',
            description: 'Something went wrong. Please select a loan from the loans page.',
        });
        router.push('/loans');
        return;
    }

    const storedApplications = localStorage.getItem('loanApplications');
    let applications = [];
    if (storedApplications) {
        try {
            applications = JSON.parse(storedApplications);
            if (!Array.isArray(applications)) {
              applications = [];
            }
        } catch (error) {
            applications = [];
        }
    }

    const newApplication = {
      type: loanType,
      amount: `₹${Number(loanAmount).toLocaleString()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    const defaultLoans = [
      { type: 'Home Loan', amount: '₹35,00,000', status: 'Approved', date: '2024-07-15' },
      { type: 'Car Loan', amount: '₹2,50,000', status: 'Pending', date: '2024-07-20' },
      { type: 'Personal Loan', amount: '₹1,00,000', status: 'Rejected', date: '2024-07-18' },
    ];
    
    // Filter out default loans that might have been there before any user interaction
    const userApplications = applications.filter(app => !defaultLoans.some(def => def.date === app.date && def.type === app.type));

    userApplications.unshift(newApplication); // Add new application to the top
    localStorage.setItem('loanApplications', JSON.stringify(userApplications));

    toast({
      title: 'Application Submitted!',
      description: 'We have received your loan application and will review it shortly.',
    });
    
    router.push('/dashboard');
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Apply for {loanType || 'a Loan'}</CardTitle>
          <CardDescription>
            Please fill out the form below to apply for your loan.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Jane Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                <Input
                  id="loan-amount"
                  type="number"
                  placeholder="e.g., 50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  required
                />
            </div>

            <div className="space-y-2">
              <Label>Upload Documents</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PDF, PNG, JPG (MAX. 5MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                  </label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={!loanType}>Submit Application</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function LoanApplicationPage() {
    return (
        <AppLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <LoanApplicationForm />
          </Suspense>
        </AppLayout>
    )
}
