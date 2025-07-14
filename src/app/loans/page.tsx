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
import { useSearch } from '@/hooks/use-search';
import { Car, GraduationCap, Home, User } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Apply for a Loan | loan buddy.com',
    description: 'Find the perfect loan for your needs. We offer Home Loans, Car Loans, Personal Loans, and Education Loans with competitive rates.',
};

const loanTypes = [
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: 'Home Loan',
    description: 'Realize your dream of owning a home with our competitive interest rates and flexible repayment options.',
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: 'Car Loan',
    description: 'Get behind the wheel of your new car faster with our quick and easy auto loan application process.',
  },
  {
    icon: <User className="h-8 w-8 text-primary" />,
    title: 'Personal Loan',
    description: 'For your planned or unplanned expenses, a personal loan offers a versatile solution without collateral.',
  },
  {
    icon: <GraduationCap className="h-8 w-8 text-primary" />,
    title: 'Education Loan',
    description: 'Invest in your future with our education loans that cover tuition fees, accommodation, and more.',
  },
];

function LoansPageContent() {
    const { searchQuery } = useSearch();

    const filteredLoans = loanTypes.filter(loan => 
        loan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apply for a Loan</h1>
        <p className="text-muted-foreground">
          Choose the type of loan that suits your needs.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filteredLoans.map((loan) => (
          <Card key={loan.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              {loan.icon}
              <div>
                <CardTitle>{loan.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{loan.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/loans/apply?type=${encodeURIComponent(loan.title)}`}>Apply Now</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function LoansPage() {
    return (
        <AppLayout>
            <title>{metadata.title as string}</title>
            <meta name="description" content={metadata.description as string} />
            <LoansPageContent />
        </AppLayout>
    )
}
