-- Phase 5: Admin Panel Implementation
-- Migration: Add admin role and permissions

-- 1. Add role column to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add constraint to ensure valid roles
ALTER TABLE user_profiles
ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin'));

-- 2. Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- 3. Update RLS policies for admin access

-- Admin can view all user profiles
CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    role = 'admin' OR
    auth.uid() = id
  );

-- Admin can view all bookings
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
    OR user_id = auth.uid()
  );

-- Admin can update any booking (for cancellations, rescheduling)
CREATE POLICY "Admins can update bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admin can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
    OR user_id = auth.uid()
  );

-- Admin can update payment status (for manual verification)
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- 4. Create admin analytics view
CREATE OR REPLACE VIEW admin_analytics AS
SELECT
  COUNT(DISTINCT b.user_id) as total_customers,
  COUNT(b.id) as total_bookings,
  COUNT(CASE WHEN b.payment_status = 'paid' THEN 1 END) as paid_bookings,
  COUNT(CASE WHEN b.payment_status = 'free' THEN 1 END) as free_bookings,
  COUNT(CASE WHEN b.payment_status = 'pending' THEN 1 END) as pending_bookings,
  COUNT(CASE WHEN b.payment_status = 'cancelled' THEN 1 END) as cancelled_bookings,
  COUNT(CASE WHEN b.payment_status = 'failed' THEN 1 END) as failed_bookings,
  COALESCE(SUM(CASE WHEN p.status = 'success' THEN p.amount END), 0) / 100.0 as total_revenue,
  COUNT(CASE WHEN b.booking_date >= CURRENT_DATE THEN 1 END) as upcoming_sessions,
  COUNT(CASE WHEN b.booking_date = CURRENT_DATE THEN 1 END) as todays_sessions
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id;

-- 5. Create customer details view for admin
CREATE OR REPLACE VIEW admin_customer_details AS
SELECT
  up.id,
  up.full_name,
  up.email,
  up.phone,
  up.role,
  up.created_at as registered_at,
  up.total_sessions_booked,
  up.is_first_session_used,
  COUNT(b.id) as actual_bookings,
  COUNT(CASE WHEN b.payment_status IN ('paid', 'free') THEN 1 END) as confirmed_bookings,
  COUNT(CASE WHEN b.booking_date >= CURRENT_DATE AND b.payment_status IN ('paid', 'free') THEN 1 END) as upcoming_bookings,
  COALESCE(SUM(CASE WHEN p.status = 'success' THEN p.amount END), 0) / 100.0 as total_spent,
  MAX(b.booking_date) as last_booking_date
FROM user_profiles up
LEFT JOIN bookings b ON up.id = b.user_id
LEFT JOIN payments p ON b.id = p.booking_id
GROUP BY up.id, up.full_name, up.email, up.phone, up.role, up.created_at, 
         up.total_sessions_booked, up.is_first_session_used;

-- 6. Create booking details view for admin
CREATE OR REPLACE VIEW admin_booking_details AS
SELECT
  b.id,
  b.booking_date,
  b.booking_time,
  b.session_type,
  b.payment_status,
  b.amount_paid,
  b.is_first_session,
  b.created_at,
  b.updated_at,
  up.full_name as customer_name,
  up.email as customer_email,
  up.phone as customer_phone,
  p.razorpay_payment_id,
  p.status as payment_verification_status,
  p.amount as payment_amount
FROM bookings b
INNER JOIN user_profiles up ON b.user_id = up.id
LEFT JOIN payments p ON b.id = p.booking_id
ORDER BY b.booking_date DESC, b.booking_time DESC;

-- 7. Create daily revenue report view
CREATE OR REPLACE VIEW admin_daily_revenue AS
SELECT
  b.booking_date,
  COUNT(b.id) as total_bookings,
  COUNT(CASE WHEN b.payment_status = 'paid' THEN 1 END) as paid_bookings,
  COUNT(CASE WHEN b.payment_status = 'free' THEN 1 END) as free_bookings,
  COALESCE(SUM(CASE WHEN p.status = 'success' THEN p.amount END), 0) / 100.0 as revenue
FROM bookings b
LEFT JOIN payments p ON b.id = p.booking_id AND p.status = 'success'
WHERE b.payment_status IN ('paid', 'free')
GROUP BY b.booking_date
ORDER BY b.booking_date DESC;

-- 8. Grant select permissions on views to authenticated users
-- (RLS will still apply based on admin role checks in application)
GRANT SELECT ON admin_analytics TO authenticated;
GRANT SELECT ON admin_customer_details TO authenticated;
GRANT SELECT ON admin_booking_details TO authenticated;
GRANT SELECT ON admin_daily_revenue TO authenticated;

-- 9. Create function to mark user as admin (use with caution)
CREATE OR REPLACE FUNCTION make_user_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  -- Find user by email
  SELECT * INTO user_record FROM user_profiles WHERE email = user_email;
  
  IF user_record IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update role to admin
  UPDATE user_profiles SET role = 'admin' WHERE id = user_record.id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Create function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'totalCustomers', (SELECT COUNT(DISTINCT user_id) FROM bookings),
    'totalBookings', (SELECT COUNT(*) FROM bookings),
    'totalRevenue', (SELECT COALESCE(SUM(amount), 0) / 100.0 FROM payments WHERE status = 'success'),
    'pendingPayments', (SELECT COUNT(*) FROM bookings WHERE payment_status = 'pending'),
    'todaySessions', (SELECT COUNT(*) FROM bookings WHERE booking_date = CURRENT_DATE AND payment_status IN ('paid', 'free')),
    'upcomingSessions', (SELECT COUNT(*) FROM bookings WHERE booking_date > CURRENT_DATE AND payment_status IN ('paid', 'free')),
    'freeSessionsGiven', (SELECT COUNT(*) FROM bookings WHERE payment_status = 'free'),
    'paidSessions', (SELECT COUNT(*) FROM bookings WHERE payment_status = 'paid')
  ) INTO stats;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON COLUMN user_profiles.role IS 'User role: user or admin';
COMMENT ON VIEW admin_analytics IS 'Overview statistics for admin dashboard';
COMMENT ON VIEW admin_customer_details IS 'Detailed customer information for admin';
COMMENT ON VIEW admin_booking_details IS 'Complete booking details with customer info for admin';
COMMENT ON VIEW admin_daily_revenue IS 'Daily revenue breakdown for reports';
COMMENT ON FUNCTION make_user_admin IS 'Promotes a user to admin role by email';
COMMENT ON FUNCTION get_admin_stats IS 'Returns dashboard statistics as JSON';
