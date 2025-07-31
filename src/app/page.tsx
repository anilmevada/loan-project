
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Logo from '@/components/Logo';
import { ArrowRight, ShieldCheck, User } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Welcome | LOAN BUDDY.COM',
    description: 'Welcome to LOAN BUDDY.COM. Please select your role to continue.',
};

export default function WelcomePage() {
  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[100vh]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
           <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground bg-background/50 backdrop-blur-sm px-2 py-1 rounded-lg">
              Created by anil suthar
            </div>
          <div className="grid gap-2 text-center">
             <div className="inline-block mx-auto mb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold">Select Your Role</h1>
            <p className="text-balance text-muted-foreground">
              Choose whether you are a user or an administrator to proceed.
            </p>
          </div>
          <div className="grid gap-4">
             <Button asChild size="lg" className="w-full">
                <Link href="/login">
                    <User className="mr-2 h-5 w-5" /> User Login
                </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/admin/login">
                    <ShieldCheck className="mr-2 h-5 w-5" /> Admin Login 
                </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1080x1920.png"
          alt="A person reviewing financial documents, symbolizing loans and financial services."
          data-ai-hint="finance planning"
          width="1080"
          height="1920"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
