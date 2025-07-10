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
import { Car, HeartPulse, Plane, Umbrella } from 'lucide-react';

const insuranceTypes = [
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: 'Health Insurance',
    description: 'Protect yourself and your family with comprehensive health coverage for medical emergencies.',
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: 'Vehicle Insurance',
    description: 'Secure your car or bike against accidents, theft, and damage with our flexible insurance plans.',
  },
  {
    icon: <Umbrella className="h-8 w-8 text-primary" />,
    title: 'Life Insurance',
    description: 'Ensure your family’s financial security in your absence with our trusted life insurance policies.',
  },
  {
    icon: <Plane className="h-8 w-8 text-primary" />,
    title: 'Travel Insurance',
    description: 'Travel with peace of mind. Our plans cover trip cancellations, medical issues, and lost luggage.',
  },
];

export default function InsurancePage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Insurance Services</h1>
          <p className="text-muted-foreground">
            Find the right insurance coverage to protect what matters most.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {insuranceTypes.map((insurance) => (
            <Card key={insurance.title} className="flex flex-col">
              <CardHeader className="flex flex-row items-center gap-4">
                {insurance.icon}
                <div>
                  <CardTitle>{insurance.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{insurance.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="secondary" className="w-full">View Plans</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
