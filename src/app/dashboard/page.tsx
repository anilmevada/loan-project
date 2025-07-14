
'use client';

import AppLayout from '@/components/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BellRing, CheckCircle2, FileWarning, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Dashboard | LOAN BUDDY.COM',
    description: 'Your personal finance dashboard. Track loan applications, check your credit score, and get important notifications.',
};

type LoanApplication = {
  type: string;
  amount: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
};

const defaultLoanApplications: LoanApplication[] = [
  {
    type: 'Home Loan',
    amount: '₹35,00,000',
    status: 'Approved',
    date: '2024-07-15',
  },
  {
    type: 'Car Loan',
    amount: '₹2,50,000',
    status: 'Pending',
    date: '2024-07-20',
  },
  {
    type: 'Personal Loan',
    amount: '₹1,00,000',
    status: 'Rejected',
    date: '2024-07-18',
  },
];

const notifications = [
    {
        icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
        text: 'Your home loan has been approved!',
        time: '2 days ago',
        href: '#',
    },
    {
        icon: <BellRing className="h-5 w-5 text-yellow-500" />,
        text: 'New insurance plans available for your vehicle.',
        time: '5 days ago',
        href: '/insurance',
    },
    {
        icon: <FileWarning className="h-5 w-5 text-red-500" />,
        text: 'Action required: document submission for personal loan.',
        time: '1 week ago',
        href: '/loans/apply?type=Personal%20Loan',
    },
];

function DashboardContent() {
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
  const [greeting, setGreeting] = useState('');
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [scoreLastChecked, setScoreLastChecked] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning!');
    } else if (hour < 18) {
      setGreeting('Good Afternoon!');
    } else {
      setGreeting('Good Evening!');
    }
    
    const storedApplicationsJSON = localStorage.getItem('loanApplications');
    if (storedApplicationsJSON) {
        try {
            const parsed = JSON.parse(storedApplicationsJSON);
            if (Array.isArray(parsed)) {
                setLoanApplications(parsed);
            }
        } catch (e) {
            console.error("Failed to parse loan applications from localStorage", e);
            localStorage.removeItem('loanApplications');
        }
    } else {
        localStorage.setItem('loanApplications', JSON.stringify(defaultLoanApplications));
        setLoanApplications(defaultLoanApplications);
    }

    const storedScore = localStorage.getItem('userCreditScore');
    if (storedScore) {
      try {
        const { score, date } = JSON.parse(storedScore);
        setCreditScore(score);
        setScoreLastChecked(new Date(date).toISOString().split('T')[0]);
      } catch (e) {
        console.error("Failed to parse credit score from localStorage", e);
        localStorage.removeItem('userCreditScore');
      }
    }

  }, []);

  const getScoreDescription = (s: number) => {
    if (s >= 800) return 'Excellent';
    if (s >= 740) return 'Very Good';
    if (s >= 670) return 'Good';
    if (s >= 580) return 'Fair';
    return 'Poor';
  };

  const progressValue = creditScore ? ((creditScore - 300) / (850 - 300)) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="relative flex overflow-x-hidden bg-primary text-primary-foreground rounded-lg">
          <div className="py-1 animate-marquee whitespace-nowrap">
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
          </div>
          <div className="absolute top-0 py-1 animate-marquee2 whitespace-nowrap">
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
              <span className="text-sm mx-4 font-medium">Welcome to LOAN BUDDY.COM</span>
          </div>
      </div>

      <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{greeting}</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/credit-score" className="block">
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl h-full">
            <CardHeader>
              <CardTitle>Credit Health</CardTitle>
              <CardDescription>
                {creditScore ? "Your current credit score overview." : "Check your credit score now!"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {creditScore !== null ? (
                <>
                  <div className="text-center">
                    <span className="text-6xl font-bold text-primary">{creditScore}</span>
                    <p className="text-lg text-muted-foreground">{getScoreDescription(creditScore)}</p>
                  </div>
                  <Progress value={progressValue} aria-label={`Credit score of ${creditScore}`} />
                  <p className="text-sm text-center text-muted-foreground">
                    Last checked: {scoreLastChecked}
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-lg font-semibold mb-2">No score available</p>
                  <Button size="sm">Check Score</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
        <Card className="lg:col-span-2 flex flex-col transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
          <CardHeader>
            <CardTitle>Loan Application Status</CardTitle>
            <CardDescription>
              Track your recent loan applications.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
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
                  <TableRow key={index} className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${index * 100}ms`}}>
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
                          <p className="mb-2">You have no active loan applications.</p>
                          <Button variant="outline" size="sm" asChild>
                              <Link href="/loans">
                                  <PlusCircle className="mr-2 h-4 w-4" />
                                  Apply for a Loan
                              </Link>
                          </Button>
                      </TableCell>
                   </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {loanApplications.length > 0 && (
              <CardFooter className="border-t pt-4">
                  <Button asChild className="w-full">
                      <Link href="/loans">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Apply for a New Loan
                      </Link>
                  </Button>
              </CardFooter>
          )}
        </Card>
        <Card className="lg:col-span-3 transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent updates and alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <Link key={index} href={notification.href} className="block rounded-lg hover:bg-muted/50 -mx-2 px-2 py-2 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="bg-transparent">
                        {notification.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 flex-1">
                      <p className="text-sm font-medium">{notification.text}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
    return (
        <AppLayout>
            <title>{metadata.title as string}</title>
            <meta name="description" content={metadata.description as string} />
            <DashboardContent />
        </AppLayout>
    );
}
