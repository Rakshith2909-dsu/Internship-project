import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  User, 
  IndianRupee, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  CalendarCheck
} from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BookingData {
  id: string
  booking_date: string
  booking_time: string
  session_type: string
  payment_status: string
  amount_paid: number
  is_first_session: boolean
  created_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  razorpay_payment_id: string | null
  payment_verification_status: string | null
}

export const BookingManagement = () => {
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_booking_details' as any)
        .select('*')
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false })

      if (error) throw error
      return data as unknown as BookingData[]
    },
  })

  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'cancelled' })
        .eq('id', bookingId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] })
      toast({
        title: "Booking Cancelled",
        description: "The booking has been successfully cancelled.",
      })
      setShowCancelDialog(false)
      setSelectedBooking(null)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking",
        variant: "destructive",
      })
    },
  })

  const handleCancelBooking = () => {
    if (selectedBooking) {
      cancelBookingMutation.mutate(selectedBooking)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Paid', variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      free: { label: 'Free Session', variant: 'secondary' as const, icon: CheckCircle, color: 'text-blue-500' },
      pending: { label: 'Pending', variant: 'outline' as const, icon: AlertCircle, color: 'text-yellow-500' },
      failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle, color: 'text-gray-500' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    )
  }

  const filterBookings = (status: 'all' | 'upcoming' | 'today' | 'past' | 'cancelled') => {
    if (!bookings) return []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (status) {
      case 'upcoming':
        return bookings.filter(b => 
          new Date(b.booking_date) > today && 
          b.payment_status !== 'cancelled' && 
          b.payment_status !== 'failed'
        )
      case 'today':
        return bookings.filter(b => {
          const bookingDate = new Date(b.booking_date)
          bookingDate.setHours(0, 0, 0, 0)
          return bookingDate.getTime() === today.getTime() &&
            b.payment_status !== 'cancelled' &&
            b.payment_status !== 'failed'
        })
      case 'past':
        return bookings.filter(b => new Date(b.booking_date) < today)
      case 'cancelled':
        return bookings.filter(b => 
          b.payment_status === 'cancelled' || b.payment_status === 'failed'
        )
      default:
        return bookings
    }
  }

  const renderBookingsTable = (filteredBookings: BookingData[]) => (
    <div className="rounded-md border overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date & Time</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Session Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment ID</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 font-medium">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {format(new Date(booking.booking_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {booking.booking_time}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 font-medium">
                    <User className="h-3 w-3 text-muted-foreground" />
                    {booking.customer_name}
                  </div>
                  <div className="text-sm text-muted-foreground">{booking.customer_email}</div>
                  <div className="text-sm text-muted-foreground">{booking.customer_phone}</div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span>{booking.session_type}</span>
                  {booking.is_first_session && (
                    <Badge variant="outline" className="w-fit">First Session</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(booking.payment_status)}</TableCell>
              <TableCell className="text-right font-medium">
                <div className="flex items-center justify-end gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {booking.amount_paid}
                </div>
              </TableCell>
              <TableCell>
                {booking.razorpay_payment_id ? (
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {booking.razorpay_payment_id.slice(0, 20)}...
                  </code>
                ) : (
                  <span className="text-muted-foreground text-sm">N/A</span>
                )}
              </TableCell>
              <TableCell>
                {booking.payment_status !== 'cancelled' && booking.payment_status !== 'failed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedBooking(booking.id)
                      setShowCancelDialog(true)
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Booking Management
          </CardTitle>
          <CardDescription>Loading bookings...</CardDescription>
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

  const allBookings = filterBookings('all')
  const upcomingBookings = filterBookings('upcoming')
  const todayBookings = filterBookings('today')
  const pastBookings = filterBookings('past')
  const cancelledBookings = filterBookings('cancelled')

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Booking Management
          </CardTitle>
          <CardDescription>
            Manage all customer bookings and appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({allBookings.length})
              </TabsTrigger>
              <TabsTrigger value="today">
                Today ({todayBookings.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({cancelledBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {allBookings.length > 0 ? (
                renderBookingsTable(allBookings)
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookings found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="today" className="mt-6">
              {todayBookings.length > 0 ? (
                renderBookingsTable(todayBookings)
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No sessions scheduled for today</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingBookings.length > 0 ? (
                renderBookingsTable(upcomingBookings)
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No upcoming bookings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-6">
              {pastBookings.length > 0 ? (
                renderBookingsTable(pastBookings)
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No past bookings</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-6">
              {cancelledBookings.length > 0 ? (
                renderBookingsTable(cancelledBookings)
              ) : (
                <div className="text-center py-12">
                  <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No cancelled bookings</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelBooking}
              disabled={cancelBookingMutation.isPending}
            >
              {cancelBookingMutation.isPending ? "Cancelling..." : "Yes, cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
