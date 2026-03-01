-- ============================================================================
-- Add notes column to bookings table for Pranic Healing questions
-- ============================================================================
-- Description: Add a notes/metadata field to store additional booking information
-- Created: 2026-02-25
-- ============================================================================

-- Add notes column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Add comment
COMMENT ON COLUMN public.bookings.notes IS 'Additional notes or metadata for the booking (e.g., Pranic Healing questionnaire responses)';
