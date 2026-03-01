import { supabase } from '@/integrations/supabase/client';

/**
 * Check if this is the user's first session
 * Returns true if user has never booked before or never completed a paid/free session
 */
export const checkIsFirstSession = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .in('payment_status', ['paid', 'free']);

    if (error) throw error;
    
    // If no bookings found, this is first session
    return !data || data.length === 0;
  } catch (error) {
    console.error('Error checking first session:', error);
    return false;
  }
};

/**
 * Get the price for the session based on whether it's first session or not
 * First session: ₹0 (FREE)
 * Subsequent sessions: ₹500
 */
export const getSessionPrice = (isFirstSession: boolean, sessionType: string): number => {
  return isFirstSession ? 0 : 500;
};

/**
 * Check if user profile indicates first session is used
 */
export const checkFirstSessionUsed = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_first_session_used')
      .eq('id', userId)
      .single();

    if (error) throw error;
    
    return data?.is_first_session_used || false;
  } catch (error) {
    console.error('Error checking first session used:', error);
    return false;
  }
};

/**
 * Create a booking record
 */
export interface BookingData {
  user_id: string;
  name: string;
  email: string;
  phone: string;
  booking_date: string;
  booking_time: string;
  session_type: string;
  amount_paid: number;
  payment_status: 'pending' | 'paid' | 'free' | 'failed';
}

export const createBooking = async (bookingData: BookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

/**
 * Update booking payment status
 */
export const updateBookingPaymentStatus = async (
  bookingId: string,
  status: 'pending' | 'paid' | 'free' | 'failed',
  amountPaid?: number
) => {
  try {
    const updateData: any = { payment_status: status };
    if (amountPaid !== undefined) {
      updateData.amount_paid = amountPaid;
    }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select()
      .single();

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating booking payment status:', error);
    throw error;
  }
};

/**
 * Get user's booking history
 */
export const getUserBookings = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('booking_date', { ascending: false });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};
