'use client';

import AppLayout from '@/components/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Admin Dashboard | LOAN BUDDY.COM',
    description: 'Admin dashboard to monitor all user activity, including loan applications and credit score checks.',
};

type LoanApplication = {
  type: string;
  amount: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
};

type CreditScoreEntry = {
    score: number;
    date: string;
    pan: string;
    aadhar: string;
};

function AdminDashboardContent() {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [creditScores, setCreditScores] = useState<CreditScoreEntry[]>([]);

  useEffect(() => {
    // Load loan applications from localStorage
    const storedApplicationsJSON = localStorage.getItem('loanApplications');
    if (storedApplicationsJSON) {
        try {
            const parsed = JSON.parse(storedApplicationsJSON);
            if (Array.isArray(parsed)) {
                setLoanApplications(parsed);
            }
        } catch (e) {
            console.error("Failed to parse loan applications from localStorage", e);
        }
    }

    // Load credit scores from localStorage
    const storedScore = localStorage.getItem('creditScore');
    if (storedScore) {
      try {
        const parsed = JSON.parse(storedScore);
        // Ensure it's an object with a score property before adding
        if (parsed && typeof parsed.score === 'number') {
            setCreditScores([parsed]);
        }
      } catch(e) {
          console.error("Failed to parse credit score from localStorage", e);
      }
    }

  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>All Loan Applications</CardTitle>
            <CardDescription>
              A view of all loan applications submitted by users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loanApplications.length > 0 ? loanApplications.map((loan, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{loan.type}</TableCell>
                    <TableCell>{loan.amount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          loan.status === 'Approved'
                            ? 'default'
                            : loan.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {loan.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{loan.date}</TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                      <TableCell colSpan={4} className="text-center py-10">
                          No loan applications have been submitted yet.
                      </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Credit Score Checks</CardTitle>
            <CardDescription>
              A list of recent credit scores checked by users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Score</TableHead>
                        <TableHead>PAN</TableHead>
                        <TableHead className="text-right">Date Checked</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {creditScores.length > 0 ? creditScores.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-bold text-primary">{item.score}</TableCell>
                            <TableCell>{item.pan || 'N/A'}</TableCell>
                            <TableCell className="text-right">{new Date(item.date).toLocaleDateString()}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center py-10">
                                No credit scores have been checked yet.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminPage() {
    return (
        <AppLayout>
            <title>{metadata.title as string}</title>
            <meta name="description" content={metadata.description as string} />
            <AdminDashboardContent />
        </AppLayout>
    );
}
