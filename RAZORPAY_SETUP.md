# Razorpay Payment Integration Setup Guide

## 🎯 Complete Razorpay Integration

Your Razorpay payment system is **fully implemented** and ready to use! This guide will help you configure it.

---

## 📋 What's Already Implemented

✅ **Payment Database Tables** - Tracks all transactions
✅ **Razorpay Checkout Integration** - Frontend payment gateway
✅ **Payment Success/Failure Handling** - Automatic status updates
✅ **Booking Status Synchronization** - Updates booking after payment
✅ **Payment History Tracking** - Admin can view all transactions
✅ **Automatic Triggers** - Updates user profiles after successful payment

---

## 🔐 Step 1: Get Razorpay API Keys

### 1.1 Create Razorpay Account
1. Go to: https://razorpay.com/
2. Click "Sign Up" (Free to start)
3. Complete registration with business details
4. Verify your email

### 1.2 Get API Keys

#### For Testing (Test Mode):
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click on **"Generate Test Key"** (if not already generated)
4. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxx`
5. **Copy both keys** (you'll need them in next step)

#### For Live Production (Later):
1. Complete KYC verification in Razorpay
2. Activate your account
3. Go to **Settings** → **API Keys**
4. Switch to **Live Mode**
5. Generate Live Keys: `rzp_live_xxxxxxxxxx`

---

## 🛠️ Step 2: Configure Your Application

### 2.1 Update .env File

Open your `.env` file and add your Razorpay keys:

```env
# Razorpay Configuration
VITE_RAZORPAY_KEY_ID="rzp_test_your_actual_key_here"
VITE_RAZORPAY_KEY_SECRET="your_secret_key_here"
```

**⚠️ IMPORTANT:**
- Replace `rzp_test_your_actual_key_here` with your actual Key ID
- Replace `your_secret_key_here` with your actual Key Secret
- **Never commit .env file to Git** (it's already in .gitignore)
- Keep your secret key secure!

### 2.2 Restart Development Server

After updating .env:
```bash
# Stop the current server (Ctrl+C)
# Restart with:
npm run dev
```

---

## ✅ Step 3: Test Payment Integration

### 3.1 Test Mode Payment Flow

1. **Create Account** or Login
2. **Book a Session** (2nd session onwards, 1st is free)
3. **Click "Pay Now"**
4. **Use Test Cards** (provided by Razorpay):

#### Test Card Numbers:
- **Success**: 4111 1111 1111 1111
- **CVV**: Any 3 digits (e.g., 123)
- **Expiry**: Any future date (e.g., 12/25)
- **OTP**: 123456 (if prompted)

#### Test UPI:
- **UPI ID**: success@razorpay
- **Success Flow**: Will show success

#### Test Netbanking:
- Select any bank
- Use credentials: username/password (any)

### 3.2 Verify Payment Success

After successful payment:
1. ✅ You should be redirected to Payment Success page
2. ✅ Booking status should change to "Paid"
3. ✅ Payment should appear in your Dashboard → Payments tab
4. ✅ Admin panel should show the transaction

---

## 💡 Payment Flow Explained

### User Perspective:
1. User selects a session and clicks "Book Now"
2. Booking gets created with status "pending"
3. Razorpay payment popup opens
4. User completes payment
5. On success:
   - Payment status: "paid"
   - Booking confirmed
   - User redirected to success page
6. On failure:
   - Payment status: "failed"
   - User can retry

### Database Flow:
1. **Booking Created** → `bookings` table (payment_status: 'pending')
2. **Payment Initiated** → `payments` table (status: 'pending')
3. **Payment Success** → Updates:
   - `payments.status` → 'success'
   - `bookings.payment_status` → 'paid'
   - `user_profiles.total_sessions_booked` +1
   - `user_profiles.is_first_session_used` → true

---

## 🔧 Advanced Configuration

### Webhook Setup (Optional - Recommended for Production)

Razorpay webhooks ensure payment verification even if user closes browser:

1. **In Razorpay Dashboard**:
   - Go to **Settings** → **Webhooks**
   - Click **"+ Add New Webhook"**
   - Webhook URL: `https://yourdomain.com/api/razorpay-webhook`
   - Select Events:
     - ✅ payment.captured
     - ✅ payment.failed
   - **Secret**: Generate and save it
   - Click **"Create Webhook"**

2. **In Your Application**:
   - Create a Supabase Edge Function to handle webhook
   - Verify webhook signature using secret
   - Update payment and booking status

---

## 💰 Pricing and Fees

### Razorpay Charges:
- **Domestic Cards**: 2% + GST (18%)
- **UPI**: 2% + GST (18%) (or free for first ₹1 crore)
- **Netbanking**: 2% + GST (18%)
- **Wallets**: 2% + GST (18%)

### Example for ₹500 Transaction:
- Transaction Amount: ₹500
- Razorpay Fee (2%): ₹10
- GST (18% on fee): ₹1.80
- **You Receive**: ₹488.20

---

## 🔒 Security Best Practices

### Do's ✅
- ✅ Store Key ID in .env file
- ✅ Keep Key Secret secure and never expose
- ✅ Use Test Mode for development
- ✅ Verify payment signatures in backend
- ✅ Enable 2FA on Razorpay account
- ✅ Monitor transactions regularly
- ✅ Set up webhook alerts

### Don'ts ❌
- ❌ Never commit .env file to Git
- ❌ Don't share API keys publicly
- ❌ Don't use Live keys in development
- ❌ Don't skip payment verification
- ❌ Don't store Key Secret in frontend code

---

## 🐛 Troubleshooting

### "Payment Gateway Not Configured" Error
**Solution**: 
1. Check if `.env` file has Razorpay keys
2. Ensure keys don't have the placeholder text
3. Restart development server after adding keys

### Payment Popup Not Opening
**Solution**:
1. Check browser console for errors
2. Ensure Razorpay script is loaded (check Network tab)
3. Try disabling ad blockers
4. Clear browser cache

### Payment Success But Status Not Updated
**Solution**:
1. Check browser console for errors
2. Verify internet connection
3. Check Supabase connection
4. Look at Admin panel → Payments tab for transaction

### Test Card Not Working
**Solution**:
1. Ensure you're using Test Mode keys (rzp_test_xxx)
2. Use cards from Razorpay's test card list
3. Try different card number: 5104 0600 0000 0008
4. Check if Razorpay account is active

---

## 📊 Monitoring Payments

### In Your Admin Panel:
1. Go to `/admin/dashboard`
2. Click **Payments** tab
3. View all transactions with:
   - Payment ID
   - Amount
   - Status
   - Customer details
   - Timestamp

### In Razorpay Dashboard:
1. Login to https://dashboard.razorpay.com
2. Go to **Transactions** → **Payments**
3. View detailed payment information
4. Download reports
5. Issue refunds if needed

---

## 🚀 Going Live (Production)

### Prerequisites:
1. ✅ Complete KYC verification
2. ✅ Add bank account details
3. ✅ Test all payment flows thoroughly
4. ✅ Setup webhooks
5. ✅ Configure settlement schedule

### Steps:
1. **Generate Live Keys**:
   - Switch to Live Mode in Razorpay Dashboard
   - Generate Live API Keys

2. **Update Production .env**:
   ```env
   VITE_RAZORPAY_KEY_ID="rzp_live_your_live_key"
   VITE_RAZORPAY_KEY_SECRET="your_live_secret"
   ```

3. **Deploy Application**:
   - Build production version
   - Deploy to hosting
   - Update environment variables on hosting platform

4. **Test Live Payment**:
   - Make a small real transaction (₹1)
   - Verify everything works
   - Check settlement in bank account (T+3 days)

---

## 📱 Supported Payment Methods

Your integration supports:
- ✅ Credit Cards (Visa, Mastercard, Amex, Rupay)
- ✅ Debit Cards
- ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
- ✅ Netbanking (All major banks)
- ✅ Wallets (Paytm, Mobikwik, etc.)
- ✅ EMI (on eligible cards)
- ✅ Cardless EMI

---

## 🔄 Refund Process

### How to Issue Refund:
1. Login to Razorpay Dashboard
2. Go to **Transactions** → **Payments**
3. Find the payment
4. Click **"Refund"**
5. Enter amount (full or partial)
6. Add reason
7. Confirm refund

### Refund Timeline:
- **Cards**: 5-7 business days
- **UPI**: Instant to 1 business day
- **Netbanking**: 5-7 business days
- **Wallets**: Instant

---

## 📞 Support & Resources

### Razorpay Support:
- **Email**: support@razorpay.com
- **Phone**: +91-80-6892-9231
- **Docs**: https://razorpay.com/docs
- **Developer Support**: https://razorpay.com/support

### Your Application:
- Check `payments` table in Supabase for transaction logs
- Review admin panel for payment analytics
- Check browser console for JavaScript errors

---

## ✨ Features Included

### For Users:
- ✅ Secure payment gateway
- ✅ Multiple payment options
- ✅ Payment success/failure pages
- ✅ Payment history in dashboard
- ✅ Email notifications (if configured)

### For Admins:
- ✅ View all transactions
- ✅ Track revenue
- ✅ Payment analytics
- ✅ Customer payment history
- ✅ Razorpay payment ID tracking

---

## 🎉 Your Payment System is Ready!

After configuring Razorpay keys, your payment system will:
1. ✅ Accept real payments (Test Mode initially)
2. ✅ Automatically update booking status
3. ✅ Track all transactions in database
4. ✅ Show payment history to users
5. ✅ Provide admin with complete payment analytics

---

**Need Help?** Check the troubleshooting section or contact Razorpay support!

**Ready to go live?** Follow the "Going Live" section above!

---

**Last Updated**: February 22, 2026  
**Status**: ✅ Production Ready (Pending Razorpay Configuration)
