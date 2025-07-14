'use client';
import { type ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Calculator,
  Gauge,
  Home,
  Landmark,
  LogOut,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import Logo from './Logo';
import { SearchContext, useSearch } from '@/hooks/use-search';
import { DialogTitle } from '@/components/ui/dialog';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/loans', icon: Landmark, label: 'Loans' },
  { href: '/insurance', icon: ShieldCheck, label: 'Insurance' },
  { href: '/credit-score', icon: Gauge, label: 'Credit Score' },
  { href: '/calculators', icon: Calculator, label: 'Calculators' },
];

const availableLoanTypes = [
  'Home Loan',
  'Car Loan',
  'Personal Loan',
  'Education Loan',
];

const pageKeywords: Record<string, string> = {
  loans: '/loans',
  loan: '/loans',
  insurance: '/insurance',
  'credit score': '/credit-score',
  credit: '/credit-score',
  score: '/credit-score',
  cibil: '/credit-score',
  calculator: '/calculators',
  calculators: '/calculators',
  emi: '/calculators',
  eligibility: '/calculators',
  dashboard: '/dashboard',
};

function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

function Header() {
    const { searchQuery, setSearchQuery } = useSearch();
    const router = useRouter();
    const pathname = usePathname();

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const query = searchQuery.trim().toLowerCase();
      
      const matchedLoan = availableLoanTypes.find(loan => loan.toLowerCase() === query);
      if (matchedLoan) {
        router.push(`/loans/apply?type=${encodeURIComponent(matchedLoan)}`);
        return;
      }

      if (pageKeywords[query]) {
          router.push(pageKeywords[query]);
          return;
      }

      // If no exact match, go to a relevant page based on keywords
      if (query.includes('loan')) {
          router.push('/loans');
      } else if (query.includes('insurance')) {
          router.push('/insurance');
      } else {
        // Fallback for general searches
        if (pathname.startsWith('/loans')) {
            router.push('/loans');
        } else if (pathname.startsWith('/insurance')) {
            router.push('/insurance');
        } else {
            router.push('/dashboard');
        }
      }
    };

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
        <SidebarTrigger />
        <div className="w-full flex-1">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search loans, insurance..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </header>
    )
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <SearchProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo className="text-sidebar-foreground" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === '/dashboard'
                        ? pathname === item.href
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="justify-start gap-2 w-full">
                  <User /> <span>Jane Doe</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DialogTitle className="sr-only">User Menu</DialogTitle>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Jane Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      jane.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <Header />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SearchProvider>
  );
}
