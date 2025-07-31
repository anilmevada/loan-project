import LoginForm from '@/app/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | loan buddy.com',
    description: 'Login to your loan buddy.com account to manage your loans, insurance, and financial health.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
