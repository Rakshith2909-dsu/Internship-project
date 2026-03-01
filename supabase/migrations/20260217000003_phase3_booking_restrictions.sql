-- ============================================================================
-- PHASE 3: Booking Logic & Restrictions
-- ============================================================================
-- Description: Add booking restrictions, unique constraints, and automated triggers
-- Created: 2026-02-17
-- ============================================================================

-- 1. Add unique constraint to prevent duplicate bookings on same slot
-- ============================================================================
-- This ensures a user cannot book the same date/time slot multiple times
CREATE UNIQUE INDEX IF NOT EXISTS unique_booking_slot 
ON bookings(booking_date, booking_time, user_id)
WHERE payment_status NOT IN ('cancelled', 'failed');

-- 2. Add index for better query performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings(user_id, booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings(booking_date, booking_time);

-- 3. Add function to update user profile after successful booking
-- ============================================================================
CREATE OR REPLACE FUNCTION update_user_session_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if booking is confirmed (paid or free)
  IF NEW.payment_status IN ('paid', 'free') AND 
     (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.payment_status NOT IN ('paid', 'free'))) THEN
    
    UPDATE user_profiles
    SET 
      total_sessions_booked = total_sessions_booked + 1,
      is_first_session_used = TRUE,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger for booking confirmation
-- ============================================================================
DROP TRIGGER IF EXISTS after_booking_confirmed ON bookings;
CREATE TRIGGER after_booking_confirmed
  AFTER INSERT OR UPDATE OF payment_status ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_session_count();

-- 5. Add constraints for data validation
-- ============================================================================
-- Ensure booking date is not in the past
ALTER TABLE bookings
ADD CONSTRAINT booking_date_not_past 
CHECK (booking_date >= CURRENT_DATE);

-- Ensure valid payment status
ALTER TABLE bookings
ADD CONSTRAINT valid_payment_status
CHECK (payment_status IN ('pending', 'paid', 'free', 'failed', 'cancelled'));

-- Ensure amount_paid is non-negative
ALTER TABLE bookings
ADD CONSTRAINT non_negative_amount
CHECK (amount_paid >= 0);

-- 6. Add function to cancel old pending bookings (cleanup)
-- ============================================================================
CREATE OR REPLACE FUNCTION cancel_expired_bookings()
RETURNS void AS $$
BEGIN
  UPDATE bookings
  SET payment_status = 'cancelled'
  WHERE payment_status = 'pending'
    AND created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create view for active bookings (convenience)
-- ============================================================================
CREATE OR REPLACE VIEW active_bookings AS
SELECT 
  b.*,
  up.full_name,
  up.email,
  up.phone,
  p.razorpay_payment_id,
  p.amount as payment_amount,
  p.status as payment_record_status
FROM bookings b
JOIN user_profiles up ON b.user_id = up.id
LEFT JOIN payments p ON p.booking_id = b.id
WHERE b.payment_status NOT IN ('cancelled', 'failed')
ORDER BY b.booking_date DESC, b.booking_time DESC;

-- 8. Grant permissions for the view
-- ============================================================================
GRANT SELECT ON active_bookings TO authenticated;

-- 9. Add RLS policy for active_bookings view
-- ============================================================================
-- Users can only see their own active bookings
CREATE POLICY "Users can view own active bookings"
  ON bookings FOR SELECT
  USING (
    user_id = auth.uid()
    AND payment_status NOT IN ('cancelled', 'failed')
  );

-- 10. Add comments for documentation
-- ============================================================================
COMMENT ON INDEX unique_booking_slot IS 'Prevents duplicate bookings for same user on same date/time';
COMMENT ON FUNCTION update_user_session_count() IS 'Automatically updates user profile when booking is confirmed';
COMMENT ON FUNCTION cancel_expired_bookings() IS 'Cancels pending bookings older than 24 hours';
COMMENT ON VIEW active_bookings IS 'Shows all confirmed bookings with user and payment details';

-- ============================================================================
-- End of Phase 3 Migration
-- ============================================================================
