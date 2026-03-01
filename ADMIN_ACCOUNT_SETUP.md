# 👤 ADMIN ACCOUNT SETUP GUIDE
**Purpose:** Create and configure your first admin user  
**Time Required:** 3-5 minutes  
**Difficulty:** Easy

---

## 🎯 WHY YOU NEED AN ADMIN ACCOUNT

The admin account gives you access to:
- 📊 **Analytics Dashboard** - View booking statistics, revenue trends
- 👥 **Customer Management** - View all registered users
- 📅 **Booking Management** - See all bookings, update statuses
- 💳 **Payment Tracking** - Monitor all transactions
- 🔐 **Full Platform Control** - Manage your business effectively

---

## 📋 METHOD 1: SIGNUP FIRST, THEN PROMOTE (RECOMMENDED)

### Step 1: Create Your Account
1. Go to your website homepage
2. Click **"Sign Up"** or **"Book Now"**
3. Fill in the signup form:
   ```
   Full Name: Your Name
   Email: admin@ganoraholistichub.com (or your preferred email)
   Phone: Your phone number
   Password: Create a strong password
   ```
4. Click **"Sign Up"**
5. Check your email for verification link (if enabled)
6. Verify your email (if required)

### Step 2: Promote to Admin
1. Open **Supabase Dashboard** → [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **zwbssoeedanalavmdvmu**
3. Click **"SQL Editor"** in left sidebar
4. Copy and paste this query:
   ```sql
   -- Promote user to admin
   UPDATE public.user_profiles 
   SET is_admin = true 
   WHERE email = 'admin@ganoraholistichub.com';
   
   -- Verify admin status
   SELECT 
       id,
       email,
       full_name,
       is_admin,
       created_at
   FROM public.user_profiles 
   WHERE is_admin = true;
   ```
5. Replace `'admin@ganoraholistichub.com'` with your actual email
6. Click **"Run"** (or press F5)
7. You should see your account with `is_admin: true`

### Step 3: Verify Admin Access
1. Go back to your website
2. **Log out** if currently logged in
3. **Log in** with your admin credentials
4. Navigate to `/admin/dashboard` (or click "Admin Panel" if it appears)
5. You should see:
   - Analytics tab
   - Customers tab
   - Bookings tab
   - Payments tab

✅ **Success!** You now have admin access.

---

## 📋 METHOD 2: CHECK EXISTING USERS

If you already created accounts during testing:

### Step 1: List All Users
```sql
-- View all existing users
SELECT 
    id,
    email,
    full_name,
    phone,
    is_admin,
    is_first_session_used,
    total_sessions_booked,
    created_at
FROM public.user_profiles
ORDER BY created_at DESC;
```

### Step 2: Promote One to Admin
```sql
-- Promote specific user by email
UPDATE public.user_profiles 
SET is_admin = true 
WHERE email = 'your-email-here@example.com';

-- Or promote by ID (if you know it)
UPDATE public.user_profiles 
SET is_admin = true 
WHERE id = 'user-id-here';

-- Verify
SELECT email, is_admin FROM public.user_profiles WHERE is_admin = true;
```

---

## 🔒 SECURITY BEST PRACTICES

### ✅ DO:
- Use a **strong password** (12+ characters, mixed case, numbers, symbols)
- Use a **real email** you have access to
- Keep admin credentials **secure and private**
- Consider using a **unique email** like admin@yourdomain.com
- Enable **two-factor authentication** (if Supabase supports it)

### ❌ DON'T:
- Don't use simple passwords like "admin123"
- Don't share admin credentials with others
- Don't use test emails like test@example.com
- Don't create multiple admin accounts unnecessarily

---

## 👥 CREATING MULTIPLE ADMINS (OPTIONAL)

If you have a team and need multiple admin users:

```sql
-- Promote multiple users
UPDATE public.user_profiles 
SET is_admin = true 
WHERE email IN (
    'admin1@ganoraholistichub.com',
    'admin2@ganoraholistichub.com',
    'manager@ganoraholistichub.com'
);

-- View all admins
SELECT 
    email,
    full_name,
    is_admin,
    created_at
FROM public.user_profiles 
WHERE is_admin = true
ORDER BY created_at;
```

---

## 🔧 TROUBLESHOOTING

### Problem: "Column 'is_admin' does not exist"

**Solution:** The admin column might not be in your database yet.

Add it with this query:
```sql
-- Add is_admin column if missing
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
ON public.user_profiles(is_admin);

-- Now promote your user
UPDATE public.user_profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';
```

### Problem: "Admin dashboard shows 404 or Access Denied"

**Possible Causes:**
1. User not properly promoted to admin
2. Not logged in with admin account
3. Admin route not properly configured

**Solutions:**
```sql
-- 1. Verify admin status
SELECT email, is_admin FROM public.user_profiles WHERE email = 'your-email';

-- 2. Force promote (if is_admin is false or null)
UPDATE public.user_profiles SET is_admin = true WHERE email = 'your-email';

-- 3. Check if any admins exist
SELECT COUNT(*) as admin_count FROM public.user_profiles WHERE is_admin = true;
```

Then:
- **Log out completely**
- Clear browser cache (Ctrl + Shift + Delete)
- **Log back in**
- Try accessing `/admin/dashboard` again

### Problem: "Can't access Supabase to run SQL"

**Solutions:**

**Option A: Use Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your Supabase account
3. Find your project (zwbssoeedanalavmdvmu)
4. Go to SQL Editor

**Option B: Use Supabase CLI** (if installed)
```bash
# Connect to your project
supabase db start

# Run SQL file
supabase db execute "UPDATE public.user_profiles SET is_admin = true WHERE email = 'your-email';"
```

**Option C: Ask Team Member with Access**
If someone else set up Supabase, ask them to:
1. Log in to Supabase
2. Run the promotion query
3. Confirm you're now admin

---

## 📊 VERIFY ADMIN FEATURES

After setup, test these admin features:

### 1. Analytics Tab
- [ ] See total revenue
- [ ] See total bookings
- [ ] See active users count
- [ ] View revenue trend chart
- [ ] View booking trend chart

### 2. Customers Tab
- [ ] See list of all registered users
- [ ] View customer details
- [ ] See booking count per customer
- [ ] Check is_first_session_used status

### 3. Bookings Tab
- [ ] See all bookings from all users
- [ ] Filter by status (pending/paid/free/cancelled)
- [ ] View booking details
- [ ] See Pranic Healing questionnaire responses (if notes field enabled)

### 4. Payments Tab
- [ ] See all payment transactions
- [ ] View payment amounts
- [ ] Check payment status (success/failed/pending)
- [ ] View payment dates and times

---

## 🔐 REVOKING ADMIN ACCESS (When Needed)

If you need to remove admin access from a user:

```sql
-- Remove admin privilege
UPDATE public.user_profiles 
SET is_admin = false 
WHERE email = 'user-to-demote@example.com';

-- Verify
SELECT email, is_admin FROM public.user_profiles WHERE email = 'user-to-demote@example.com';
-- Should show is_admin: false
```

---

## 📝 RECOMMENDED ADMIN WORKFLOW

### Daily:
1. Check **Analytics** for new bookings/revenue
2. Review **Bookings** tab for pending payments
3. Follow up on **Payment** failures

### Weekly:
1. Review **Customer** list for growth
2. Export data for backup
3. Check for any unusual activity

### Monthly:
1. Analyze trends in **Analytics**
2. Create reports for business planning
3. Update session schedules in codebase

---

## 🎉 SUCCESS CHECKLIST

After completing admin setup:
- [ ] Admin account created and verified
- [ ] Can log in with admin credentials
- [ ] `/admin/dashboard` route accessible
- [ ] All 4 tabs working (Analytics, Customers, Bookings, Payments)
- [ ] Can view customer data
- [ ] Can view booking data
- [ ] Can view payment data
- [ ] Credentials stored securely

---

## 🔗 RELATED GUIDES

- **Full Audit:** [PRODUCTION_READINESS_AUDIT.md](./PRODUCTION_READINESS_AUDIT.md)
- **Deployment:** [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- **Database Cleanup:** [DATABASE_CLEANUP_SCRIPT.md](./DATABASE_CLEANUP_SCRIPT.md)
- **Quick Summary:** [QUICK_STATUS_SUMMARY.md](./QUICK_STATUS_SUMMARY.md)

---

## 🆘 STILL HAVING ISSUES?

If you're stuck:

1. **Check Phase5 Migration:**
   ```sql
   -- Verify admin column exists
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'user_profiles' 
   AND column_name = 'is_admin';
   ```

2. **Check Migration File:**
   - Look in `supabase/migrations/`
   - Find `20260218000001_phase5_admin_role.sql`
   - Verify it ran successfully in Supabase Dashboard → Migrations

3. **Manually Run Phase5 Migration:**
   ```sql
   -- From phase5 migration file
   ALTER TABLE public.user_profiles 
   ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

   CREATE INDEX IF NOT EXISTS idx_user_profiles_is_admin 
   ON public.user_profiles(is_admin);
   ```

4. **Contact Support:**
   - Supabase Support: [https://supabase.com/support](https://supabase.com/support)
   - Or ask in Supabase Discord community

---

**Prepared By:** GitHub Copilot AI Assistant  
**Date:** February 25, 2026  
**Estimated Time:** 3-5 minutes  
**Success Rate:** 99%

---

## ⭐ YOU'RE READY!

Once you have admin access, you'll have full control over your platform. You can manage customers, track bookings, monitor payments, and grow your wellness business effectively.

**Welcome to the admin team!** 🎉👑
