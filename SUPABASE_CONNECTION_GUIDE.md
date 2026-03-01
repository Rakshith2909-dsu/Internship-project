# 🚀 Complete Supabase Setup Guide
## Step-by-Step Setup from Supabase Console

**Last Updated:** February 18, 2026

---

## 📋 What You'll Need

- Google/GitHub account (for Supabase login)
- 15 minutes of your time
- Your website's `.env` file

---

## 🎯 Step 1: Create a Supabase Account & Project

### 1.1 Visit Supabase
1. Open your browser and go to: **https://supabase.com**
2. Click **"Start your project"** or **"Sign In"** (top right)

### 1.2 Sign Up/Login
3. Choose one of these options:
   - **Sign in with GitHub** (recommended)
   - **Sign in with Google**
   - Or use email/password

### 1.3 Create New Project
4. After logging in, you'll see the Supabase Dashboard
5. Click **"New Project"** button (green button)
6. Fill in the project details:
   - **Organization:** Create new or select existing
   - **Name:** `ganora-holistic-hub` (or any name you prefer)
   - **Database Password:** Create a STRONG password (save this!)
     - ⚠️ **IMPORTANT:** Save this password securely - you'll need it!
   - **Region:** Select closest to your location (e.g., `Mumbai (ap-south-1)` for India)
   - **Pricing Plan:** Select **Free** plan (perfect for starting)

7. Click **"Create new project"**
8. ⏳ Wait 2-3 minutes while Supabase sets up your database

---

## 🔑 Step 2: Get Your API Credentials

### 2.1 Navigate to Project Settings
1. Once project is ready, click **"Settings"** icon (⚙️) in the left sidebar
2. Click **"API"** under Project Settings

### 2.2 Copy Your Credentials
3. You'll see these important values:

   **Project URL:**
   ```
   https://your-project-id.supabase.co
   ```
   ✅ Copy this entire URL

   **API Keys:**
   - Find **"anon" key** (also called "public" key)
   - This is a long string starting with `eyJ...`
   - ✅ Copy this entire key

### 2.3 Save Credentials to `.env` File
4. Open your project folder in VS Code
5. Open the `.env` file in the root directory
6. Replace the placeholder values:

```env
# BEFORE (placeholders):
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key

# AFTER (your actual values):
VITE_SUPABASE_URL=https://abcdefghijklmn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDI1MjM2MjIsImV4cCI6MTk1ODEwMDYyMn0.abcd1234567890
```

7. **Save the file** (Ctrl+S / Cmd+S)

⚠️ **SECURITY NOTE:** Never commit `.env` to Git! It's already in `.gitignore`.

---

## 🗄️ Step 3: Run Database Migrations

### 3.1 Access SQL Editor
1. In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"+ New query"** button

### 3.2 Run Migrations in Order

You have **6 migration files** to run. Run them **ONE BY ONE** in this exact order:

#### ✅ **Migration 1: Authentication Setup**
1. Open your project folder → `supabase/migrations/`
2. Open `20260217000001_phase1_auth_setup.sql`
3. **Copy the entire contents**
4. Paste into Supabase SQL Editor
5. Click **"Run"** button (or press Ctrl+Enter)
6. ✅ You should see: "Success. No rows returned"

#### ✅ **Migration 2: Payment Setup**
1. Open `20260217000002_phase2_payment_setup.sql`
2. Copy entire contents
3. Paste into SQL Editor (clear previous query first)
4. Click **"Run"**
5. ✅ Verify success message

#### ✅ **Migration 3: Booking Restrictions**
1. Open `20260217000003_phase3_booking_restrictions.sql`
2. Copy entire contents
3. Paste and Run
4. ✅ Verify success

#### ✅ **Migration 4: Admin Role Setup**
1. Open `20260218000001_phase5_admin_role.sql`
2. Copy entire contents
3. Paste and Run
4. ✅ Verify success

#### ✅ **Migration 5: Notification System**
1. Open `20260218000002_phase6_notifications.sql`
2. Copy entire contents
3. Paste and Run
4. ✅ Verify success

### 3.3 Verify Tables Created
1. Click **"Table Editor"** in left sidebar
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `bookings`
   - ✅ `payments`
   - ✅ `email_preferences`
   - ✅ `notification_logs`

---

## 👤 Step 4: Create Your First User (Account)

### 4.1 Run Your Website Locally
1. Open terminal in VS Code
2. Make sure you're in the project directory
3. Run: `npm run dev`
4. Open browser: `http://localhost:8080` (or whatever port is shown)

### 4.2 Sign Up
1. Click **"Sign Up"** button on your website
2. Enter your details:
   - **Name:** Your name
   - **Email:** Your email (you'll need to verify this)
   - **Password:** Strong password
3. Click **"Sign Up"**

### 4.3 Verify Email
1. Check your email inbox
2. Find email from Supabase (check spam folder if needed)
3. Click **"Confirm your email"** link
4. ✅ You're now registered!

---

## 👑 Step 5: Make Yourself Admin

### 5.1 Get Your User ID
1. Go back to **Supabase Dashboard**
2. Click **"Authentication"** in left sidebar
3. Click **"Users"** tab
4. Find your email in the list
5. Click on your user to see details
6. **Copy your User ID** (UUID format: `123e4567-e89b-12d3-a456-426614174000`)

### 5.2 Grant Admin Role (Method 1: Using Email)
1. Go to **SQL Editor** in Supabase
2. Click **"+ New query"**
3. Paste this SQL command (replace with YOUR email):

```sql
SELECT make_user_admin('youremail@example.com');
```

4. Click **"Run"**
5. ✅ You should see: Success message

### 5.3 Grant Admin Role (Method 2: Using User ID)
Alternatively, use this SQL:

```sql
UPDATE profiles
SET role = 'admin'
WHERE id = 'your-user-id-here';
```

Replace `'your-user-id-here'` with the UUID you copied.

---

## ✅ Step 6: Test Everything

### 6.1 Test User Login
1. On your website, click **"Login"**
2. Enter your credentials
3. ✅ You should be redirected to Dashboard

### 6.2 Test Admin Access
1. Once logged in, look for **"Admin"** in navigation menu
2. Click **"Admin Dashboard"**
3. ✅ You should see:
   - Analytics tab
   - Customer management
   - Booking management
   - Payment tracking

### 6.3 Test Booking Flow
1. Go to homepage (click logo)
2. Scroll to **"Sessions"** section
3. Click **"Book Now"** on any session
4. Fill in booking details
5. ✅ First session should be **FREE (₹0)**
6. Submit booking
7. Check Dashboard → Booking History
8. ✅ Your booking should appear

### 6.4 Test Payment Flow (Second Booking)
1. Book another session (same or different type)
2. ✅ This should show **₹500** payment
3. Click **"Proceed to Payment"**
4. Use Razorpay **Test Mode** cards:
   - Card: `4111 1111 1111 1111`
   - CVV: Any 3 digits
   - Expiry: Any future date
5. Complete payment
6. ✅ You should be redirected to Payment Success page

---

## 🎨 Step 7: Configure Authentication (Optional but Recommended)

### 7.1 Email Templates
1. In Supabase → **"Authentication"** → **"Email Templates"**
2. Customize these:
   - Confirm signup
   - Reset password
   - Magic link
3. Add your branding (logo, colors, text)

### 7.2 Enable Additional Auth Providers (Optional)
1. In Supabase → **"Authentication"** → **"Providers"**
2. You can enable:
   - Google OAuth
   - GitHub OAuth
   - Facebook
   - etc.
3. Each requires setup with the provider (out of scope for now)

---

## 🔒 Step 8: Security Best Practices

### 8.1 Review RLS Policies
1. In Supabase → **"Authentication"** → **"Policies"**
2. ✅ All tables should have RLS (Row Level Security) enabled
3. ✅ Policies are already created by migrations

### 8.2 API Key Security
- ✅ Never expose your **service_role** key (it's not in `.env` - good!)
- ✅ Only use **anon/public** key in frontend
- ✅ Never commit `.env` to version control

---

## 🚀 Step 9: Deploy Your Website

Once everything works locally, deploy:

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Build your project
npm run build

# Deploy
vercel --prod
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build your project
npm run build

# Deploy
netlify deploy --prod
```

### 9.1 Add Environment Variables to Hosting
1. Go to your hosting dashboard (Vercel/Netlify)
2. Find **"Environment Variables"** section
3. Add these two variables:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your anon key

---

## 🎉 Done! Your Website is Live!

### What You've Accomplished:
- ✅ Created Supabase project
- ✅ Connected your website to Supabase
- ✅ Ran all database migrations
- ✅ Created and verified your account
- ✅ Granted yourself admin access
- ✅ Tested authentication, bookings, and payments
- ✅ Ready to deploy to production!

---

## 📊 Monitoring Your Application

### Daily Tasks:
1. **Check Supabase Dashboard:**
   - Monitor active users
   - Check database size
   - Review API usage

2. **Admin Dashboard:**
   - Track bookings
   - Monitor payments
   - View analytics

### Supabase Free Tier Limits:
- ✅ 500 MB database space
- ✅ 2 GB bandwidth/month
- ✅ 50,000 monthly active users
- ✅ Unlimited API requests

---

## 🆘 Troubleshooting

### Issue: "Invalid API Key"
**Solution:** 
- Double-check `.env` file credentials
- Make sure there are no spaces or quotes around values
- Restart dev server after changing `.env`

### Issue: "User not found" when trying to make admin
**Solution:**
- Verify email is confirmed
- Check exact email spelling in SQL command
- Try using User ID method instead

### Issue: RLS Policy Error
**Solution:**
- Re-run the migration file that creates policies
- Check Supabase logs: Dashboard → Logs → Postgres Logs

### Issue: Payment not working
**Solution:**
- Razorpay test mode: Use test card `4111 1111 1111 1111`
- Check browser console for errors
- Verify Razorpay keys in code (currently hardcoded for testing)

---

## 📞 Need Help?

If you encounter issues:

1. **Check Supabase Logs:**
   - Dashboard → Logs → Postgres Logs

2. **Check Browser Console:**
   - Press F12 → Console tab

3. **Review Documentation:**
   - [Supabase Docs](https://supabase.com/docs)
   - [React Query Docs](https://tanstack.com/query/latest)

---

## 🎯 Next Steps

After successful setup:

1. **Customize Content:**
   - Update About section with your story
   - Add your photos to Gallery
   - Customize service descriptions

2. **Enable Real Email Notifications:**
   - Integrate Resend or SendGrid
   - Update `notificationService.ts`

3. **Switch Payment to Live Mode:**
   - Get Razorpay live keys
   - Update payment integration

4. **Add Analytics:**
   - Google Analytics
   - Facebook Pixel
   - Sentry for error tracking

5. **SEO Optimization:**
   - Add meta tags
   - Create sitemap
   - Submit to Google Search Console

---

**🎊 Congratulations! Your Ganora Holistic Hub website is now fully functional!**

*Last Updated: February 18, 2026*
