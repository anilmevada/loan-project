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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoanApplicationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [loanType, setLoanType] = useState('');
  const [loanAmount, setLoanAmount] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const storedApplications = localStorage.getItem('loanApplications');
    const applications = storedApplications ? JSON.parse(storedApplications) : [];

    const newApplication = {
      type: loanType || 'N/A',
      amount: `$${Number(loanAmount).toLocaleString()}`,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    applications.push(newApplication);
    localStorage.setItem('loanApplications', JSON.stringify(applications));

    toast({
      title: 'Application Submitted!',
      description: 'We have received your loan application and will review it shortly.',
    });
    
    router.push('/dashboard');
  };
  
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Loan Application Form</CardTitle>
            <CardDescription>
              Please fill out the form below to apply for a loan.
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

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-type">Loan Type</Label>
                  <Select onValueChange={setLoanType} required>
                    <SelectTrigger id="loan-type">
                      <SelectValue placeholder="Select a loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Home Loan">Home Loan</SelectItem>
                      <SelectItem value="Car Loan">Car Loan</SelectItem>
                      <SelectItem value="Personal Loan">Personal Loan</SelectItem>
                      <SelectItem value="Education Loan">Education Loan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Loan Amount ($)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    placeholder="e.g., 50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    required
                  />
                </div>
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
              <Button type="submit" className="w-full">Submit Application</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
