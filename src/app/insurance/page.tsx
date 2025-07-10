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
import { Car, CheckCircle, HeartPulse, Plane, Umbrella } from 'lucide-react';
import React from 'react';

const insuranceTypes = [
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: 'Health Insurance',
    description: 'Protect yourself and your family with comprehensive health coverage for medical emergencies.',
    features: [
        "Up to ₹25 Lakhs coverage",
        "Cashless hospitalization",
        "Pre & post-hospitalization cover",
        "Maternity benefits included"
    ]
  },
  {
    icon: <Car className="h-8 w-8 text-primary" />,
    title: 'Vehicle Insurance',
    description: 'Secure your car or bike against accidents, theft, and damage with our flexible insurance plans.',
    features: [
        "Comprehensive & third-party cover",
        "Zero depreciation add-on",
        "24/7 roadside assistance",
        "Quick claim settlement"
    ]
  },
  {
    icon: <Umbrella className="h-8 w-8 text-primary" />,
    title: 'Life Insurance',
    description: 'Ensure your family’s financial security in your absence with our trusted life insurance policies.',
    features: [
        "Term plans up to ₹1 Crore",
        "Tax benefits under Section 80C",
        "Guaranteed returns on select plans",
        "Cover against critical illnesses"
    ]
  },
  {
    icon: <Plane className="h-8 w-8 text-primary" />,
    title: 'Travel Insurance',
    description: 'Travel with peace of mind. Our plans cover trip cancellations, medical issues, and lost luggage.',
    features: [
        "International & domestic coverage",
        "Covers medical emergencies",
        "Trip cancellation & delay protection",
        "Baggage loss/delay cover"
    ]
  },
];

function InsurancePageContent() {
  const { searchQuery } = useSearch();

  const filteredInsurance = insuranceTypes.filter(insurance => 
      insurance.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insurance.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Insurance Services</h1>
        <p className="text-muted-foreground">
          Find the right insurance coverage to protect what matters most.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filteredInsurance.map((insurance) => (
          <Card key={insurance.title} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              {insurance.icon}
              <div>
                <CardTitle>{insurance.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground">{insurance.description}</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {insurance.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full">View Plans & Pricing</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default function InsurancePage() {
    return (
        <AppLayout>
            <InsurancePageContent />
        </AppLayout>
    )
}
