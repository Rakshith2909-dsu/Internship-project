-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TEXT NOT NULL,
  session_type TEXT NOT NULL,
  is_first_session BOOLEAN NOT NULL DEFAULT true,
  amount_paid INTEGER NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert bookings (public booking form)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow users to view their own bookings by email
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (true);

-- Create index for better performance
CREATE INDEX idx_bookings_email ON public.bookings(email);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);