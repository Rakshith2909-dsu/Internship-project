# 🚀 Supabase Setup Guide - Mindful Wave

## Step 1: Create New Supabase Project

### 1.1 Sign Up
1. Go to: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up with your **new email address**
4. Verify your email

### 1.2 Create Project
1. After login, click **"New Project"**
2. Fill in the details:
   - **Organization:** Create new or select existing
   - **Project Name:** `mindful-wave` (or your preferred name)
   - **Database Password:** Choose a strong password ⚠️ **SAVE THIS!**
   - **Region:** Choose closest to your location
     - Mumbai: `ap-south-1`
     - Singapore: `ap-southeast-1`
     - US East: `us-east-1`
   - **Pricing Plan:** Select **Free** tier
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for project initialization

---

## Step 2: Get Your Credentials

### 2.1 Navigate to API Settings
1. In your Supabase project dashboard
2. Click **"Settings"** (gear icon) in the left sidebar
3. Click **"API"** section

### 2.2 Copy These Values
You need **THREE** values:

#### A. Project URL
- Look for: **Project URL**
- Example: `https://abcdefghijk.supabase.co`
- 📋 Copy this entire URL

#### B. Project Reference ID
- Look for: **Reference ID** or in the URL itself
- Example: `abcdefghijk`
- 📋 Copy this ID

#### C. Anon/Public Key
- Look for: **Project API keys** → **anon** / **public**
- It's a long token starting with `eyJ...`
- Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- 📋 Copy the entire token

---

## Step 3: Update Your .env File

1. **Open the `.env` file** in your project root:
   ```
   mindful-wave-site-main/.env
   ```

2. **Replace the placeholder values** with your credentials:

   ```env
   VITE_SUPABASE_PROJECT_ID="YOUR_PROJECT_REF_ID_HERE"
   VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_ANON_PUBLIC_KEY_HERE"
   VITE_SUPABASE_URL="https://YOUR_PROJECT_REF_ID_HERE.supabase.co"
   ```

3. **Example after filling:**
   ```env
   VITE_SUPABASE_PROJECT_ID="abcdefghijk"
   VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAxNTU3NjAwMH0.xxxxxxxxxxxxxxxxxxxxx"
   VITE_SUPABASE_URL="https://abcdefghijk.supabase.co"
   ```

4. **Save the file**

---

## Step 4: Apply Database Migrations

Your database is empty! You need to create tables.

### Option A: Using Supabase Dashboard (Recommended - Easiest)

#### 4.1 Open SQL Editor
1. In Supabase Dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

#### 4.2 Run Each Migration (IN ORDER)

**Migration 1: Auth Setup**
1. Copy the entire content from: `supabase/migrations/20260217000001_phase1_auth_setup.sql`
2. Paste into SQL Editor
3. Click **"Run"** or press `Ctrl+Enter`
4. ✅ Wait for success message

**Migration 2: Payment Setup**
1. Copy the entire content from: `supabase/migrations/20260217000002_phase2_payment_setup.sql`
2. Paste into SQL Editor
3. Click **"Run"**
4. ✅ Wait for success message

**Migration 3: Booking Restrictions**
1. Copy the entire content from: `supabase/migrations/20260217000003_phase3_booking_restrictions.sql`
2. Paste into SQL Editor
3. Click **"Run"**
4. ✅ Wait for success message

#### 4.3 Verify Tables Created
1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `user_profiles`
   - ✅ `bookings`
   - ✅ `payments`

### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project (use your project ref ID)
supabase link --project-ref YOUR_PROJECT_REF_ID_HERE

# Push migrations
supabase db push
```

---

## Step 5: Enable Email Authentication

### 5.1 Configure Auth Provider
1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **"Email"** provider
3. Make sure it's **Enabled** (should be by default)

### 5.2 Configure Email Templates (Optional)
1. Go to **Authentication** → **Email Templates**
2. Customize these templates if desired:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

### 5.3 Site URL Configuration
1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your development URL:
   ```
   http://localhost:8081
   ```
3. Add **Redirect URLs**:
   ```
   http://localhost:8081/**
   ```

---

## Step 6: Test Your Setup

### 6.1 Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Start again
npm run dev
```

### 6.2 Test User Registration
1. Open your website: `http://localhost:8081`
2. Click **"Sign Up Free"**
3. Fill in the form with test data
4. Click **"Sign Up"**

### 6.3 Verify in Supabase
1. Go to Supabase Dashboard
2. Click **"Authentication"** → **"Users"**
3. ✅ You should see your test user!
4. Click **"Table Editor"** → **"user_profiles"**
5. ✅ You should see the user profile!

### 6.4 Test Booking
1. Login with your test user
2. Click **"Book a Session"**
3. Fill in booking details
4. Complete booking
5. Check **"Table Editor"** → **"bookings"**
6. ✅ You should see your booking!

---

## Step 7: Enable Row Level Security (Already Done ✅)

The migrations already enabled RLS and created policies. But verify:

1. Go to **Table Editor**
2. Click on `user_profiles` table
3. Click **"..." menu** → **"View policies"**
4. ✅ You should see:
   - Users can view own profile
   - Users can update own profile
   - Users can insert own profile

Repeat for `bookings` and `payments` tables.

---

## 🎉 Setup Complete!

Your Mindful Wave website is now connected to your new Supabase project!

### What's Working:
✅ User authentication (signup/login)
✅ User profiles storage
✅ Booking system with database
✅ Payment tracking
✅ First session FREE logic
✅ Row Level Security (users can only see their own data)

### How to Access Customer Data:
1. **Supabase Dashboard** → **Table Editor**
2. Select a table: `user_profiles`, `bookings`, or `payments`
3. View, filter, search, and export data!

---

## 📞 Need Help?

### Common Issues:

**Issue 1: "Failed to fetch" error**
- Check your `.env` file has correct credentials
- Restart development server (`npm run dev`)
- Check Supabase project is active (not paused)

**Issue 2: "relation does not exist" error**
- You forgot to run migrations!
- Go back to Step 4 and run all three migrations

**Issue 3: "Invalid API key" error**
- Check you copied the correct **anon/public** key
- Make sure there are no extra spaces in `.env` file

**Issue 4: Email not sending**
- In development, check Supabase Dashboard → Authentication → Logs
- Emails might go to spam folder
- For production, configure custom SMTP in Supabase settings

---

## 🚀 Next Steps:

1. **Deploy to Production:**
   - Deploy on Vercel, Netlify, or Railway
   - Update Site URL in Supabase settings
   - Add production domain to Redirect URLs

2. **Configure Custom Domain Email:**
   - Set up SMTP for professional emails
   - Customize email templates with your branding

3. **Set Up Razorpay:**
   - Create Razorpay account
   - Add API keys to `.env`
   - Test payment flow

4. **Monitor Your Data:**
   - Check Supabase Dashboard daily for new users
   - Review bookings and payments
   - Export data for analysis

---

## 📊 Accessing Your Customer Data:

### Method 1: Table Editor (GUI)
1. Supabase Dashboard → **Table Editor**
2. Click table name to view all rows
3. Use filters and search
4. Export to CSV

### Method 2: SQL Editor (Custom Queries)
```sql
-- Get all customers
SELECT * FROM user_profiles ORDER BY created_at DESC;

-- Get all bookings with customer info
SELECT 
  up.full_name, 
  up.email, 
  b.booking_date, 
  b.session_type,
  b.payment_status
FROM bookings b
JOIN user_profiles up ON b.user_id = up.id
ORDER BY b.created_at DESC;

-- Revenue report
SELECT 
  COUNT(*) as total_bookings,
  SUM(amount_paid) as total_revenue
FROM bookings
WHERE payment_status IN ('paid', 'free');
```

---

## ✅ Checklist

Before going live, make sure:

- [ ] New Supabase project created
- [ ] Credentials updated in `.env` file
- [ ] All 3 migrations applied successfully
- [ ] Tables visible in Table Editor
- [ ] Email authentication enabled
- [ ] Test user created and verified
- [ ] Test booking completed
- [ ] Data visible in Supabase Dashboard
- [ ] Site URL configured for production
- [ ] Development server restarted

---

**Your website is ready to accept real customers! 🎉**
