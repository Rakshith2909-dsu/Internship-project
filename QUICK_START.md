# Mindful Wave - Quick Start Guide 🚀

## Complete Backend Setup (5 Minutes)

This guide will help you connect your Mindful Wave application to Supabase and get it running locally.

---

## Step 1: Create Supabase Project (2 minutes)

### 1.1 Sign Up & Create Project
1. Go to **https://supabase.com**
2. Click **"Start your project"** and sign up
3. Click **"New Project"**
4. Fill in:
   - **Name:** `mindful-wave-dev`
   - **Database Password:** (Create a strong password and **SAVE IT!**)
   - **Region:** Choose closest to you (e.g., Mumbai: `ap-south-1`)
   - **Plan:** Free
5. Click **"Create new project"**
6. ⏳ Wait 2-3 minutes for initialization

### 1.2 Get Your Credentials
1. In your Supabase dashboard, click **"Settings"** (gear icon)
2. Click **"API"**
3. Copy these two values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (long token starting with `eyJ...`)

---

## Step 2: Configure Environment Variables (1 minute)

1. Open `.env` file in your project root
2. Replace the placeholders with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
```

**Example:**
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 3: Run Database Migrations (2 minutes)

### 3.1 Open Supabase SQL Editor
1. In your Supabase dashboard, click **"SQL Editor"** from the left sidebar
2. Click **"New query"**

### 3.2 Run Migrations in Order
Copy and paste each migration file content into the SQL Editor and click **"Run"**:

**Run these migrations in this exact order:**

1. **Phase 1: Authentication**
   - File: `supabase/migrations/20260217000001_phase1_auth_setup.sql`
   - Creates user profiles, authentication system

2. **Phase 2: Payments**
   - File: `supabase/migrations/20260217000002_phase2_payment_setup.sql`
   - Creates payment tables, Razorpay integration

3. **Phase 3: Booking Restrictions**
   - File: `supabase/migrations/20260217000003_phase3_booking_restrictions.sql`
   - Adds booking constraints, triggers, views

4. **Phase 5: Admin Role**
   - File: `supabase/migrations/20260218000001_phase5_admin_role.sql`
   - Creates admin system, analytics views

5. **Phase 6: Notifications**
   - File: `supabase/migrations/20260218000002_phase6_notifications.sql`
   - Creates notification system, email preferences

✅ After each migration, you should see "Success. No rows returned"

---

## Step 4: Start Development Server (30 seconds)

```bash
npm run dev
```

Open browser to: **http://localhost:8080**

---

## Step 5: Create Your First User & Admin (1 minute)

### 5.1 Sign Up
1. Go to http://localhost:8080
2. Click **"Login"** → **"Sign up"**
3. Create an account with your email

### 5.2 Make Yourself Admin
1. Go back to Supabase SQL Editor
2. Run this query (replace with your email):

```sql
SELECT make_user_admin('your-email@example.com');
```

3. Refresh your website
4. You should now see **"Admin Panel"** in your profile dropdown!

---

## 🎉 You're All Set!

### What You Can Do Now:

✅ **User Features:**
- Sign up / Login
- Book sessions (first one FREE!)
- View booking history
- Manage profile
- Set email preferences

✅ **Admin Features:**
- View analytics dashboard
- Manage all customers
- View all bookings
- Track payments
- Cancel bookings

---

## Testing the System

### Test User Flow:
1. **Sign up** with a new email
2. **Book a session** - should be FREE (₹0)
3. Check **Dashboard** - see your booking
4. **Book another session** - should ask for payment (₹500)
5. Check **Profile** - manage email preferences

### Test Admin Flow:
1. Access **Admin Panel** from profile dropdown
2. View **Analytics** - see your stats
3. Check **Customers** - see yourself listed
4. View **Bookings** - your booking should be there
5. Test **Cancel Booking** functionality

---

## Common Issues & Fixes

### Issue: "Connection refused" or "Invalid API key"
**Fix:** Double-check your `.env` file has correct Supabase URL and key (no extra spaces!)

### Issue: "Column does not exist" errors
**Fix:** Make sure you ran ALL migrations in the correct order

### Issue: "Admin Panel" doesn't appear
**Fix:** Run the admin query again in Supabase SQL Editor:
```sql
SELECT make_user_admin('your-email@example.com');
```
Then logout and login again.

### Issue: Can't sign up / login
**Fix:** 
1. Check Supabase dashboard → Authentication → Users
2. Make sure email confirmations are disabled for development:
   - Go to Authentication → Settings
   - Turn OFF "Enable email confirmations"

---

## Next Steps: Production Deployment

When ready to deploy:

1. **Create Production Supabase Project**
2. **Run migrations in production database**
3. **Update `.env` with production credentials**
4. **Build:** `npm run build`
5. **Deploy to:**
   - Vercel (recommended): `vercel --prod`
   - Netlify: `netlify deploy --prod`
   - Or your own server

See [PHASE6_7_COMPLETE.md](PHASE6_7_COMPLETE.md) for detailed deployment guide.

---

## Payment Gateway Setup (Razorpay)

Currently configured for test mode. To accept real payments:

1. Create account at **https://razorpay.com**
2. Get your **Live** API keys
3. Add to `.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_live_your_key
```

**Test Cards for Development:**
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

## Email Notifications Setup (Optional)

To actually send emails, set up **Resend** or **SendGrid**:

### Using Resend (Recommended):
1. Sign up at **https://resend.com**
2. Get API key
3. Install: `npm install resend`
4. Update `src/lib/notificationService.ts` with Resend integration
5. Add to `.env`: `VITE_EMAIL_SERVICE_API_KEY=your_key`

---

## File Structure Reference

```
mindful-wave/
├── .env                           ← Your Supabase credentials here
├── src/
│   ├── components/
│   │   ├── Auth/                  ← Login, Signup, Protected routes
│   │   ├── Admin/                 ← Admin panel components
│   │   └── Dashboard/             ← User dashboard
│   ├── pages/
│   │   ├── Dashboard.tsx          ← User dashboard page
│   │   ├── Profile.tsx            ← User profile page
│   │   └── AdminDashboard.tsx     ← Admin panel page
│   └── lib/
│       ├── notificationService.ts ← Notification system
│       └── emailTemplates.ts      ← Email HTML templates
└── supabase/
    └── migrations/                ← Database migrations (run these!)
```

---

## Need Help?

**Documentation:**
- [BACKEND_IMPLEMENTATION_PLAN.md](BACKEND_IMPLEMENTATION_PLAN.md) - Full backend plan
- [SUPABASE_SETUP_GUIDE.md](SUPABASE_SETUP_GUIDE.md) - Detailed Supabase setup
- [PHASE6_7_COMPLETE.md](PHASE6_7_COMPLETE.md) - Testing & deployment

**Check:**
- Supabase Dashboard → Logs (see database errors)
- Browser Console (F12) → See frontend errors
- Network tab → Check API calls

---

**Happy Building! 🚀**

*Your complete wellness booking platform is ready to go!*
