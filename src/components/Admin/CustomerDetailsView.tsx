import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  IndianRupee, 
  CalendarCheck,
  X,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CustomerDetailsViewProps {
  customerId: string | null
  open: boolean
  onClose: () => void
}

interface BookingDetail {
  id: string
  booking_date: string
  booking_time: string
  session_type: string
  payment_status: string
  amount_paid: number
  is_first_session: boolean
  created_at: string
  razorpay_payment_id: string | null
}

interface CustomerInfo {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  registered_at: string
  total_sessions_booked: number
  is_first_session_used: boolean
}

export const CustomerDetailsView = ({ customerId, open, onClose }: CustomerDetailsViewProps) => {
  const { data: customerInfo, isLoading: customerLoading } = useQuery({
    queryKey: ['customer-info', customerId],
    queryFn: async () => {
      if (!customerId) return null
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', customerId)
        .single()

      if (error) throw error
      
      return {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        role: (data as any).role || 'user',
        registered_at: data.created_at,
        total_sessions_booked: data.total_sessions_booked,
        is_first_session_used: data.is_first_session_used,
      } as CustomerInfo
    },
    enabled: !!customerId && open,
  })

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['customer-bookings', customerId],
    queryFn: async () => {
      if (!customerId) return []
      
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          payments (
            razorpay_payment_id,
            status
          )
        `)
        .eq('user_id', customerId)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false })

      if (error) throw error
      
      return data.map((booking: any) => ({
        id: booking.id,
        booking_date: booking.booking_date,
        booking_time: booking.booking_time,
        session_type: booking.session_type,
        payment_status: booking.payment_status,
        amount_paid: booking.amount_paid,
        is_first_session: booking.is_first_session,
        created_at: booking.created_at,
        razorpay_payment_id: booking.payments?.[0]?.razorpay_payment_id || null,
      })) as BookingDetail[]
    },
    enabled: !!customerId && open,
  })

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>
      case 'free':
        return <Badge className="bg-blue-500"><CheckCircle className="h-3 w-3 mr-1" />Free</Badge>
      case 'pending':
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'cancelled':
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />{status}</Badge>
    }
  }

  const calculateTotalSpent = () => {
    if (!bookings) return 0
    return bookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + b.amount_paid, 0)
  }

  const upcomingBookings = bookings?.filter(
    b => new Date(b.booking_date) >= new Date() && ['paid', 'free'].includes(b.payment_status)
  ).length || 0

  const completedBookings = bookings?.filter(
    b => new Date(b.booking_date) < new Date() && ['paid', 'free'].includes(b.payment_status)
  ).length || 0

  if (!customerId) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Details
          </DialogTitle>
          <DialogDescription>
            Complete information and booking history
          </DialogDescription>
        </DialogHeader>

        {customerLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : customerInfo ? (
          <div className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{customerInfo.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Registered</p>
                      <p className="font-medium">
                        {format(new Date(customerInfo.registered_at), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{customerInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{customerInfo.phone}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-2">
                  <Badge variant={customerInfo.role === 'admin' ? 'destructive' : 'secondary'}>
                    {customerInfo.role === 'admin' ? 'Admin' : 'Customer'}
                  </Badge>
                  {customerInfo.is_first_session_used ? (
                    <Badge variant="outline">Returning Customer</Badge>
                  ) : (
                    <Badge className="bg-blue-500">New Customer</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Booking Statistics */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{bookings?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">{completedBookings}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{upcomingBookings}</p>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">
                      ₹{(calculateTotalSpent() / 100).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5" />
                  Booking History
                </CardTitle>
                <CardDescription>
                  All sessions booked by this customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Session Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Payment ID</TableHead>
                          <TableHead>Booked On</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 font-medium">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {booking.booking_time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{booking.session_type}</Badge>
                              {booking.is_first_session && (
                                <Badge className="ml-2 bg-blue-500">First Session</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {getPaymentStatusBadge(booking.payment_status)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {booking.payment_status === 'free' ? (
                                <span className="text-blue-500">Free</span>
                              ) : (
                                `₹${(booking.amount_paid / 100).toFixed(2)}`
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {booking.razorpay_payment_id || 'N/A'}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(booking.created_at), 'MMM dd, yyyy')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No bookings yet
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Customer not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
