/**
 * Email Templates for Mindful Wave Notifications
 * These are HTML email templates that can be used with any email service
 */

interface BookingDetails {
  customerName: string
  email: string
  phone: string
  date: string
  time: string
  sessionType: string
  amount: number
  isFirstSession: boolean
}

interface PaymentDetails {
  customerName: string
  email: string
  amount: number
  transactionId: string
  date: string
  sessionType: string
}

interface ReminderDetails {
  customerName: string
  date: string
  time: string
  sessionType: string
}

interface CancellationDetails {
  customerName: string
  date: string
  time: string
  sessionType: string
}

const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;',
  card: 'background-color: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);',
  header: 'color: #4F46E5; font-size: 24px; font-weight: bold; margin-bottom: 20px;',
  text: 'color: #333; font-size: 16px; line-height: 1.6; margin: 10px 0;',
  label: 'color: #666; font-size: 14px; font-weight: bold; margin-top: 15px;',
  value: 'color: #333; font-size: 16px; margin: 5px 0;',
  button: 'display: inline-block; background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px;',
  footer: 'color: #666; font-size: 12px; text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;',
}

/**
 * Generate Booking Confirmation Email HTML
 */
export function generateBookingConfirmationEmail(details: BookingDetails): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Confirmation</title>
</head>
<body style="${emailStyles.container}">
  <div style="${emailStyles.card}">
    <h1 style="${emailStyles.header}">✅ Booking Confirmed!</h1>
    
    <p style="${emailStyles.text}">Dear ${details.customerName},</p>
    
    <p style="${emailStyles.text}">
      Your session has been successfully confirmed. We look forward to welcoming you!
    </p>
    
    ${details.isFirstSession ? `
    <div style="background-color: #EEF2FF; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0;">
      <p style="color: #4F46E5; font-weight: bold; margin: 0;">
        🎉 This is your first session - It's FREE!
      </p>
    </div>
    ` : ''}
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="${emailStyles.label}">Session Details:</p>
      
      <p style="${emailStyles.value}">
        <strong>Session Type:</strong> ${details.sessionType}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Date:</strong> ${details.date}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Time:</strong> ${details.time}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Amount ${details.isFirstSession ? '(FREE)' : 'Paid'}:</strong> ₹${details.amount}
      </p>
    </div>
    
    <p style="${emailStyles.text}">
      <strong>Contact Information:</strong><br>
      Email: ${details.email}<br>
      Phone: ${details.phone}
    </p>
    
    <p style="${emailStyles.text}">
      You will receive a reminder 24 hours before your session.
    </p>
    
    <div style="text-align: center;">
      <a href="https://mindfulwave.com/dashboard" style="${emailStyles.button}">
        View My Bookings
      </a>
    </div>
  </div>
  
  <div style="${emailStyles.footer}">
    <p>Mindful Wave - Pranic Healing & Wellness</p>
    <p>If you have any questions, reply to this email or contact us.</p>
    <p style="margin-top: 15px;">
      <a href="https://mindfulwave.com" style="color: #4F46E5; text-decoration: none;">Visit Website</a> | 
      <a href="https://mindfulwave.com/profile" style="color: #4F46E5; text-decoration: none;">Manage Preferences</a>
    </p>
  </div>
</body>
</html>
  `
}

/**
 * Generate Payment Receipt Email HTML
 */
export function generatePaymentReceiptEmail(details: PaymentDetails): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt</title>
</head>
<body style="${emailStyles.container}">
  <div style="${emailStyles.card}">
    <h1 style="${emailStyles.header}">💳 Payment Receipt</h1>
    
    <p style="${emailStyles.text}">Dear ${details.customerName},</p>
    
    <p style="${emailStyles.text}">
      Thank you for your payment. Here are your transaction details:
    </p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="${emailStyles.value}">
        <strong>Session Type:</strong> ${details.sessionType}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Amount Paid:</strong> ₹${details.amount}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Transaction ID:</strong> ${details.transactionId}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Date:</strong> ${details.date}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Status:</strong> <span style="color: #10B981;">✅ Successful</span>
      </p>
    </div>
    
    <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; margin: 20px 0;">
      <p style="color: #92400E; margin: 0; font-size: 14px;">
        <strong>📄 Receipt:</strong> Please save this email for your records.
      </p>
    </div>
    
    <p style="${emailStyles.text}">
      Your booking is confirmed and you will receive a reminder before your session.
    </p>
    
    <div style="text-align: center;">
      <a href="https://mindfulwave.com/dashboard" style="${emailStyles.button}">
        View Dashboard
      </a>
    </div>
  </div>
  
  <div style="${emailStyles.footer}">
    <p>Mindful Wave - Pranic Healing & Wellness</p>
    <p>For any payment queries, please contact us with your transaction ID.</p>
  </div>
</body>
</html>
  `
}

/**
 * Generate Session Reminder Email HTML
 */
export function generateSessionReminderEmail(details: ReminderDetails): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Session Reminder</title>
</head>
<body style="${emailStyles.container}">
  <div style="${emailStyles.card}">
    <h1 style="${emailStyles.header}">⏰ Session Reminder</h1>
    
    <p style="${emailStyles.text}">Dear ${details.customerName},</p>
    
    <p style="${emailStyles.text}">
      This is a friendly reminder about your upcoming session tomorrow.
    </p>
    
    <div style="background-color: #EEF2FF; border-left: 4px solid #4F46E5; padding: 20px; margin: 20px 0;">
      <p style="${emailStyles.value}">
        <strong>Session Type:</strong> ${details.sessionType}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Date:</strong> ${details.date}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Time:</strong> ${details.time}
      </p>
    </div>
    
    <p style="${emailStyles.text}">
      <strong>What to bring:</strong>
    </p>
    <ul style="${emailStyles.text}">
      <li>Comfortable clothing</li>
      <li>Open mind and positive energy</li>
      <li>Any specific concerns you'd like to address</li>
    </ul>
    
    <p style="${emailStyles.text}">
      If you need to reschedule or cancel, please contact us at least 4 hours before your session time.
    </p>
    
    <div style="text-align: center;">
      <a href="https://mindfulwave.com/dashboard" style="${emailStyles.button}">
        View Booking Details
      </a>
    </div>
  </div>
  
  <div style="${emailStyles.footer}">
    <p>Mindful Wave - Pranic Healing & Wellness</p>
    <p>We look forward to seeing you tomorrow!</p>
  </div>
</body>
</html>
  `
}

/**
 * Generate Cancellation Email HTML
 */
export function generateCancellationEmail(details: CancellationDetails): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancelled</title>
</head>
<body style="${emailStyles.container}">
  <div style="${emailStyles.card}">
    <h1 style="${emailStyles.header}">❌ Booking Cancelled</h1>
    
    <p style="${emailStyles.text}">Dear ${details.customerName},</p>
    
    <p style="${emailStyles.text}">
      Your booking has been cancelled as requested.
    </p>
    
    <div style="background-color: #FEE2E2; border-left: 4px solid #EF4444; padding: 20px; margin: 20px 0;">
      <p style="${emailStyles.label}">Cancelled Session:</p>
      
      <p style="${emailStyles.value}">
        <strong>Session Type:</strong> ${details.sessionType}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Date:</strong> ${details.date}
      </p>
      
      <p style="${emailStyles.value}">
        <strong>Time:</strong> ${details.time}
      </p>
    </div>
    
    <p style="${emailStyles.text}">
      If this was a paid session, your refund will be processed within 5-7 business days.
    </p>
    
    <p style="${emailStyles.text}">
      We'd love to have you back! Book another session anytime that suits you better.
    </p>
    
    <div style="text-align: center;">
      <a href="https://mindfulwave.com/home#sessions" style="${emailStyles.button}">
        Book Another Session
      </a>
    </div>
  </div>
  
  <div style="${emailStyles.footer}">
    <p>Mindful Wave - Pranic Healing & Wellness</p>
    <p>If you have any questions about this cancellation, please contact us.</p>
  </div>
</body>
</html>
  `
}

/**
 * Generate Welcome Email for New Users
 */
export function generateWelcomeEmail(customerName: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Mindful Wave</title>
</head>
<body style="${emailStyles.container}">
  <div style="${emailStyles.card}">
    <h1 style="${emailStyles.header}">🙏 Welcome to Mindful Wave!</h1>
    
    <p style="${emailStyles.text}">Dear ${customerName},</p>
    
    <p style="${emailStyles.text}">
      Thank you for joining our healing community! We're excited to support you on your wellness journey.
    </p>
    
    <div style="background-color: #DBEAFE; border-left: 4px solid #3B82F6; padding: 20px; margin: 20px 0;">
      <p style="color: #1E40AF; font-weight: bold; margin: 0 0 10px 0;">
        🎁 Your First Session is FREE!
      </p>
      <p style="color: #1E40AF; margin: 0; font-size: 14px;">
        Book your first session today and experience the transformative power of Pranic Healing at no cost.
      </p>
    </div>
    
    <p style="${emailStyles.text}">
      <strong>What we offer:</strong>
    </p>
    <ul style="${emailStyles.text}">
      <li>Pranic Healing Sessions</li>
      <li>Energy Awareness Programs</li>
      <li>Mindful Living Workshops</li>
      <li>Personalized Wellness Guidance</li>
    </ul>
    
    <div style="text-align: center;">
      <a href="https://mindfulwave.com/home#sessions" style="${emailStyles.button}">
        Book Your Free Session
      </a>
    </div>
  </div>
  
  <div style="${emailStyles.footer}">
    <p>Mindful Wave - Pranic Healing & Wellness</p>
    <p>Your journey to better health starts here.</p>
  </div>
</body>
</html>
  `
}
