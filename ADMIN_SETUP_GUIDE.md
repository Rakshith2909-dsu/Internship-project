# Admin Setup Guide

## Setting Up Your First Admin Account

### Step 1: Create a User Account
1. Go to your website and sign up normally at `/signup`
2. Use the email address you want to be the admin (e.g., admin@ganoraholistichub.com)
3. Complete the registration process

### Step 2: Promote User to Admin

You have two options:

#### Option A: Using Supabase Dashboard (Recommended)

1. Log in to your Supabase Dashboard (https://supabase.com/dashboard)
2. Go to your project → SQL Editor
3. Run this SQL command:

```sql
SELECT make_user_admin('your-admin@email.com');
```

Replace `your-admin@email.com` with the actual email address.

#### Option B: Using Local Supabase CLI

If you're running Supabase locally:

```bash
# Connect to your local database
psql postgresql://postgres:postgres@localhost:54322/postgres

# Run the command
SELECT make_user_admin('your-admin@email.com');
```

### Step 3: Verify Admin Access

1. Log out if currently logged in
2. Log in with your admin credentials
3. Navigate to `/admin/dashboard`
4. You should now see the full admin panel

---

## Admin Panel Features

### 📊 Analytics Tab
- Total customers count
- Total bookings
- Revenue tracking
- Today's sessions
- Upcoming sessions
- Payment status breakdown

### 👥 Customers Tab
Shows for each customer:
- Full name, email, phone
- Registration date
- Total sessions booked
- Confirmed bookings
- Upcoming bookings
- Total amount spent
- Last booking date
- First session usage status

### 📅 Bookings Tab
Shows for each booking:
- Customer details
- Booking date and time
- Session type
- Payment status
- Amount paid
- First session indicator
- Razorpay payment ID
- Actions: Cancel booking

### 💰 Payments Tab
- All payment transactions
- Razorpay order and payment IDs
- Payment status (success/pending/failed)
- Amount and currency
- Daily revenue reports
- Payment verification status

---

## Admin Access Control

### Security Features:
- ✅ Role-based access control (RBAC)
- ✅ RLS (Row Level Security) policies
- ✅ Protected routes in frontend
- ✅ Admin verification on every request
- ✅ Secure database views

### Admin Permissions:
- View all customers and their details
- View all bookings across all users
- View all payment transactions
- Cancel/update bookings
- Update payment verification status
- Access analytics and reports

---

## Managing Multiple Admins

To add more admin users, simply run the `make_user_admin()` function with their email:

```sql
SELECT make_user_admin('second-admin@email.com');
SELECT make_user_admin('third-admin@email.com');
```

---

## Troubleshooting

### "Access Denied" Error
- Verify the user's role in the database:
  ```sql
  SELECT id, email, role FROM user_profiles WHERE email = 'your@email.com';
  ```
- Ensure the role is set to 'admin'

### Can't See Admin Dashboard Link
- The admin dashboard is accessible at `/admin/dashboard`
- Bookmark this URL or add a button to your dashboard for easy access

### Empty Data in Admin Panel
- Ensure you have created some test bookings
- Check that the database views are created properly
- Verify RLS policies allow admin access

---

## Database Queries for Reference

### Check All Admins
```sql
SELECT id, email, full_name, role, created_at 
FROM user_profiles 
WHERE role = 'admin';
```

### Remove Admin Role
```sql
UPDATE user_profiles 
SET role = 'user' 
WHERE email = 'user@email.com';
```

### View All Customer Details (Admin View)
```sql
SELECT * FROM admin_customer_details;
```

### View All Booking Details (Admin View)
```sql
SELECT * FROM admin_booking_details;
```

### Get Dashboard Statistics
```sql
SELECT get_admin_stats();
```

---

## Best Practices

1. **Limit Admin Accounts**: Only create admin accounts for trusted personnel
2. **Use Strong Passwords**: Admin accounts should have strong, unique passwords
3. **Regular Audits**: Periodically review admin access logs
4. **Backup Data**: Regularly backup customer and payment data
5. **Test Changes**: Test any booking/payment modifications in a staging environment first

---

## Support

For issues or questions:
- Check the Supabase logs for errors
- Review browser console for frontend errors
- Verify database migrations are applied
- Ensure environment variables are set correctly

---

**Last Updated**: February 22, 2026
