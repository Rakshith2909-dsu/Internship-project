# 📧 Email & SMS Notifications Setup Guide

## Overview

Your Mindful Wave website now sends automatic notifications for:
1. **Password Reset** - Automatically sent by Supabase when user requests password reset
2. **Booking Confirmations** - Sent after successful booking (free or paid)
3. **Payment Receipts** - Sent after successful payment
4. **Session Reminders** - Sent 24 hours before scheduled session

---

## 🔧 Current Status

### ✅ Already Configured
- Password reset emails (handled by Supabase Auth)
- Notification logging system (logs all notifications in database)
- Email templates (HTML emails for booking confirmations, receipts, etc.)
- Integration in booking flow

### ⚠️ Needs Configuration
- **SMTP Settings** or **Email Service Provider** (to actually send emails)
- **SMS Gateway** (optional - for SMS notifications)

---

## 📨 Step 1: Configure Email Sending

You have 3 options to send emails:

### Option A: Supabase Built-in SMTP (Recommended for Testing)

**Note:** Supabase's built-in email is good for testing but has limitations for production.

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Your reset password emails will work automatically
3. For custom emails (booking confirmations), you need to use Supabase Edge Functions or integrate an email service

### Option B: Resend (Recommended for Production)

[Resend](https://resend.com) is a modern email API with generous free tier (100 emails/day).

**Setup Steps:**

1. **Create Resend Account**
   - Go to https://resend.com and sign up
   - Verify your email

2. **Get API Key**
   - Go to Dashboard → API Keys
   - Create a new API key
   - Copy it (starts with `re_`)

3. **Add to .env**
   ```env
   VITE_RESEND_API_KEY="re_your_api_key_here"
   ```

4. **Install Resend Package**
   ```bash
   npm install resend
   ```

5. **Update notificationService.ts**
   
   Open `src/lib/notificationService.ts` and find the sendBookingConfirmation function.
   
   Uncomment and update the Resend integration:
   ```typescript
   import { Resend } from 'resend';
   const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

   // In sendBookingConfirmation function:
   await resend.emails.send({
     from: 'Ganora Holistic Hub <bookings@yourdomain.com>',
     to: bookingDetails.email,
     subject: `Booking Confirmed - ${bookingDetails.sessionType}`,
     html: generateBookingConfirmationEmail(bookingDetails)
   });
   ```

6. **Verify Domain (For Production)**
   - In Resend Dashboard → Domains
   - Add your domain
   - Add the provided DNS records to your domain
   - Wait for verification

**Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Perfect for starting out

---

### Option C: SendGrid

[SendGrid](https://sendgrid.com) offers 100 emails/day free forever.

**Setup Steps:**

1. **Create SendGrid Account**
   - Go to https://sendgrid.com and sign up

2. **Create API Key**
   - Go to Settings → API Keys
   - Create API Key with "Full Access"
   - Copy the key

3. **Add to .env**
   ```env
   VITE_SENDGRID_API_KEY="SG.your_api_key_here"
   ```

4. **Install SendGrid Package**
   ```bash
  npm install @sendgrid/mail
   ```

5. **Update notificationService.ts**
   ```typescript
   import sgMail from '@sendgrid/mail';
   sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY!);

   // In sendBookingConfirmation function:
   await sgMail.send({
     to: bookingDetails.email,
     from: 'bookings@yourdomain.com', // must be verified
     subject: `Booking Confirmed - ${bookingDetails.sessionType}`,
     html: generateBookingConfirmationEmail(bookingDetails)
   });
   ```

6. **Verify Sender Email**
   - Go to Settings → Sender Authentication
   - Verify single sender email
   - Or authenticate your domain (for production)

---

## 🔐 Step 2: Configure Password Reset Emails

### Already Working! ✅

Password reset emails are **automatically sent by Supabase** when users click "Forgot Password".

**To Customize:**

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Click on **Reset Password** template
3. Customize the HTML template
4. Use these variables:
   - `{{ .Token }}` - Reset token
   - `{{ .SiteURL }}` - Your site URL
   - `{{ .TokenHash }}` - Token hash

**Example Custom Template:**
```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password:</p>
<a href="{{ .SiteURL }}/reset-password?token={{ .TokenHash }}">Reset Password</a>
<p>If you didn't request this, please ignore this email.</p>
```

---

## 📱 Step 3: SMS Notifications (Optional)

To send SMS notifications for bookings, integrate with an SMS gateway.

### Recommended: Twilio

1. **Create Twilio Account**
   - Go to https://twilio.com and sign up
   - Get $15 free credit

2. **Get Credentials**
   - Account SID
   - Auth Token
   - Twilio Phone Number

3. **Add to .env**
   ```env
   VITE_TWILIO_ACCOUNT_SID="your_account_sid"
   VITE_TWILIO_AUTH_TOKEN="your_auth_token"
   VITE_TWILIO_PHONE_NUMBER="+1234567890"
   ```

4. **Install Twilio**
   ```bash
   npm install twilio
   ```

5. **Update notificationService.ts**
   ```typescript
   import twilio from 'twilio';
   const client = twilio(
     import.meta.env.VITE_TWILIO_ACCOUNT_SID,
     import.meta.env.VITE_TWILIO_AUTH_TOKEN
   );

   // Add SMS sending function:
   export async function sendBookingSMS(phone: string, message: string) {
     await client.messages.create({
       body: message,
       from: import.meta.env.VITE_TWILIO_PHONE_NUMBER,
       to: phone
     });
   }
   ```

---

## 🧪 Step 4: Testing

### Test Password Reset
1. Go to http://localhost:8081/forgot-password
2. Enter your email
3. Check your email inbox
4. Click the reset link

### Test Booking Confirmation  
1. Book a session
2. Complete the booking
3. Check your email for confirmation
4. Verify all details are correct

### Check Notification Logs
1. Go to **Supabase Dashboard** → **Table Editor**
2. Open `notification_logs` table
3. See all sent notifications with status

---

## 🔔 Step 5: Configure Email Preferences

Users can control which emails they receive:

1. **Database Setup** (Already Done)
   - `email_preferences` table tracks user preferences
   - Default: all notifications enabled

2. **User Dashboard**
   - Users can go to Profile/Settings
   - Toggle preferences for:
     - Booking confirmations
     - Payment receipts
     - Session reminders
     - Marketing emails

---

## 📊 Email Templates Available

All templates are in `src/lib/emailTemplates.ts`:

1. **Booking Confirmation** - `generateBookingConfirmationEmail()`
2. **Payment Receipt** - `generatePaymentReceiptEmail()`
3. **Session Reminder** - `generateSessionReminderEmail()`
4. **Cancellation** - `generateCancellationEmail()`

**Customize them** by editing the HTML in `emailTemplates.ts`!

---

## 🚀 Quick Start (Recommended Path)

1. **For Testing:**
   - Use Supabase's built-in email (already working for password reset)
   - Booking confirmations will log but not send (check console logs)

2. **For Production:**
   - Set up Resend (easiest)
   - Add API key to `.env`
   - Update `notificationService.ts` to integrate Resend
   - Verify your domain
   - Test all email types

---

## 🎯 Current Working Features

### ✅ Password Reset
- User clicks "Forgot Password"
- Enters email
- Receives reset link via Supabase
- Clicks link and resets password
- **Working right now!**

### ✅ Booking Notification (Logging Only)
- User books a session  
- Notification is logged in database
- Email template is generated
- **Ready to send when you add email service!**

---

## 💡 Need Help?

### Common Issues

**Emails not sending:**
- Check API keys in `.env`
- Verify sender email/domain
- Check notification_logs table for errors
- Look at browser console for error messages

**Password reset not working:**
- Check Supabase email settings
- Verify Site URL in Supabase → Authentication → URL Configuration
- Check spam folder

**Emails going to spam:**
- Verify your sender domain
- Add SPF and DKIM records
- Use a verified email service (not Gmail/Yahoo from)

---

## 📞 Next Steps

1. Choose an email service (Resend recommended)
2. Get API key
3. Add to `.env`
4. Update `notificationService.ts`
5. Test with a real booking
6. Check email inbox
7. Celebrate! 🎉

---

## 🔗 Useful Links

- [Resend Documentation](https://resend.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Twilio SMS Documentation](https://www.twilio.com/docs/sms)
- [Supabase Auth Email](https://supabase.com/docs/guides/auth/auth-email-templates)

---

**Your notification system is ready! Just add your email service API key to start sending emails.** 📧✨
