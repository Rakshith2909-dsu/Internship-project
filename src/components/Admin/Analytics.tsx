import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Users, 
  Calendar, 
  IndianRupee, 
  TrendingUp, 
  CheckCircle,
  XCircle,
  Clock,
  Gift,
  BarChart3,
  AlertCircle
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { AdminQuickReference } from "./AdminQuickReference"

interface AnalyticsData {
  total_customers: number
  total_bookings: number
  paid_bookings: number
  free_bookings: number
  pending_bookings: number
  cancelled_bookings: number
  failed_bookings: number
  total_revenue: number
  upcoming_sessions: number
  todays_sessions: number
}

export const Analytics = () => {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_analytics' as any)
        .select('*')
        .single()

      if (error) throw error
      return data as unknown as AnalyticsData
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalBookings = analytics.total_bookings
  const confirmedBookings = analytics.paid_bookings + analytics.free_bookings
  const completionRate = totalBookings > 0 
    ? ((confirmedBookings / totalBookings) * 100).toFixed(1)
    : '0'
  
  const paymentSuccessRate = (analytics.paid_bookings + analytics.pending_bookings) > 0
    ? ((analytics.paid_bookings / (analytics.paid_bookings + analytics.pending_bookings + analytics.failed_bookings)) * 100).toFixed(1)
    : '0'

  const avgRevenuePerCustomer = analytics.total_customers > 0
    ? (analytics.total_revenue / analytics.total_customers).toFixed(2)
    : '0'

  return (
    <div className="space-y-6">
      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4 text-blue-500" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.total_customers}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4 text-purple-500" />
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.total_bookings}</div>
            <p className="text-xs text-muted-foreground mt-1">All time sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4 text-green-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{analytics.total_revenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">From paid sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              Avg Revenue/Customer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{avgRevenuePerCustomer}</div>
            <p className="text-xs text-muted-foreground mt-1">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Status Breakdown
            </CardTitle>
            <CardDescription>Distribution of all bookings by status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Paid Sessions</span>
                </div>
                <span className="font-medium">{analytics.paid_bookings}</span>
              </div>
              <Progress 
                value={(analytics.paid_bookings / totalBookings) * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-blue-500" />
                  <span>Free Sessions</span>
                </div>
                <span className="font-medium">{analytics.free_bookings}</span>
              </div>
              <Progress 
                value={(analytics.free_bookings / totalBookings) * 100} 
                className="h-2 bg-blue-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>Pending Payment</span>
                </div>
                <span className="font-medium">{analytics.pending_bookings}</span>
              </div>
              <Progress 
                value={(analytics.pending_bookings / totalBookings) * 100} 
                className="h-2 bg-yellow-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>Cancelled/Failed</span>
                </div>
                <span className="font-medium">
                  {analytics.cancelled_bookings + analytics.failed_bookings}
                </span>
              </div>
              <Progress 
                value={((analytics.cancelled_bookings + analytics.failed_bookings) / totalBookings) * 100} 
                className="h-2 bg-red-100"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Key Performance Metrics
            </CardTitle>
            <CardDescription>Important business metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Booking Completion Rate</span>
                <span className="text-2xl font-bold">{completionRate}%</span>
              </div>
              <Progress value={Number(completionRate)} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {confirmedBookings} of {totalBookings} bookings confirmed
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Payment Success Rate</span>
                <span className="text-2xl font-bold">{paymentSuccessRate}%</span>
              </div>
              <Progress value={Number(paymentSuccessRate)} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.paid_bookings} successful payments
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-xl font-bold">
                    {analytics.total_customers > 0 
                      ? ((analytics.paid_bookings / analytics.total_customers) * 100).toFixed(1)
                      : '0'
                    }%
                  </p>
                  <p className="text-xs text-muted-foreground">Free to paid</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Repeat Customers</p>
                  <p className="text-xl font-bold">
                    {analytics.total_customers > 0 && analytics.paid_bookings > 0
                      ? Math.round((analytics.paid_bookings / analytics.total_customers) * 100)
                      : 0
                    }%
                  </p>
                  <p className="text-xs text-muted-foreground">Returning rate</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Today's Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.todays_sessions}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Sessions scheduled for today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.upcoming_sessions}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Future confirmed bookings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5" />
            Revenue Summary
          </CardTitle>
          <CardDescription>Detailed breakdown of revenue sources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Paid Sessions</p>
              <p className="text-3xl font-bold">{analytics.paid_bookings}</p>
              <p className="text-sm text-muted-foreground">
                @ ₹500 each = ₹{(analytics.paid_bookings * 500).toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Free Sessions Given</p>
              <p className="text-3xl font-bold">{analytics.free_bookings}</p>
              <p className="text-sm text-muted-foreground">
                Worth ₹{(analytics.free_bookings * 500).toFixed(2)} (promotional)
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Pending Revenue</p>
              <p className="text-3xl font-bold text-yellow-600">
                ₹{(analytics.pending_bookings * 500).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                From {analytics.pending_bookings} pending bookings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference Guide */}
      <AdminQuickReference />
    </div>
  )
}
