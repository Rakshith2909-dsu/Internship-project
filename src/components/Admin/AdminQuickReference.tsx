import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  Users, 
  CalendarCheck, 
  IndianRupee,
  Database,
  Key,
  Info
} from "lucide-react"

export const AdminQuickReference = () => {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admin Quick Reference
        </CardTitle>
        <CardDescription>
          Essential information and tips for managing the platform
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Features */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Available Features
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-full justify-start">
                <Users className="h-3 w-3 mr-2" />
                Customer Management
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-full justify-start">
                <CalendarCheck className="h-3 w-3 mr-2" />
                Booking Control
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-full justify-start">
                <IndianRupee className="h-3 w-3 mr-2" />
                Payment Tracking
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline" className="w-full justify-start">
                <Database className="h-3 w-3 mr-2" />
                Analytics & Reports
              </Badge>
            </div>
          </div>
        </div>

        {/* Customer Actions */}
        <Alert>
          <Users className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Customer Details:</strong> Click "View" on any customer to see their complete booking history, 
            payment records, and session preferences.
          </AlertDescription>
        </Alert>

        {/* Booking Management */}
        <Alert>
          <CalendarCheck className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Booking Management:</strong> You can cancel bookings if needed. Upcoming bookings are highlighted 
            for easy identification.
          </AlertDescription>
        </Alert>

        {/* Payment Info */}
        <Alert>
          <IndianRupee className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Payment Tracking:</strong> All Razorpay transactions are logged with payment IDs for verification. 
            Check the Payments tab for detailed transaction history.
          </AlertDescription>
        </Alert>

        {/* Admin Access */}
        <Alert className="border-primary/50 bg-primary/5">
          <Key className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Admin Access:</strong> To add more admins, use the SQL function:
            <code className="block mt-2 p-2 bg-muted rounded text-xs">
              SELECT make_user_admin('email@example.com');
            </code>
          </AlertDescription>
        </Alert>

        {/* Tips */}
        <div className="pt-2 space-y-1 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">💡 Quick Tips:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use filters to find specific customers or bookings</li>
            <li>Export data by copying tables when needed</li>
            <li>Check Analytics tab for business insights</li>
            <li>First-time customers get a free session automatically</li>
            <li>Pending payments require customer action to complete</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
