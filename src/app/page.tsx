
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Welcome | LOAN BUDDY.COM',
    description: 'Welcome to LOAN BUDDY.COM. Please select your role to continue.',
};

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto max-w-md w-full text-center relative overflow-hidden">
        <div className="absolute top-2 right-2 text-xs font-bold text-muted-foreground bg-background/50 backdrop-blur-sm px-2 py-1 rounded-bl-lg rounded-tr-lg">
          Created by anil suthar
        </div>
        <CardHeader className="space-y-4 pt-12">
          <div className="inline-block mx-auto">
            <Logo />
          </div>
          <CardTitle className="text-3xl">Welcome to LOAN BUDDY.COM</CardTitle>
          <CardDescription>
            Your trusted partner in financial services. Please select your role to proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <Button asChild size="lg" className="w-full">
                <Link href="/login">
                    User Login <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/admin/login">
                    Admin Login <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
