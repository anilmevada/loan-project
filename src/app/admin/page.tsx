
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
import { Activity, CheckCircle, Clock, FileX, TrendingUp, Users } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';


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

  const totalApplications = loanApplications.length;
  const approvedApplications = loanApplications.filter(app => app.status === 'Approved').length;
  const pendingApplications = loanApplications.filter(app => app.status === 'Pending').length;
  const rejectedApplications = loanApplications.filter(app => app.status === 'Rejected').length;
  
  const averageCreditScore = creditScores.length > 0
    ? Math.round(creditScores.reduce((acc, curr) => acc + curr.score, 0) / creditScores.length)
    : 0;

  const loanStatusData = [
    { name: 'Approved', value: approvedApplications, color: '#22c55e' },
    { name: 'Pending', value: pendingApplications, color: '#f59e0b' },
    { name: 'Rejected', value: rejectedApplications, color: '#ef4444' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">All loan requests from users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Loans</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedApplications}</div>
             <p className="text-xs text-muted-foreground">
              {totalApplications > 0 ? `${((approvedApplications / totalApplications) * 100).toFixed(1)}% of total` : 'No applications yet'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">Applications needing action</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Credit Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCreditScore || 'N/A'}</div>
            <p className="text-xs text-muted-foreground">From all user checks</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3">
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
                         className={
                          loan.status === 'Approved'
                            ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700'
                            : loan.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700'
                            : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700'
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
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Loan Status Overview</CardTitle>
            <CardDescription>
              A visual breakdown of application statuses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loanStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {loanStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    borderColor: 'hsl(var(--border))'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-5">
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
