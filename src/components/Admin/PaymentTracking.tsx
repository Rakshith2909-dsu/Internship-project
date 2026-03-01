import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IndianRupee, 
  CheckCircle, 
  XCircle, 
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"

interface PaymentData {
  id: string
  booking_id: string
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  amount: number
  currency: string
  status: string
  created_at: string
  booking_date: string
  booking_time: string
  session_type: string
  customer_name: string
  customer_email: string
}

interface RevenueData {
  booking_date: string
  total_bookings: number
  paid_bookings: number
  free_bookings: number
  revenue: number
}

export const PaymentTracking = () => {
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          bookings (
            booking_date,
            booking_time,
            session_type,
            user_profiles (
              full_name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      return data.map((payment: any) => ({
        id: payment.id,
        booking_id: payment.booking_id,
        razorpay_order_id: payment.razorpay_order_id,
        razorpay_payment_id: payment.razorpay_payment_id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        created_at: payment.created_at,
        booking_date: payment.bookings.booking_date,
        booking_time: payment.bookings.booking_time,
        session_type: payment.bookings.session_type,
        customer_name: payment.bookings.user_profiles?.full_name || 'N/A',
        customer_email: payment.bookings.user_profiles?.email || 'N/A',
      })) as PaymentData[]
    },
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_daily_revenue' as any)
        .select('*')
        .order('booking_date', { ascending: false })
        .limit(30)

      if (error) throw error
      return data as unknown as RevenueData[]
    },
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <Badge className="bg-green-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            Success
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3 text-yellow-500" />
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filterPayments = (status: 'all' | 'success' | 'pending' | 'failed') => {
    if (!payments) return []
    if (status === 'all') return payments
    return payments.filter(p => p.status === status)
  }

  const calculateStats = () => {
    if (!payments) return { total: 0, success: 0, pending: 0, failed: 0, totalRevenue: 0 }
    
    return {
      total: payments.length,
      success: payments.filter(p => p.status === 'success').length,
      pending: payments.filter(p => p.status === 'pending').length,
      failed: payments.filter(p => p.status === 'failed').length,
      totalRevenue: payments
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0) / 100,
    }
  }

  const renderPaymentsTable = (filteredPayments: PaymentData[]) => (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Payment Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Session Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Order ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPayments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  {format(new Date(payment.created_at), 'MMM dd, yyyy HH:mm')}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{payment.customer_name}</span>
                  <span className="text-sm text-muted-foreground">{payment.customer_email}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-sm">{payment.session_type}</span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(payment.booking_date), 'MMM dd, yyyy')}
                    <Clock className="h-3 w-3 ml-2" />
                    {payment.booking_time}
                  </div>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell className="text-right font-medium">
                <div className="flex items-center justify-end gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {(payment.amount / 100).toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                {payment.razorpay_payment_id ? (
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {payment.razorpay_payment_id.slice(0, 20)}...
                  </code>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {payment.razorpay_order_id ? (
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {payment.razorpay_order_id.slice(0, 20)}...
                  </code>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (paymentsLoading || revenueLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Payment Tracking
          </CardTitle>
          <CardDescription>Loading payment data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const stats = calculateStats()
  const allPayments = filterPayments('all')
  const successPayments = filterPayments('success')
  const pendingPayments = filterPayments('pending')
  const failedPayments = filterPayments('failed')

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-purple-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Successful
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.success}</p>
            <p className="text-sm text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.failed}</p>
            <p className="text-sm text-muted-foreground">Failed transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Payment Transactions
          </CardTitle>
          <CardDescription>
            All payment transactions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                All ({allPayments.length})
              </TabsTrigger>
              <TabsTrigger value="success">
                Success ({successPayments.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingPayments.length})
              </TabsTrigger>
              <TabsTrigger value="failed">
                Failed ({failedPayments.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {allPayments.length > 0 ? (
                renderPaymentsTable(allPayments)
              ) : (
                <div className="text-center py-12">
                  <IndianRupee className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No payment transactions yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="success" className="mt-6">
              {successPayments.length > 0 ? (
                renderPaymentsTable(successPayments)
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No successful payments yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              {pendingPayments.length > 0 ? (
                renderPaymentsTable(pendingPayments)
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending payments</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="failed" className="mt-6">
              {failedPayments.length > 0 ? (
                renderPaymentsTable(failedPayments)
              ) : (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No failed payments</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Daily Revenue Report */}
      {revenueData && revenueData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Daily Revenue Report
            </CardTitle>
            <CardDescription>Revenue breakdown for the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Total Bookings</TableHead>
                    <TableHead className="text-center">Paid</TableHead>
                    <TableHead className="text-center">Free</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueData.map((day) => (
                    <TableRow key={day.booking_date}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {format(new Date(day.booking_date), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{day.total_bookings}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{day.paid_bookings}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{day.free_bookings}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {Number(day.revenue).toFixed(2)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
