import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Home } from 'lucide-react';

export const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentId, bookingId } = (location.state as any) || {};

  useEffect(() => {
    // Confetti or celebration animation can be added here
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-primary/5 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-base">
            Your session has been booked successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment ID:</span>
              <span className="font-mono text-xs">{paymentId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking ID:</span>
              <span className="font-mono text-xs">{bookingId || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount Paid:</span>
              <span className="font-semibold">₹500</span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>A confirmation email has been sent to your registered email address.</p>
            <p className="mt-2">You can view your booking details in your dashboard.</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              <Calendar className="mr-2 h-4 w-4" />
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
