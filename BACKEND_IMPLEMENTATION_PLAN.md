# Mindful Wave - Complete Backend Implementation Plan

## 📋 Current Website Analysis

### ✅ What's Already Implemented

1. **Frontend Components**
   - Hero Section with brand introduction
   - Services showcase (Pranic Healing, Energy Awareness, Mindful Living, Wellness Workshops)
   - Session listings with upcoming events
   - Booking Dialog for session registration
   - Contact form
   - Testimonials and Gallery sections

2. **Current Booking System**
   - Basic booking form with name, email, phone
   - Date and time slot selection
   - Session type selection
   - First session vs repeat session detection (by email/phone)
   - Supabase integration for storing bookings
   - Offline fallback using localStorage

3. **Database (Supabase)**
   - **`bookings`** table with fields:
     - id (UUID)
     - name, email, phone
     - booking_date, booking_time
     - session_type
     - is_first_session (boolean)
     - payment_status (string)
     - amount_paid (number)
     - created_at (timestamp)

4. **Technology Stack**
   - React + TypeScript
   - Vite build tool
   - Supabase for backend/database
   - Tailwind CSS + shadcn/ui components
   - React Router for navigation
   - TanStack Query for data fetching

### ❌ What's Missing

1. **User Authentication System**
   - No user registration/login
   - No user profiles
   - No session management

2. **Payment Integration**
   - No payment gateway (Razorpay/Stripe)
   - No payment verification
   - Manual payment tracking only

3. **Pricing Logic**
   - First session free ✓ (logic exists but not enforced)
   - ₹500 for subsequent sessions (needs implementation)

4. **User Dashboard**
   - No booking history view
   - No profile management
   - No session tracking

5. **Admin Panel**
   - Limited admin functionality
   - No payment tracking dashboard
   - No customer management

---

## 🎯 Business Requirements

### Pricing Model
- **First Session**: FREE (₹0)
- **All Subsequent Sessions**: ₹500 per session

### Payment Flow
1. User fills booking form
2. System checks if first-time customer (by email/phone)
3. If first session → Allow free booking
4. If repeat customer → Redirect to payment gateway (₹500)
5. Only mark registration successful after payment confirmation
6. Send confirmation email/SMS

### Authentication Requirements
- Users must create account with email/password
- Store user details in Supabase Auth
- Track session history per user
- Secure login for repeat bookings

---

## 🚀 Implementation Phases

## **PHASE 1: User Authentication & Registration** 
### **Timeline: Week 1-2**

#### Goals:
- Enable user signup/login with Supabase Auth
- Create user profiles
- Session management

#### Tasks:

**1.1 Setup Supabase Authentication**
- Enable Email/Password authentication in Supabase dashboard
- Configure email templates for verification
- Set up password reset functionality

**1.2 Create Database Tables**
```sql
-- Users Profile Table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  total_sessions_booked INTEGER DEFAULT 0,
  is_first_session_used BOOLEAN DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

**1.3 Update Bookings Table**
```sql
-- Add user_id foreign key to bookings table
ALTER TABLE bookings 
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Add index for faster queries
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- Update RLS policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**1.4 Create Frontend Components**
- `src/components/Auth/LoginForm.tsx` - Login page
- `src/components/Auth/SignupForm.tsx` - Registration page
- `src/components/Auth/ForgotPassword.tsx` - Password reset
- `src/components/Auth/AuthProvider.tsx` - Auth context wrapper
- `src/pages/Profile.tsx` - User profile page
- `src/pages/Dashboard.tsx` - User dashboard

**1.5 Protected Routes**
```tsx
// Update App.tsx with protected routes
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
```

#### Deliverables:
✅ Working signup/login system
✅ User profile creation
✅ Session persistence
✅ Protected dashboard route

---

## **PHASE 2: Payment Gateway Integration**
### **Timeline: Week 3-4**

#### Goals:
- Integrate Razorpay payment gateway
- Handle payment verification
- Update booking flow

#### Tasks:

**2.1 Setup Razorpay**
- Create Razorpay account
- Get API keys (Test & Live)
- Install Razorpay SDK: `npm install razorpay`
- Add keys to `.env`:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_SECRET_KEY=your_secret_key (backend only)
```

**2.2 Create Payment Table**
```sql
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  razorpay_order_id TEXT UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  razorpay_signature TEXT,
  amount INTEGER NOT NULL, -- Amount in paise (50000 for ₹500)
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- pending, success, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);
```

**2.3 Create Supabase Edge Functions**
```typescript
// supabase/functions/create-payment-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Razorpay from "razorpay"

serve(async (req) => {
  const { amount, bookingId, userId } = await req.json()
  
  const razorpay = new Razorpay({
    key_id: Deno.env.get('RAZORPAY_KEY_ID'),
    key_secret: Deno.env.get('RAZORPAY_SECRET_KEY')
  })
  
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `booking_${bookingId}`
  })
  
  // Store order in database
  // Return order details
  
  return new Response(JSON.stringify(order))
})
```

```typescript
// supabase/functions/verify-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "node:crypto"

serve(async (req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()
  
  // Verify signature
  const generated_signature = createHmac('sha256', RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex')
  
  if (generated_signature === razorpay_signature) {
    // Update payment status to 'success'
    // Update booking payment_status to 'paid'
    // Send confirmation email
    return new Response(JSON.stringify({ verified: true }))
  }
  
  return new Response(JSON.stringify({ verified: false }), { status: 400 })
})
```

**2.4 Create Payment Components**
- `src/components/Payment/RazorpayCheckout.tsx` - Payment modal
- `src/components/Payment/PaymentSuccess.tsx` - Success page
- `src/components/Payment/PaymentFailed.tsx` - Failure page

**2.5 Update BookingDialog.tsx**
```tsx
// Enhanced booking flow logic
const handleBookingSubmit = async (formData) => {
  // 1. Check if user is authenticated
  if (!user) {
    // Redirect to login
    return
  }
  
  // 2. Check if first session
  const isFirstSession = await checkFirstSession(user.id)
  
  // 3. If first session → Book directly (FREE)
  if (isFirstSession) {
    await createBooking({ ...formData, amount_paid: 0, payment_status: 'free' })
    showSuccessToast()
  } else {
    // 4. If repeat session → Initiate payment (₹500)
    const order = await createPaymentOrder(500, user.id)
    openRazorpayCheckout(order)
  }
}
```

#### Deliverables:
✅ Razorpay integration
✅ Payment verification system
✅ ₹500 charge for repeat sessions
✅ Free first session
✅ Payment success/failure handling

---

## **PHASE 3: Booking Logic & Restrictions**
### **Timeline: Week 5**

#### Goals:
- Enforce first session free rule
- Implement repeat session pricing
- Prevent duplicate bookings

#### Tasks:

**3.1 Create Helper Functions**
```typescript
// src/lib/bookingHelpers.ts

export const checkIsFirstSession = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('user_id', userId)
    .eq('payment_status', 'paid')
    .or('payment_status.eq.free')
  
  return !data || data.length === 0
}

export const getSessionPrice = async (userId: string): Promise<number> => {
  const isFirst = await checkIsFirstSession(userId)
  return isFirst ? 0 : 500
}

export const createBookingWithPayment = async (bookingData, userId) => {
  const price = await getSessionPrice(userId)
  
  if (price === 0) {
    // Free session - create booking directly
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        user_id: userId,
        amount_paid: 0,
        payment_status: 'free',
        is_first_session: true
      })
    
    return { success: true, booking: data }
  } else {
    // Paid session - initiate payment
    return { success: false, requiresPayment: true, amount: price }
  }
}
```

**3.2 Add Booking Restrictions**
```sql
-- Prevent booking same slot twice
CREATE UNIQUE INDEX unique_booking_slot 
ON bookings(booking_date, booking_time, user_id);

-- Trigger to update user profile after successful booking
CREATE OR REPLACE FUNCTION update_user_session_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status IN ('paid', 'free') THEN
    UPDATE user_profiles
    SET total_sessions_booked = total_sessions_booked + 1,
        is_first_session_used = TRUE
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_booking_insert
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_session_count();
```

**3.3 Update UI/UX**
- Show pricing info before booking
- Display "First Session FREE" badge
- Show "₹500" for repeat customers
- Add payment status indicators

#### Deliverables:
✅ First session always free
✅ ₹500 for all subsequent sessions
✅ No duplicate bookings
✅ Automatic user profile updates

---

## **PHASE 4: User Dashboard**
### **Timeline: Week 6**

#### Goals:
- Display booking history
- Show payment records
- Profile management

#### Tasks:

**4.1 Create Dashboard Components**
```tsx
// src/pages/Dashboard.tsx
import BookingHistory from '@/components/Dashboard/BookingHistory'
import PaymentHistory from '@/components/Dashboard/PaymentHistory'
import ProfileCard from '@/components/Dashboard/ProfileCard'

export const Dashboard = () => {
  return (
    <div>
      <ProfileCard />
      <BookingHistory />
      <PaymentHistory />
    </div>
  )
}
```

**4.2 Booking History Query**
```typescript
const { data: bookings } = useQuery({
  queryKey: ['user-bookings'],
  queryFn: async () => {
    const { data } = await supabase
      .from('bookings')
      .select('*, payments(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    return data
  }
})
```

**4.3 Dashboard Features**
- **Upcoming Sessions**: Show future bookings
- **Past Sessions**: Completed bookings
- **Payment History**: All transactions
- **Edit Profile**: Update name, phone
- **Total Spent**: Sum of all payments

#### Deliverables:
✅ Complete booking history
✅ Payment tracking
✅ Profile editing
✅ Session statistics

---

## **PHASE 5: Admin Panel**
### **Timeline: Week 7**

#### Goals:
- Customer management
- Payment tracking
- Booking analytics

#### Tasks:

**5.1 Create Admin Role**
```sql
-- Add admin role to user_profiles
ALTER TABLE user_profiles
ADD COLUMN role TEXT DEFAULT 'user';

-- Update your admin user
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';

-- Admin access policies
CREATE POLICY "Admins can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**5.2 Admin Dashboard Components**
- `src/pages/Admin/CustomerList.tsx` - All customers
- `src/pages/Admin/BookingManagement.tsx` - All bookings
- `src/pages/Admin/PaymentTracking.tsx` - Payment overview
- `src/pages/Admin/Analytics.tsx` - Charts and stats

**5.3 Admin Features**
- View all customers and their session counts
- Track payment status (pending/paid/failed)
- Mark manual payments as complete
- Generate reports (daily/weekly/monthly revenue)
- Cancel/reschedule bookings

#### Deliverables:
✅ Admin role system
✅ Customer management
✅ Financial tracking
✅ Analytics dashboard

---

## **PHASE 6: Email & SMS Notifications**
### **Timeline: Week 8**

#### Goals:
- Send booking confirmations
- Payment receipts
- Session reminders

#### Tasks:

**6.1 Setup Email Service**
- Use Supabase Auth emails or integrate SendGrid/Resend
- Create email templates

**6.2 Create Email Templates**
- Booking confirmation email
- Payment receipt
- 24-hour session reminder
- Cancellation notice

**6.3 SMS Integration (Optional)**
- Integrate Twilio or MSG91
- Send SMS reminders for sessions

**6.4 Create Notification Function**
```typescript
// supabase/functions/send-notifications/index.ts
serve(async (req) => {
  const { type, userId, bookingId } = await req.json()
  
  if (type === 'booking_confirmation') {
    await sendEmail(/* ... */)
    await sendSMS(/* ... */)
  }
})
```

#### Deliverables:
✅ Automated email notifications
✅ SMS reminders (optional)
✅ Payment receipts
✅ Booking confirmations

---

## **PHASE 7: Testing & Deployment**
### **Timeline: Week 9-10**

#### Tasks:

**7.1 Testing**
- Test signup/login flows
- Test free first session
- Test ₹500 payment for repeat sessions
- Test payment failures
- Test admin panel functionality
- Cross-browser testing
- Mobile responsiveness

**7.2 Security Audit**
- Verify RLS policies
- Test authentication edge cases
- Secure API keys
- HTTPS enforcement

**7.3 Production Deployment**
- Switch Razorpay to live keys
- Configure production Supabase
- Setup custom domain
- Enable SSL certificate
- Configure CORS properly

**7.4 Monitoring**
- Setup error tracking (Sentry)
- Monitor payment success rate
- Track user signups
- Monitor server performance

#### Deliverables:
✅ Fully tested application
✅ Production deployment
✅ Monitoring systems
✅ Documentation

---

## 📁 File Structure After Implementation

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── AuthProvider.tsx
│   ├── Payment/
│   │   ├── RazorpayCheckout.tsx
│   │   ├── PaymentSuccess.tsx
│   │   └── PaymentFailed.tsx
│   ├── Dashboard/
│   │   ├── BookingHistory.tsx
│   │   ├── PaymentHistory.tsx
│   │   └── ProfileCard.tsx
│   └── Admin/
│       ├── CustomerList.tsx
│       ├── BookingManagement.tsx
│       └── Analytics.tsx
├── pages/
│   ├── Login.tsx
│   ├── Signup.tsx
│   ├── Dashboard.tsx
│   ├── Profile.tsx
│   └── Admin/
├── lib/
│   ├── bookingHelpers.ts
│   ├── paymentHelpers.ts
│   └── authHelpers.ts
└── hooks/
    ├── useAuth.ts
    └── usePayment.ts

supabase/
├── migrations/
│   ├── 002_add_user_profiles.sql
│   ├── 003_add_payments.sql
│   └── 004_add_admin_role.sql
└── functions/
    ├── create-payment-order/
    ├── verify-payment/
    └── send-notifications/
```

---

## 💰 Cost Estimation

### Development Costs
- Razorpay: Transaction fee 2% + GST on ₹500 = ~₹11.8 per transaction
- Supabase Free tier: Up to 500MB database, 2GB bandwidth
- Supabase Pro (if needed): $25/month
- Email service: Free tier (SendGrid/Resend)
- SMS (optional): ~₹0.20-0.50 per SMS

### Development Time
- Total: **8-10 weeks** for complete implementation
- Developer hours: ~200-250 hours

---

## 🔐 Security Considerations

1. **Authentication**
   - Use Supabase Auth (built on JWT)
   - Enable email verification
   - Strong password requirements
   - Rate limiting on login attempts

2. **Payment Security**
   - Never store card details (PCI compliance)
   - Verify all payments server-side
   - Use webhook verification
   - Razorpay handles card security

3. **Database Security**
   - Row Level Security (RLS) enabled
   - Proper auth policies
   - Encrypted database storage
   - API key rotation

4. **API Security**
   - CORS configuration
   - Environment variables for secrets
   - HTTPS only
   - Input validation

---

## 📊 Success Metrics

Track these metrics post-launch:
- User signup conversion rate
- Free session completion rate
- Repeat booking rate
- Payment success rate
- Average revenue per user (ARPU)
- Session attendance rate

---

## 🚨 Potential Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| Payment failures | Retry mechanism, fallback payment methods |
| First-time detection accuracy | Multiple checks (email, phone, user_id) |
| Scalability | Supabase auto-scales, monitor database performance |
| No-shows | Implement cancellation policy, send reminders |
| Refunds | Admin panel for manual refund processing |

---

## 📞 Support & Maintenance

**Post-Launch Support:**
- Monitor payment gateway logs
- Customer support for booking issues
- Regular database backups
- Security updates
- Feature enhancements based on feedback

---

## 🎯 Quick Start Guide

### For Development Team:
1. Start with **Phase 1** (Authentication)
2. Test thoroughly before moving to **Phase 2**
3. Use Razorpay **test mode** until production
4. Follow security best practices
5. Document all API endpoints
6. Create comprehensive test cases

### Priority Order:
1. ✅ Authentication system
2. ✅ Payment integration (Razorpay)
3. ✅ Booking logic (free first, ₹500 after)
4. ✅ User dashboard
5. ✅ Admin panel
6. ✅ Notifications
7. ✅ Testing & deployment

---

## 📝 Notes

- This plan assumes you already have a Supabase project setup
- Razorpay test credentials should be used for development
- All monetary values in the code should be in paise (₹500 = 50000 paise)
- Keep separate environment files for development and production
- Regular backups are crucial once real customer data is stored

---

**Document Version:** 1.0  
**Last Updated:** February 16, 2026  
**Status:** Ready for Implementation

---

## ✅ Next Steps

1. Review this document with the development team
2. Create detailed sprint planning for each phase
3. Setup development environment
4. Begin Phase 1 implementation
5. Schedule regular review meetings

**Good luck with the implementation! 🚀**
