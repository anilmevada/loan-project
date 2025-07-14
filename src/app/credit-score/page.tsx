'use client';

import AppLayout from '@/components/AppLayout';
import CreditScoreForm from './CreditScoreForm';
import type { Metadata } from 'next';

const metadata: Metadata = {
    title: 'Free Credit Score Check | LOAN BUDDY.COM',
    description: 'Check your CIBIL credit score for free in just a few steps. Get an instant and secure report to understand your financial health.',
};

export default function CreditScorePage() {
    return (
        <AppLayout>
            <title>{metadata.title as string}</title>
            <meta name="description" content={metadata.description as string} />
            <CreditScoreForm />
        </AppLayout>
    );
}
