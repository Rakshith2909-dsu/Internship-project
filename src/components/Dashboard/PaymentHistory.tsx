import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IndianRupee, CheckCircle, XCircle, Clock, Receipt } from "lucide-react";
import { format, parseISO } from "date-fns";

interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
  bookings?: {
    booking_date: string;
    booking_time: string;
    session_type: string;
  };
}

const PaymentHistory = () => {
  const { user } = useAuth();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['user-payments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            booking_date,
            booking_time,
            session_type
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Payment[];
    },
    enabled: !!user,
  });

  // Calculate total spent
  const totalSpent = payments?.reduce((sum, payment) => {
    if (payment.status === 'success') {
      return sum + (payment.amount / 100); // Convert paise to rupees
    }
    return sum;
  }, 0) || 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      success: { label: 'Success', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'Pending', variant: 'outline' as const, icon: Clock, color: 'text-yellow-600' },
      failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
            <div className="h-16 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your payment transactions will appear here</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Receipt className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No payments yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Your payment history will be displayed here after your first paid session
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              {payments.length} transaction{payments.length !== 1 ? 's' : ''}
            </CardDescription>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold text-primary flex items-center gap-1">
              <IndianRupee className="h-5 w-5" />
              {totalSpent.toFixed(2)}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{format(parseISO(payment.created_at), 'MMM dd, yyyy')}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(parseISO(payment.created_at), 'HH:mm')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{payment.bookings?.session_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {payment.bookings?.booking_date && format(parseISO(payment.bookings.booking_date), 'MMM dd, yyyy')} at {payment.bookings?.booking_time}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-semibold">
                      <IndianRupee className="h-4 w-4" />
                      {(payment.amount / 100).toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {payment.razorpay_payment_id ? (
                      <span title={payment.razorpay_payment_id}>
                        {payment.razorpay_payment_id.substring(0, 15)}...
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-sm text-green-800 font-medium">Successful</p>
            <p className="text-2xl font-bold text-green-900">
              {payments.filter(p => p.status === 'success').length}
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800 font-medium">Pending</p>
            <p className="text-2xl font-bold text-yellow-900">
              {payments.filter(p => p.status === 'pending').length}
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-800 font-medium">Failed</p>
            <p className="text-2xl font-bold text-red-900">
              {payments.filter(p => p.status === 'failed').length}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
