import LoginForm from '@/app/LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | Apex Finance Hub',
    description: 'Login to your Apex Finance Hub account to manage your loans, insurance, and financial health.',
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <LoginForm />
    </div>
  );
}
