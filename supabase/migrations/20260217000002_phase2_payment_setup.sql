-- Phase 2: Payment Gateway Integration
-- Create payments table for tracking Razorpay transactions

CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL, -- Amount in paise (50000 for ₹500)
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- pending, success, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_razorpay_order_id ON public.payments(razorpay_order_id);
CREATE INDEX idx_payments_status ON public.payments(status);

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Users can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON public.payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON public.payments FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update booking and user profile after successful payment
CREATE OR REPLACE FUNCTION public.handle_successful_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only execute if payment status changed to 'success'
  IF NEW.status = 'success' AND (OLD.status IS NULL OR OLD.status != 'success') THEN
    -- Update booking payment_status
    UPDATE public.bookings
    SET payment_status = 'paid',
        amount_paid = NEW.amount / 100 -- Convert paise to rupees
    WHERE id = NEW.booking_id;
    
    -- Update user profile
    UPDATE public.user_profiles
    SET total_sessions_booked = total_sessions_booked + 1,
        is_first_session_used = true
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle successful payments
CREATE TRIGGER on_payment_success
  AFTER INSERT OR UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_successful_payment();
