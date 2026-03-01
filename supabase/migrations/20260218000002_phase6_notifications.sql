-- Phase 6: Email & SMS Notifications Setup
-- Migration: Email preferences and notification tracking

-- 1. Create email preferences table
CREATE TABLE IF NOT EXISTS public.email_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_confirmations BOOLEAN DEFAULT TRUE,
  payment_receipts BOOLEAN DEFAULT TRUE,
  session_reminders BOOLEAN DEFAULT TRUE,
  marketing_emails BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Create notification log table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'booking_confirmation', 'payment_receipt', 'session_reminder', 'cancellation'
  channel TEXT NOT NULL, -- 'email', 'sms', 'both'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed', 'bounced'
  recipient_email TEXT,
  recipient_phone TEXT,
  subject TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_email_preferences_user ON email_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_user ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_booking ON notification_logs(booking_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(notification_type);

-- 4. Enable RLS
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for email_preferences
CREATE POLICY "Users can view own email preferences"
  ON email_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own email preferences"
  ON email_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own email preferences"
  ON email_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all preferences
CREATE POLICY "Admins can view all email preferences"
  ON email_preferences FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- 6. RLS Policies for notification_logs
CREATE POLICY "Users can view own notifications"
  ON notification_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
  ON notification_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Admins can insert notifications (for manual sending)
CREATE POLICY "Admins can insert notifications"
  ON notification_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- 7. Function to create default email preferences on user signup
CREATE OR REPLACE FUNCTION create_default_email_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO email_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger to create email preferences on user profile creation
CREATE TRIGGER after_user_profile_created
  AFTER INSERT ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_email_preferences();

-- 9. Function to log notification
CREATE OR REPLACE FUNCTION log_notification(
  p_user_id UUID,
  p_booking_id UUID,
  p_type TEXT,
  p_channel TEXT,
  p_recipient_email TEXT DEFAULT NULL,
  p_recipient_phone TEXT DEFAULT NULL,
  p_subject TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notification_logs (
    user_id,
    booking_id,
    notification_type,
    channel,
    recipient_email,
    recipient_phone,
    subject,
    status
  ) VALUES (
    p_user_id,
    p_booking_id,
    p_type,
    p_channel,
    p_recipient_email,
    p_recipient_phone,
    p_subject,
    'pending'
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Function to mark notification as sent
CREATE OR REPLACE FUNCTION mark_notification_sent(
  p_notification_id UUID,
  p_status TEXT DEFAULT 'sent',
  p_error_message TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE notification_logs
  SET 
    status = p_status,
    sent_at = CASE WHEN p_status = 'sent' THEN NOW() ELSE sent_at END,
    error_message = p_error_message,
    updated_at = NOW()
  WHERE id = p_notification_id;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 11. View for notification statistics
CREATE OR REPLACE VIEW notification_stats AS
SELECT
  notification_type,
  channel,
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN sent_at IS NOT NULL THEN 1 END) as sent_count,
  COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count
FROM notification_logs
GROUP BY notification_type, channel, status;

-- 12. Function to get pending session reminders (for scheduled job)
CREATE OR REPLACE FUNCTION get_pending_session_reminders()
RETURNS TABLE (
  booking_id UUID,
  user_id UUID,
  user_email TEXT,
  user_phone TEXT,
  booking_date DATE,
  booking_time TEXT,
  session_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.id as booking_id,
    b.user_id,
    up.email as user_email,
    up.phone as user_phone,
    b.booking_date,
    b.booking_time,
    b.session_type
  FROM bookings b
  INNER JOIN user_profiles up ON b.user_id = up.id
  INNER JOIN email_preferences ep ON up.id = ep.user_id
  WHERE b.booking_date = CURRENT_DATE + INTERVAL '1 day'
    AND b.payment_status IN ('paid', 'free')
    AND ep.session_reminders = TRUE
    AND NOT EXISTS (
      SELECT 1 FROM notification_logs nl
      WHERE nl.booking_id = b.id
        AND nl.notification_type = 'session_reminder'
        AND nl.status = 'sent'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT SELECT ON notification_stats TO authenticated;

-- Comments
COMMENT ON TABLE email_preferences IS 'User email notification preferences';
COMMENT ON TABLE notification_logs IS 'Log of all notifications sent to users';
COMMENT ON FUNCTION log_notification IS 'Creates a new notification log entry';
COMMENT ON FUNCTION mark_notification_sent IS 'Updates notification status after sending';
COMMENT ON FUNCTION get_pending_session_reminders IS 'Gets bookings that need reminder emails (24 hours before)';
