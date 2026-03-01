import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Analytics } from "@/components/Admin/Analytics"
import { CustomerList } from "@/components/Admin/CustomerList"
import { BookingManagement } from "@/components/Admin/BookingManagement"
import { PaymentTracking } from "@/components/Admin/PaymentTracking"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { 
  BarChart3, 
  Users, 
  CalendarCheck, 
  IndianRupee, 
  ArrowLeft,
  Shield
} from "lucide-react"

export default function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Manage customers, bookings, payments, and view analytics
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="customers" className="gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <IndianRupee className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics />
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <CustomerList />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingManagement />
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <PaymentTracking />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
