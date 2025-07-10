import AppLayout from '@/components/AppLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BellRing, CheckCircle2, XCircle } from 'lucide-react';

const loanApplications = [
  {
    type: 'Home Loan',
    amount: '$350,000',
    status: 'Approved',
    date: '2024-07-15',
  },
  {
    type: 'Car Loan',
    amount: '$25,000',
    status: 'Pending',
    date: '2024-07-20',
  },
  {
    type: 'Personal Loan',
    amount: '$10,000',
    status: 'Rejected',
    date: '2024-07-18',
  },
];

const notifications = [
    { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, text: 'Your home loan has been approved!', time: '2 days ago' },
    { icon: <BellRing className="h-4 w-4 text-yellow-500" />, text: 'New insurance plans available for your vehicle.', time: '5 days ago' },
    { icon: <XCircle className="h-4 w-4 text-red-500" />, text: 'Action required: document submission for personal loan.', time: '1 week ago' },
]

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Welcome, Jane!</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Credit Health</CardTitle>
              <CardDescription>Your current credit score overview.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="text-center">
                <span className="text-6xl font-bold text-primary">780</span>
                <p className="text-lg text-muted-foreground">Excellent</p>
              </div>
              <Progress value={85} aria-label="Credit score of 780" />
              <p className="text-sm text-center text-muted-foreground">
                Last checked: 2024-07-01
              </p>
            </CardContent>
          </Card>
           <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Loan Application Status</CardTitle>
              <CardDescription>
                Track your recent loan applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanApplications.map((loan) => (
                    <TableRow key={loan.type}>
                      <TableCell className="font-medium">{loan.type}</TableCell>
                      <TableCell>{loan.amount}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            loan.status === 'Approved'
                              ? 'default'
                              : loan.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                          className={loan.status === 'Approved' ? 'bg-green-500/20 text-green-700 border-green-500/30' : 
                                       loan.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30' :
                                       'bg-red-500/20 text-red-700 border-red-500/30'}
                        >
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{loan.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Recent updates and alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {notifications.map((notification, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <Avatar className="h-8 w-8 border">
                                <AvatarFallback className="bg-background">{notification.icon}</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1">
                               <p className="text-sm font-medium">{notification.text}</p>
                               <p className="text-sm text-muted-foreground">{notification.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
