import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, IndianRupee, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format, isPast, parseISO, isToday } from "date-fns";

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  session_type: string;
  payment_status: string;
  amount_paid: number;
  is_first_session: boolean;
  created_at: string;
}

const BookingHistory = () => {
  const { user } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false });

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { label: 'Paid', variant: 'default' as const, icon: CheckCircle },
      free: { label: 'Free', variant: 'secondary' as const, icon: CheckCircle },
      pending: { label: 'Pending', variant: 'outline' as const, icon: AlertCircle },
      failed: { label: 'Failed', variant: 'destructive' as const, icon: XCircle },
      cancelled: { label: 'Cancelled', variant: 'destructive' as const, icon: XCircle },
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

  const upcomingBookings = bookings?.filter(booking => 
    !isPast(parseISO(`${booking.booking_date}T23:59:59`)) && 
    ['paid', 'free', 'pending'].includes(booking.payment_status)
  ) || [];

  const pastBookings = bookings?.filter(booking => 
    isPast(parseISO(`${booking.booking_date}T23:59:59`)) || 
    ['cancelled', 'failed'].includes(booking.payment_status)
  ) || [];

  const todayBookings = bookings?.filter(booking => 
    isToday(parseISO(booking.booking_date)) && 
    ['paid', 'free', 'pending'].includes(booking.payment_status)
  ) || [];

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h4 className="font-semibold text-lg">{booking.session_type}</h4>
            <p className="text-sm text-muted-foreground">
              Booked on {format(parseISO(booking.created_at), 'MMM dd, yyyy')}
            </p>
          </div>
          {getStatusBadge(booking.payment_status)}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(parseISO(booking.booking_date), 'EEEE, MMMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{booking.booking_time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {booking.amount_paid === 0 ? 'FREE' : `₹${booking.amount_paid}`}
              {booking.is_first_session && ' (First Session)'}
            </span>
          </div>
        </div>

        {isToday(parseISO(booking.booking_date)) && ['paid', 'free'].includes(booking.payment_status) && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-2 text-center">
            <p className="text-sm font-medium text-blue-800">📅 Today's Session!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-24 bg-muted animate-pulse rounded" />
            <div className="h-24 bg-muted animate-pulse rounded" />
            <div className="h-24 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>Your session bookings will appear here</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No bookings yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Book your first session to get started!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
        <CardDescription>
          {bookings.length} total booking{bookings.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="today">
              Today ({todayBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map(renderBookingCard)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming bookings
              </div>
            )}
          </TabsContent>

          <TabsContent value="today" className="space-y-4">
            {todayBookings.length > 0 ? (
              todayBookings.map(renderBookingCard)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No bookings for today
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastBookings.length > 0 ? (
              pastBookings.map(renderBookingCard)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No past bookings
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BookingHistory;
