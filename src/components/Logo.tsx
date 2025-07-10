import React from 'react';
import { cn } from '@/lib/utils';

const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m3 11 18-5v12L3 14V5Z" />
    <path d="m3 5 18 5" />
  </svg>
);

export default function Logo({ className }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon className="h-8 w-8 text-primary" />
      <span
        className={cn(
          'text-2xl font-bold text-foreground',
          className
        )}
      >
        loan buddy.com
      </span>
    </div>
  );
}
