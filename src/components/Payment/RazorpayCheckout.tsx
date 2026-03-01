import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/Auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RazorpayCheckoutProps {
  amount: number; // Amount in rupees
  bookingId: string;
  bookingData: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess?: () => void;
  onFailure?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const useRazorpayCheckout = (props: RazorpayCheckoutProps) => {
  const { amount, bookingId, bookingData, onSuccess, onFailure } = props;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const createPaymentRecord = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          booking_id: bookingId,
          user_id: user?.id,
          razorpay_order_id: orderId,
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating payment record:', error);
      throw error;
    }
  };

  const updatePaymentRecord = async (
    paymentId: string,
    razorpayPaymentId: string,
    razorpaySignature: string,
    status: 'success' | 'failed'
  ) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_signature: razorpaySignature,
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating payment record:', error);
      throw error;
    }
  };

  const initiatePayment = async () => {
    try {
      if (!window.Razorpay) {
        toast({
          title: 'Error',
          description: 'Payment gateway not loaded. Please refresh and try again.',
          variant: 'destructive',
        });
        return;
      }

      // Check if Razorpay key is configured
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey === 'YOUR_RAZORPAY_KEY_ID') {
        toast({
          title: 'Payment Gateway Not Configured',
          description: 'Please configure Razorpay keys in .env file. Check RAZORPAY_SETUP.md for instructions.',
          variant: 'destructive',
        });
        return;
      }

      // Generate order ID - In production, this should be created via Razorpay API
      const orderId = `order_${Date.now()}_${bookingId.slice(0, 8)}`;

      // Create payment record in database
      const paymentRecord = await createPaymentRecord(orderId);

      const options = {
        key: razorpayKey,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'Ganora Holistic Hub',
        description: 'Pranic Healing Session Booking',
        order_id: orderId,
        prefill: {
          name: bookingData.name,
          email: bookingData.email,
          contact: bookingData.phone,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay using UPI',
                instruments: [
                  {
                    method: 'upi',
                  },
                ],
              },
              card: {
                name: 'Credit/Debit Card',
                instruments: [
                  {
                    method: 'card',
                  },
                ],
              },
              other: {
                name: 'Other Payment Methods',
                instruments: [
                  {
                    method: 'netbanking',
                  },
                  {
                    method: 'wallet',
                  },
                ],
              },
            },
            sequence: ['block.upi', 'block.card', 'block.other'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        theme: {
          color: '#8B5CF6',
        },
        handler: async function (response: any) {
          try {
            // Update payment record with success
            await updatePaymentRecord(
              paymentRecord.id,
              response.razorpay_payment_id,
              response.razorpay_signature,
              'success'
            );

            // Update booking status
            await supabase
              .from('bookings')
              .update({ 
                payment_status: 'paid',
                updated_at: new Date().toISOString()
              })
              .eq('id', bookingId);

            toast({
              title: 'Payment Successful!',
              description: 'Your booking has been confirmed.',
            });

            if (onSuccess) {
              onSuccess();
            } else {
              navigate('/payment-success', {
                state: {
                  paymentId: response.razorpay_payment_id,
                  bookingId: bookingId,
                },
              });
            }
          } catch (error) {
            console.error('Error handling payment success:', error);
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support with your payment ID: ' + response.razorpay_payment_id,
              variant: 'destructive',
            });
          }
        },
        modal: {
          ondismiss: async function () {
            try {
              // Update payment record with failed status
              await updatePaymentRecord(paymentRecord.id, '', '', 'failed');
              
              // Update booking status to failed
              await supabase
                .from('bookings')
                .update({ 
                  payment_status: 'failed',
                  updated_at: new Date().toISOString()
                })
                .eq('id', bookingId);
            } catch (error) {
              console.error('Error updating failed payment:', error);
            }
            
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
              variant: 'destructive',
            });

            if (onFailure) {
              onFailure();
            } else {
              navigate('/payment-failed', {
                state: { bookingId: bookingId },
              });
            }
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast({
        title: 'Payment Failed',
        description: 'Unable to initiate payment. Please try again.',
        variant: 'destructive',
      });
      if (onFailure) {
        onFailure();
      }
    }
  };

  return { initiatePayment };
};

// Standalone function that can be called without the hook
export const initiateRazorpayPayment = async (
  amount: number,
  bookingId: string,
  name: string,
  email: string,
  phone: string,
  onSuccess?: () => void,
  onFailure?: () => void
) => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (!window.Razorpay) {
      // Load Razorpay script if not loaded
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      await new Promise((resolve) => {
        script.onload = resolve;
        document.body.appendChild(script);
      });
    }

    // Check if Razorpay key is configured
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey === 'YOUR_RAZORPAY_KEY_ID') {
      throw new Error('Razorpay not configured');
    }

    // Generate order ID
    const orderId = `order_${Date.now()}_${bookingId.slice(0, 8)}`;

    // Create payment record
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('payments')
      .insert({
        booking_id: bookingId,
        user_id: user.id,
        razorpay_order_id: orderId,
        amount: amount * 100,
        currency: 'INR',
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    const options = {
      key: razorpayKey,
      amount: amount * 100,
      currency: 'INR',
      name: 'Ganora Holistic Hub',
      description: 'Pranic Healing Session Booking',
      order_id: orderId,
      prefill: {
        name,
        email,
        contact: phone,
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
      },
      theme: {
        color: '#8B5CF6',
      },
      handler: async function (response: any) {
        try {
          await supabase
            .from('payments')
            .update({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: 'success',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentRecord.id);

          await supabase
            .from('bookings')
            .update({ 
              payment_status: 'paid',
              updated_at: new Date().toISOString()
            })
            .eq('id', bookingId);

          onSuccess?.();
        } catch (error) {
          console.error('Error handling payment success:', error);
          onFailure?.();
        }
      },
      modal: {
        ondismiss: async function () {
          try {
            await supabase
              .from('payments')
              .update({
                status: 'failed',
                updated_at: new Date().toISOString(),
              })
              .eq('id', paymentRecord.id);
            
            await supabase
              .from('bookings')
              .update({ 
                payment_status: 'failed',
                updated_at: new Date().toISOString()
              })
              .eq('id', bookingId);
          } catch (error) {
            console.error('Error updating failed payment:', error);
          }
          
          onFailure?.();
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  } catch (error) {
    console.error('Error initiating payment:', error);
    onFailure?.();
  }
};
