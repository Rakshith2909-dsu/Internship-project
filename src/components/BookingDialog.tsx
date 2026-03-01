import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { checkIsFirstSession, getSessionPrice, createBooking } from "@/lib/bookingHelpers";
import { sendBookingConfirmation } from "@/lib/notificationService";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingDialog = ({ open, onOpenChange }: BookingDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedSessionType, setSelectedSessionType] = useState<string>("");
  const [isFirstSession, setIsFirstSession] = useState(true);
  const [sessionPrice, setSessionPrice] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");
  
  // Pranic Healing session questions
  const [reasonForBooking, setReasonForBooking] = useState("");
  const [previousExperience, setPreviousExperience] = useState("");
  const [underTreatment, setUnderTreatment] = useState("");
  const [specificConcerns, setSpecificConcerns] = useState("");
  
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", 
    "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const handleBookingSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to book a session.',
        variant: 'destructive',
      });
      onOpenChange(false);
      navigate('/login');
      return;
    }

    // If user exists but profile doesn't, try to load it
    if (!profile) {
      toast({
        title: 'Loading Profile',
        description: 'Please wait while we load your profile...',
      });
      return;
    }

    if (!selectedDate || !selectedTime || !selectedSessionType) {
      toast({
        title: 'Missing Information',
        description: 'Please select date, time, and session type.',
        variant: 'destructive',
      });
      return;
    }

    // Validate Pranic Healing questions if that session type is selected
    if (selectedSessionType === "Pranic Healing") {
      if (!reasonForBooking || !previousExperience || !underTreatment) {
        toast({
          title: 'Missing Information',
          description: 'Please answer all required Pranic Healing questions.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsChecking(true);

    // Check if this is first session
    const firstSession = await checkIsFirstSession(user.id);
    setIsFirstSession(firstSession);
    
    // Calculate price
    const price = getSessionPrice(firstSession, selectedSessionType);
    setSessionPrice(price);

    setIsChecking(false);

    // Move to review step
    setStep(2);
  };

  const handlePaymentConfirm = async () => {
    if (!user || !profile || !selectedDate || !selectedTime || !selectedSessionType) return;

    try {
      // If first session or free session, create booking directly
      if (isFirstSession || sessionPrice === 0) {
        const bookingData = {
          user_id: user.id,
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          session_type: selectedSessionType,
          amount_paid: 0,
          payment_status: 'free' as 'free' | 'pending'
        };

        const booking = await createBooking(bookingData);
        
        // Send booking confirmation email
        await sendBookingConfirmation(user.id, booking.id, {
          customerName: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          date: selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          time: selectedTime,
          sessionType: selectedSessionType,
          amount: 0,
          isFirstSession: true
        });
        
        toast({
          title: 'Booking Confirmed!',
          description: 'Your session has been booked successfully. Check your email for details.',
        });
        
        resetForm();
        onOpenChange(false);
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Create pending booking and show UPI QR code
        const bookingData = {
          user_id: user.id,
          name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          session_type: selectedSessionType,
          amount_paid: sessionPrice,
          payment_status: 'pending' as 'free' | 'pending'
        };

        const booking = await createBooking(bookingData);
        setBookingId(booking.id);
        
        // Move to payment QR code step
        setStep(3);
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      
      if (error?.code === '23505' || error?.message?.includes('duplicate')) {
        toast({
          title: 'Booking Already Exists',
          description: 'You already have a booking for this date and time.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Booking Failed',
          description: 'Failed to create booking. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedSessionType("");
    setReasonForBooking("");
    setPreviousExperience("");
    setUnderTreatment("");
    setSpecificConcerns("");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 && "Book Your Session"}
            {step === 2 && "Review & Confirm"}
            {step === 3 && "Complete Payment"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Select your preferred date, time and session type"}
            {step === 2 && "Review your booking details and confirm"}
            {step === 3 && "Scan the QR code to complete your payment"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={handleBookingSubmit} className="space-y-6 mt-4">
            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  Please <button type="button" onClick={() => { onOpenChange(false); navigate('/login'); }} className="underline font-medium">log in</button> to book a session.
                </p>
              </div>
            )}

            {user && !profile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800">
                  Loading your profile...
                </p>
              </div>
            )}

            {profile && (
              <div className="space-y-2">
                <Label>Your Details</Label>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="text-sm"><span className="font-medium">Name:</span> {profile.full_name || 'Not set'}</p>
                  <p className="text-sm"><span className="font-medium">Email:</span> {profile.email}</p>
                  <p className="text-sm"><span className="font-medium">Phone:</span> {profile.phone || 'Not set'}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className={cn("rounded-md border p-3 pointer-events-auto")}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Session Type</Label>
              <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose session type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pranic Healing">Pranic Healing</SelectItem>
                  <SelectItem value="Energy Awareness">Energy Awareness</SelectItem>
                  <SelectItem value="Mindful Living">Mindful Living</SelectItem>
                  <SelectItem value="Wellness Workshop">Wellness Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedSessionType === "Pranic Healing" && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-sm text-muted-foreground">Pranic Healing Session Questions</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="reason">What brings you to book this session? *</Label>
                  <Input
                    id="reason"
                    value={reasonForBooking}
                    onChange={(e) => setReasonForBooking(e.target.value)}
                    placeholder="Please share your reason..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Have you experienced energy-based or healing sessions before? *</Label>
                  <Input
                    id="experience"
                    value={previousExperience}
                    onChange={(e) => setPreviousExperience(e.target.value)}
                    placeholder="Yes/No and any details..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment">Are you currently under medical or psychological treatment? *</Label>
                  <Select value={underTreatment} onValueChange={setUnderTreatment}>
                    <SelectTrigger id="treatment">
                      <SelectValue placeholder="Select Yes or No" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="concerns">Do you have any specific concerns you would like to mention?</Label>
                  <Input
                    id="concerns"
                    value={specificConcerns}
                    onChange={(e) => setSpecificConcerns(e.target.value)}
                    placeholder="Any specific concerns or areas to focus on..."
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={!user || !selectedDate || !selectedTime || !selectedSessionType || isChecking}
            >
              {isChecking ? "Processing..." : "Continue to Review"}
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6 mt-4">
            <div className="bg-accent/20 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{profile?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{profile?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{profile?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString('en-IN', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Type:</span>
                  <span className="font-medium">{selectedSessionType}</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Amount:</span>
                  <span className="font-bold text-primary text-lg">
                    {isFirstSession ? 'FREE' : `₹${sessionPrice}`}
                  </span>
                </div>
              </div>
            </div>

            {isFirstSession && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">
                  🎉 Your first session is FREE!
                </p>
              </div>
            )}

            {!isFirstSession && sessionPrice > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-medium">
                  💳 Payment of ₹{sessionPrice} via UPI QR Code
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handlePaymentConfirm}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isFirstSession ? 'Confirm Booking' : 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 mt-4">
            <div className="bg-accent/20 p-6 rounded-lg text-center space-y-4">
              <div className="bg-white p-6 rounded-lg inline-block">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=vpabhitejas@okicici%26pn=ABHISHEK.P%26am=${sessionPrice}%26cu=INR`}
                  alt="UPI QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
              
              <div className="space-y-2">
                <p className="font-semibold text-lg">UPI ID: vpabhitejas@okicici</p>
                <p className="text-2xl font-bold text-primary">Amount: ₹{sessionPrice}.00</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  📱 Scan the QR code with any UPI app (GPay, PhonePe, Paytm, etc.) to pay
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                ⏱️ Your booking is reserved. After payment, it will be automatically confirmed.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  // Send confirmation email for pending booking
                  if (user && profile && selectedDate && selectedTime && selectedSessionType) {
                    sendBookingConfirmation(user.id, bookingId, {
                      customerName: profile.full_name,
                      email: profile.email,
                      phone: profile.phone,
                      date: selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
                      time: selectedTime,
                      sessionType: selectedSessionType,
                      amount: sessionPrice,
                      isFirstSession: false
                    });
                  }
                  resetForm();
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                Done
              </Button>
              <Button
                onClick={() => {
                  toast({
                    title: 'Payment Pending',
                    description: 'Your booking is saved. Check your dashboard for status.',
                  });
                  resetForm();
                  onOpenChange(false);
                  navigate('/dashboard');
                }}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
