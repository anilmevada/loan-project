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

    const storedApplicationsJSON = localStorage.getItem('loanApplications');
    let applications = [];
    if (storedApplicationsJSON) {
        try {
            const parsed = JSON.parse(storedApplicationsJSON);
            if (Array.isArray(parsed)) {
              applications = parsed;
            }
        } catch (error) {
            console.error("Failed to parse loan applications from localStorage", error);
            applications = [];
        }
    }

    const newApplication = {
      type: loanType,
      amount: `₹${Number(loanAmount).toLocaleString()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    // Add new application to the top of the list
    const updatedApplications = [newApplication, ...applications];

    localStorage.setItem('loanApplications', JSON.stringify(updatedApplications));

    toast({
      title: 'Application Submitted!',
      description: 'We have received your loan application and will review it shortly.',
    });
    
    router.push('/dashboard');
  };

  const renderStandardForm = () => (
    <>
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
    </>
  );

  const renderEducationForm = () => (
    <>
        <div className="space-y-2">
            <Label htmlFor="student-name">Student Full Name</Label>
            <Input id="student-name" placeholder="Alex Smith" required />
        </div>
        <div className="space-y-2">
            <Label htmlFor="guardian-name">Father's/Guardian's Name</Label>
            <Input id="guardian-name" placeholder="John Smith" required />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="course-name">Course Name</Label>
                <Input id="course-name" placeholder="B.Tech in Computer Science" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="university-name">University/College Name</Label>
                <Input id="university-name" placeholder="Institute of Technology" required />
            </div>
        </div>
        <div className="space-y-2">
            <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
            <Input
                id="loan-amount"
                type="number"
                placeholder="e.g., 500000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                required
            />
        </div>
    </>
  );
  
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
            
            {loanType === 'Education Loan' ? renderEducationForm() : renderStandardForm()}

            <div className="space-y-2">
              <Label>Upload Documents</Label>
              <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">ID, Address Proof, Income Proof (PDF, JPG)</p>
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
