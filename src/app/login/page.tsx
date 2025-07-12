import LoginForm from '@/components/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | LOAN BUDDY.COM',
    description: 'Login to your LOAN BUDDY.COM account to manage your loans, insurance, and financial health.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
