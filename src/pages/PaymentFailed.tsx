import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, RefreshCw, Home, HelpCircle } from 'lucide-react';

export const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error, bookingId } = (location.state as any) || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-background to-destructive/5 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            Payment Failed
          </CardTitle>
          <CardDescription className="text-base">
            We couldn't process your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-2">
            <p className="text-sm text-red-800">
              {error || 'The payment was not completed. This could be due to:'}
            </p>
            <ul className="text-sm text-red-700 list-disc list-inside space-y-1 mt-2">
              <li>Insufficient funds in your account</li>
              <li>Payment was cancelled</li>
              <li>Network connectivity issues</li>
              <li>Invalid card details</li>
            </ul>
          </div>

          {bookingId && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Booking ID: <span className="font-mono text-xs">{bookingId}</span></p>
              <p className="mt-1">Your booking is still pending payment.</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate('/#sessions')}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              View My Bookings
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Need help? Contact us at{' '}
                <a href="mailto:support@mindfulwave.com" className="text-primary hover:underline">
                  support@mindfulwave.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
