import { useState, useEffect } from "react"
import { useAuth } from "@/components/Auth/AuthProvider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Bell } from "lucide-react"
import { getEmailPreferences, updateEmailPreferences, EmailPreferences } from "@/lib/notificationService"

export const EmailPreferencesCard = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState<EmailPreferences>({
    booking_confirmations: true,
    payment_receipts: true,
    session_reminders: true,
    marketing_emails: false,
  })

  useEffect(() => {
    if (user) {
      loadPreferences()
    }
  }, [user])

  const loadPreferences = async () => {
    if (!user) return
    
    setLoading(true)
    const prefs = await getEmailPreferences(user.id)
    
    if (prefs) {
      setPreferences(prefs)
    }
    
    setLoading(false)
  }

  const handleToggle = (key: keyof EmailPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    const success = await updateEmailPreferences(user.id, preferences)
    
    if (success) {
      toast({
        title: "Preferences Updated",
        description: "Your email notification preferences have been saved.",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      })
    }
    
    setSaving(false)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email Notifications
        </CardTitle>
        <CardDescription>
          Manage your email notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Booking Confirmations */}
          <div className="flex items-center justify-between space-x-2 pb-4 border-b">
            <div className="space-y-1 flex-1">
              <Label htmlFor="booking-confirmations" className="text-base font-medium">
                Booking Confirmations
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive confirmation emails when you book a session
              </p>
            </div>
            <Switch
              id="booking-confirmations"
              checked={preferences.booking_confirmations}
              onCheckedChange={() => handleToggle('booking_confirmations')}
            />
          </div>

          {/* Payment Receipts */}
          <div className="flex items-center justify-between space-x-2 pb-4 border-b">
            <div className="space-y-1 flex-1">
              <Label htmlFor="payment-receipts" className="text-base font-medium">
                Payment Receipts
              </Label>
              <p className="text-sm text-muted-foreground">
                Get email receipts for all your payments
              </p>
            </div>
            <Switch
              id="payment-receipts"
              checked={preferences.payment_receipts}
              onCheckedChange={() => handleToggle('payment_receipts')}
            />
          </div>

          {/* Session Reminders */}
          <div className="flex items-center justify-between space-x-2 pb-4 border-b">
            <div className="space-y-1 flex-1">
              <Label htmlFor="session-reminders" className="text-base font-medium">
                Session Reminders
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders 24 hours before your scheduled sessions
              </p>
            </div>
            <Switch
              id="session-reminders"
              checked={preferences.session_reminders}
              onCheckedChange={() => handleToggle('session_reminders')}
            />
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between space-x-2 pb-4">
            <div className="space-y-1 flex-1">
              <Label htmlFor="marketing-emails" className="text-base font-medium">
                Marketing & Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get updates about new services, workshops, and special offers
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences.marketing_emails}
              onCheckedChange={() => handleToggle('marketing_emails')}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-4">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
