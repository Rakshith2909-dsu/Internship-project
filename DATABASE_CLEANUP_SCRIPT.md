# 📝 DATABASE CLEANUP SCRIPT
**Purpose:** Remove test data before production launch  
**⚠️ IMPORTANT:** Backup your database first!

---

## 🔒 STEP 1: CREATE BACKUP

In Supabase Dashboard:
1. Go to **Settings** → **Database** → **Backups**
2. Click **"Create Backup"**
3. Wait for completion (1-2 minutes)
4. Download backup for safety

---

## 🗑️ STEP 2: RUN CLEANUP SQL

Copy and paste this entire script into **Supabase SQL Editor**:

```sql
-- ============================================================================
-- DATABASE CLEANUP SCRIPT FOR PRODUCTION
-- ============================================================================
-- Purpose: Remove all test users, bookings, and payments
-- Created: February 25, 2026
-- ⚠️ WARNING: This will delete data permanently. Backup first!
-- ============================================================================

-- Step 1: Count current records (BEFORE cleanup)
-- ----------------------------------------------------------------------------
SELECT 
    'BEFORE CLEANUP' as status,
    'user_profiles' as table_name, 
    COUNT(*) as record_count 
FROM public.user_profiles

UNION ALL

SELECT 
    'BEFORE CLEANUP',
    'bookings', 
    COUNT(*) 
FROM public.bookings

UNION ALL

SELECT 
    'BEFORE CLEANUP',
    'payments', 
    COUNT(*) 
FROM public.payments;


-- Step 2: Delete test bookings
-- ----------------------------------------------------------------------------
DELETE FROM public.bookings 
WHERE user_id IN (
    SELECT id 
    FROM public.user_profiles 
    WHERE 
        email LIKE '%test%' 
        OR email LIKE '%example%'
        OR email LIKE '%demo%'
        OR email LIKE '%fake%'
        OR email LIKE '%temp%'
);


-- Step 3: Delete test payments
-- ----------------------------------------------------------------------------
DELETE FROM public.payments 
WHERE user_id IN (
    SELECT id 
    FROM public.user_profiles 
    WHERE 
        email LIKE '%test%' 
        OR email LIKE '%example%'
        OR email LIKE '%demo%'
        OR email LIKE '%fake%'
        OR email LIKE '%temp%'
);


-- Step 4: Delete test user profiles
-- ----------------------------------------------------------------------------
DELETE FROM public.user_profiles 
WHERE 
    email LIKE '%test%' 
    OR email LIKE '%example%'
    OR email LIKE '%demo%'
    OR email LIKE '%fake%'
    OR email LIKE '%temp%';


-- Step 5: Count remaining records (AFTER cleanup)
-- ----------------------------------------------------------------------------
SELECT 
    'AFTER CLEANUP' as status,
    'user_profiles' as table_name, 
    COUNT(*) as record_count 
FROM public.user_profiles

UNION ALL

SELECT 
    'AFTER CLEANUP',
    'bookings', 
    COUNT(*) 
FROM public.bookings

UNION ALL

SELECT 
    'AFTER CLEANUP',
    'payments', 
    COUNT(*) 
FROM public.payments;


-- Step 6: List remaining users (verify cleanup)
-- ----------------------------------------------------------------------------
SELECT 
    id,
    email,
    full_name,
    is_admin,
    created_at
FROM public.user_profiles
ORDER BY created_at DESC;

-- ============================================================================
-- EXPECTED RESULT: All test accounts removed, only real users remain
-- ============================================================================
```

---

## ✅ STEP 3: VERIFY CLEANUP

After running the script, check the results:

### Expected Output:
```
BEFORE CLEANUP:
- user_profiles: 5-10 records
- bookings: 10-20 records
- payments: 5-10 records

AFTER CLEANUP:
- user_profiles: 0-1 records (only admin if kept)
- bookings: 0 records
- payments: 0 records
```

### Verify Remaining Users:
The last query shows remaining users. You should see:
- **Either:** No users (fresh start)
- **Or:** Only your admin account (if you created one)

---

## 🔄 ALTERNATIVE: KEEP SPECIFIC ACCOUNTS

If you want to keep certain test accounts (like your admin), use this modified script:

```sql
-- ============================================================================
-- SELECTIVE CLEANUP - Keep Specific Email
-- ============================================================================

-- Replace 'admin@ganoraholistichub.com' with your email to keep
-- ----------------------------------------------------------------------------

-- Delete bookings except for admin
DELETE FROM public.bookings 
WHERE user_id NOT IN (
    SELECT id FROM public.user_profiles 
    WHERE email = 'admin@ganoraholistichub.com'
);

-- Delete payments except for admin
DELETE FROM public.payments 
WHERE user_id NOT IN (
    SELECT id FROM public.user_profiles 
    WHERE email = 'admin@ganoraholistichub.com'
);

-- Delete all other users except admin
DELETE FROM public.user_profiles 
WHERE email != 'admin@ganoraholistichub.com';

-- Verify only admin remains
SELECT id, email, full_name, is_admin 
FROM public.user_profiles;
```

---

## 🧪 STEP 4: TEST AFTER CLEANUP

1. **Test Signup:**
   - Go to your website
   - Create a new account
   - Verify it appears in database:
     ```sql
     SELECT * FROM public.user_profiles ORDER BY created_at DESC LIMIT 1;
     ```

2. **Test Booking:**
   - Log in with new account
   - Book a session
   - Verify booking appears:
     ```sql
     SELECT * FROM public.bookings ORDER BY created_at DESC LIMIT 1;
     ```

3. **Test Admin (if created):**
   - Log in with admin account
   - Visit `/admin/dashboard`
   - Verify you can see all data

---

## 🆘 ROLLBACK (If Something Goes Wrong)

If cleanup deletes too much or causes issues:

1. **Restore from Backup:**
   - Supabase Dashboard → Settings → Database → Backups
   - Find your backup (created in Step 1)
   - Click "Restore"
   - Wait 2-5 minutes for restoration

2. **Re-run Cleanup (More Carefully):**
   - Use the selective cleanup script
   - Test with one table at a time
   - Verify results before moving to next table

---

## 📊 PRODUCTION READINESS CHECKLIST

After cleanup, verify:
- [ ] All test data removed
- [ ] Admin account exists (or will create after launch)
- [ ] Database responding normally
- [ ] Website signup/login working
- [ ] Booking flow functional
- [ ] No errors in Supabase logs

---

## 🎯 NEXT STEPS

1. ✅ Run cleanup script (this document)
2. ⏳ Switch Razorpay to LIVE mode
3. ⏳ Create admin account (if not done)
4. ⏳ Deploy to production
5. ⏳ Final testing
6. 🚀 **LAUNCH!**

---

**Need Help?**
- Check [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md) for full deployment instructions
- Check [PRODUCTION_READINESS_AUDIT.md](./PRODUCTION_READINESS_AUDIT.md) for complete review

**Prepared By:** GitHub Copilot AI Assistant  
**Date:** February 25, 2026
