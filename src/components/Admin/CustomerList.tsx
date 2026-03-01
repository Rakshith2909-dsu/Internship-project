import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Phone, Mail, Calendar, IndianRupee, TrendingUp, Eye } from "lucide-react"
import { format } from "date-fns"
import { CustomerDetailsView } from "./CustomerDetailsView"

interface CustomerData {
  id: string
  full_name: string
  email: string
  phone: string
  role: string
  registered_at: string
  total_sessions_booked: number
  is_first_session_used: boolean
  actual_bookings: number
  confirmed_bookings: number
  upcoming_bookings: number
  total_spent: number
  last_booking_date: string | null
}

export const CustomerList = () => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_customer_details' as any)
        .select('*')
        .order('registered_at', { ascending: false })

      if (error) throw error
      return data as unknown as CustomerData[]
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Management
          </CardTitle>
          <CardDescription>Loading customer data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading customers: {error.message}</p>
        </CardContent>
      </Card>
    )
  }

  const totalCustomers = customers?.length || 0
  const activeCustomers = customers?.filter(c => c.upcoming_bookings > 0).length || 0
  const totalRevenue = customers?.reduce((sum, c) => sum + Number(c.total_spent), 0) || 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCustomers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeCustomers}</p>
            <p className="text-sm text-muted-foreground">With upcoming bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-purple-500" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">₹{totalRevenue.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Customers
          </CardTitle>
          <CardDescription>
            Complete list of all registered customers and their booking history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {customers && customers.length > 0 ? (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-center">Total Sessions</TableHead>
                    <TableHead className="text-center">Upcoming</TableHead>
                    <TableHead className="text-right">Total Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead>Last Booking</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.full_name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.role === 'admin' ? (
                          <Badge variant="destructive">Admin</Badge>
                        ) : (
                          <Badge variant="secondary">User</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{customer.confirmed_bookings}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {customer.upcoming_bookings > 0 ? (
                          <Badge className="bg-green-500">{customer.upcoming_bookings}</Badge>
                        ) : (
                          <span className="text-muted-foreground">0</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{Number(customer.total_spent).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {customer.is_first_session_used ? (
                          <Badge variant="outline">Returning</Badge>
                        ) : (
                          <Badge className="bg-blue-500">New</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(customer.registered_at), 'MMM dd, yyyy')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {customer.last_booking_date ? (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(customer.last_booking_date), 'MMM dd, yyyy')}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No bookings</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCustomerId(customer.id)
                            setDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No customers yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <CustomerDetailsView
        customerId={selectedCustomerId}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false)
          setSelectedCustomerId(null)
        }}
      />
    </div>
  )
}
