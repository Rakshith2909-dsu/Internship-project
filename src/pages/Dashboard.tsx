import React from 'react';
import { useAuth } from '@/components/Auth/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Calendar, CreditCard, BookOpen, IndianRupee, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import BookingHistory from '@/components/Dashboard/BookingHistory';
import PaymentHistory from '@/components/Dashboard/PaymentHistory';
import Navigation from '@/components/Navigation';
import { isPast, parseISO } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();

  // Fetch bookings with React Query
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user?.id)
        .order('booking_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch payments with React Query
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['user-payments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const upcomingBookings = bookings?.filter(
    b => !isPast(parseISO(`${b.booking_date}T23:59:59`)) && 
    ['paid', 'free', 'pending'].includes(b.payment_status)
  ).length || 0;

  const totalSpent = payments?.reduce((sum, payment) => {
    if (payment.status === 'success') {
      return sum + (payment.amount / 100);
    }
    return sum;
  }, 0) || 0;

  const successfulBookings = bookings?.filter(
    b => ['paid', 'free'].includes(b.payment_status)
  ).length || 0;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in, show welcome message
  if (!user) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Welcome to Mindful Wave</h1>
            <p className="text-muted-foreground text-lg">Your journey to wellness begins here</p>
          </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Calendar className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Get Started with Your Wellness Journey</h2>
              <p className="text-muted-foreground mb-6">
                Sign up to book your first session FREE! Track your progress, manage bookings, and unlock the power of holistic healing.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold mb-1">First Session FREE</h3>
                <p className="text-sm text-muted-foreground">Try Pranic Healing at no cost</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold mb-1">Easy Booking</h3>
                <p className="text-sm text-muted-foreground">Schedule sessions instantly</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold mb-1">Track Progress</h3>
                <p className="text-sm text-muted-foreground">Monitor your wellness journey</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="min-w-[120px]">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="min-w-[120px]">
                <Link to="/login">Login</Link>
              </Button>
            </div>

            <div className="mt-6">
              <Button asChild variant="link">
                <Link to="/">Explore Our Services →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
    );
  }

  if (bookingsLoading || paymentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name}!</h1>
            <p className="text-muted-foreground">Manage your bookings and view your wellness journey</p>
          </div>
          {(profile as any)?.role === 'admin' && (
            <Button asChild variant="default" className="gap-2">
              <Link to="/admin/dashboard">
                <Shield className="h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}
        </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.total_sessions_booked || 0}</div>
            <p className="text-xs text-muted-foreground">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">Scheduled sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Session</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profile?.is_first_session_used ? 'Used' : 'FREE'}
            </div>
            <p className="text-xs text-muted-foreground">
              {profile?.is_first_session_used ? 'Next: ₹500' : 'Available now!'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex gap-4">
        <Button asChild size="lg">
          <Link to="/#sessions">
            <Calendar className="h-4 w-4 mr-2" />
            Book a Session
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link to="/profile">Edit Profile</Link>
        </Button>
        {(profile as any)?.role === 'admin' && (
          <Button variant="secondary" asChild size="lg" className="gap-2">
            <Link to="/admin/dashboard">
              <Shield className="h-4 w-4" />
              Admin Panel
            </Link>
          </Button>
        )}
      </div>

      {/* Main Content - Tabs */}
      <Tabs defaultValue="bookings" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <BookingHistory />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
};
