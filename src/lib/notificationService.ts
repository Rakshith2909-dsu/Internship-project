import { supabase } from "@/integrations/supabase/client"
import { Resend } from 'resend'
import { generateBookingConfirmationEmail, generatePaymentReceiptEmail, generateSessionReminderEmail, generateCancellationEmail } from './emailTemplates'

// Initialize Resend
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

export interface NotificationData {
  userId: string
  bookingId?: string
  type: 'booking_confirmation' | 'payment_receipt' | 'session_reminder' | 'cancellation'
  channel: 'email' | 'sms' | 'both'
  recipientEmail?: string
  recipientPhone?: string
  subject?: string
  templateData?: Record<string, any>
}

export interface EmailPreferences {
  booking_confirmations: boolean
  payment_receipts: boolean
  session_reminders: boolean
  marketing_emails: boolean
}

/**
 * Get user's email preferences
 */
export async function getEmailPreferences(userId: string): Promise<EmailPreferences | null> {
  const { data, error } = await supabase
    .from('email_preferences' as any)
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching email preferences:', error)
    return null
  }

  return data as unknown as EmailPreferences
}

/**
 * Update user's email preferences
 */
export async function updateEmailPreferences(
  userId: string,
  preferences: Partial<EmailPreferences>
): Promise<boolean> {
  const { error } = await supabase
    .from('email_preferences' as any)
    .update(preferences)
    .eq('user_id', userId)

  if (error) {
    console.error('Error updating email preferences:', error)
    return false
  }

  return true
}

/**
 * Log a notification in the database
 */
export async function logNotification(data: NotificationData): Promise<string | null> {
  const { data: result, error } = await (supabase as any).rpc('log_notification', {
    p_user_id: data.userId,
    p_booking_id: data.bookingId || null,
    p_type: data.type,
    p_channel: data.channel,
    p_recipient_email: data.recipientEmail || null,
    p_recipient_phone: data.recipientPhone || null,
    p_subject: data.subject || null,
  })

  if (error) {
    console.error('Error logging notification:', error)
    return null
  }

  return result as string
}

/**
 * Mark notification as sent
 */
export async function markNotificationSent(
  notificationId: string,
  status: 'sent' | 'failed' | 'bounced' = 'sent',
  errorMessage?: string
): Promise<boolean> {
  const { data, error } = await (supabase as any).rpc('mark_notification_sent', {
    p_notification_id: notificationId,
    p_status: status,
    p_error_message: errorMessage || null,
  })

  if (error) {
    console.error('Error marking notification as sent:', error)
    return false
  }

  return data as boolean
}

/**
 * Get notification history for a user
 */
export async function getNotificationHistory(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('notification_logs' as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching notification history:', error)
    return []
  }

  return data
}

/**
 * Send booking confirmation notification
 * This would integrate with your email service (Resend, SendGrid, etc.)
 */
export async function sendBookingConfirmation(
  userId: string,
  bookingId: string,
  bookingDetails: {
    customerName: string
    email: string
    phone: string
    date: string
    time: string
    sessionType: string
    amount: number
    isFirstSession: boolean
  }
): Promise<boolean> {
  try {
    // Check if user wants booking confirmations
    const preferences = await getEmailPreferences(userId)
    if (!preferences?.booking_confirmations) {
      console.log('User has disabled booking confirmations')
      return false
    }

    // Log the notification
    const notificationId = await logNotification({
      userId,
      bookingId,
      type: 'booking_confirmation',
      channel: 'email',
      recipientEmail: bookingDetails.email,
      subject: `Booking Confirmed - ${bookingDetails.sessionType}`,
    })

    if (!notificationId) {
      return false
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Ganora Holistic Hub <bookings@resend.dev>',
        to: bookingDetails.email,
        subject: `Booking Confirmed - ${bookingDetails.sessionType}`,
        html: generateBookingConfirmationEmail(bookingDetails)
      })

      // Mark as sent
      await markNotificationSent(notificationId, 'sent')
      console.log('Booking confirmation email sent successfully:', bookingDetails.email)
      return true
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      await markNotificationSent(notificationId, 'failed', 'Failed to send email via Resend')
      return false
    }
  } catch (error) {
    console.error('Error sending booking confirmation:', error)
    return false
  }
}

/**
 * Send payment receipt notification
 */
export async function sendPaymentReceipt(
  userId: string,
  bookingId: string,
  paymentDetails: {
    customerName: string
    email: string
    amount: number
    transactionId: string
    date: string
    sessionType: string
  }
): Promise<boolean> {
  try {
    const preferences = await getEmailPreferences(userId)
    if (!preferences?.payment_receipts) {
      return false
    }

    const notificationId = await logNotification({
      userId,
      bookingId,
      type: 'payment_receipt',
      channel: 'email',
      recipientEmail: paymentDetails.email,
      subject: 'Payment Receipt - Mindful Wave',
    })

    if (!notificationId) {
      return false
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Ganora Holistic Hub <payments@resend.dev>',
        to: paymentDetails.email,
        subject: 'Payment Receipt - Ganora Holistic Hub',
        html: generatePaymentReceiptEmail(paymentDetails)
      })

      await markNotificationSent(notificationId, 'sent')
      console.log('Payment receipt email sent successfully:', paymentDetails.email)
      return true
    } catch (emailError) {
      console.error('Error sending payment receipt:', emailError)
      await markNotificationSent(notificationId, 'failed', 'Failed to send email via Resend')
      return false
    }
  } catch (error) {
    console.error('Error sending payment receipt:', error)
    return false
  }
}

/**
 * Send session reminder (called by scheduled job 24 hours before)
 */
export async function sendSessionReminder(
  userId: string,
  bookingId: string,
  reminderDetails: {
    customerName: string
    email: string
    phone: string
    date: string
    time: string
    sessionType: string
  }
): Promise<boolean> {
  try {
    const preferences = await getEmailPreferences(userId)
    if (!preferences?.session_reminders) {
      return false
    }

    const notificationId = await logNotification({
      userId,
      bookingId,
      type: 'session_reminder',
      channel: 'email',
      recipientEmail: reminderDetails.email,
      subject: `Reminder: Your session tomorrow at ${reminderDetails.time}`,
    })

    if (!notificationId) {
      return false
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Ganora Holistic Hub <reminders@resend.dev>',
        to: reminderDetails.email,
        subject: `Reminder: Your session tomorrow at ${reminderDetails.time}`,
        html: generateSessionReminderEmail(reminderDetails)
      })

      await markNotificationSent(notificationId, 'sent')
      console.log('Session reminder email sent successfully:', reminderDetails.email)
      return true
    } catch (emailError) {
      console.error('Error sending session reminder:', emailError)
      await markNotificationSent(notificationId, 'failed', 'Failed to send email via Resend')
      return false
    }
  } catch (error) {
    console.error('Error sending session reminder:', error)
    return false
  }
}

/**
 * Send cancellation notification
 */
export async function sendCancellationNotification(
  userId: string,
  bookingId: string,
  cancellationDetails: {
    customerName: string
    email: string
    date: string
    time: string
    sessionType: string
  }
): Promise<boolean> {
  try {
    const notificationId = await logNotification({
      userId,
      bookingId,
      type: 'cancellation',
      channel: 'email',
      recipientEmail: cancellationDetails.email,
      subject: 'Booking Cancelled - Mindful Wave',
    })

    if (!notificationId) {
      return false
    }

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'Ganora Holistic Hub <bookings@resend.dev>',
        to: cancellationDetails.email,
        subject: 'Booking Cancelled - Ganora Holistic Hub',
        html: generateCancellationEmail(cancellationDetails)
      })

      await markNotificationSent(notificationId, 'sent')
      console.log('Cancellation email sent successfully:', cancellationDetails.email)
      return true
    } catch (emailError) {
      console.error('Error sending cancellation email:', emailError)
      await markNotificationSent(notificationId, 'failed', 'Failed to send email via Resend')
      return false
    }
  } catch (error) {
    console.error('Error sending cancellation notification:', error)
    return false
  }
}
