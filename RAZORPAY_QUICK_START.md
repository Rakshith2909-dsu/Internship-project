# Razorpay Quick Setup - 5 Minutes ⚡

## Step 1: Get Razorpay Keys (2 minutes)
1. Go to https://razorpay.com/ → Sign Up (FREE)
2. Login → **Settings** → **API Keys**
3. Click **"Generate Test Key"**
4. Copy your:
   - **Key ID**: `rzp_test_xxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxx`

## Step 2: Add Keys to .env (1 minute)
Open `.env` file and update:
```env
VITE_RAZORPAY_KEY_ID="rzp_test_YOUR_ACTUAL_KEY"
VITE_RAZORPAY_KEY_SECRET="YOUR_ACTUAL_SECRET"
```
⚠️ Replace with REAL keys!

## Step 3: Restart Server (30 seconds)
```bash
# Ctrl+C to stop current server
npm run dev
```

## Step 4: Test Payment (1.5 minutes)
1. Login to website
2. Book a session (2nd booking onwards - 1st is FREE)
3. Use test card in payment popup:
   - **Card**: 4111 1111 1111 1111
   - **CVV**: 123
   - **Expiry**: 12/25
   - **OTP**: 123456

✅ Done! Payment system is live!

---

## Test Cards for Different Scenarios

### Success Payment:
- `4111 1111 1111 1111`
- `5104 0600 0000 0008`

### Failed Payment:
- `4000 0000 0000 0002`

### UPI Success:
- `success@razorpay`

---

## What Happens After Payment?

✅ Booking status → Paid  
✅ Payment saved in database  
✅ User redirected to success page  
✅ Admin can see transaction  
✅ User profile updated  

---

## Need More Details?
See `RAZORPAY_SETUP.md` for:
- Complete integration guide
- Webhook setup
- Going live instructions
- Refund process
- Troubleshooting

---

## ⚠️ Important Notes

- **Test Mode**: Use `rzp_test_xxx` keys
- **Live Mode**: Complete KYC first, then use `rzp_live_xxx`
- **Never share** your Key Secret publicly
- **Always restart** dev server after changing .env

---

## Quick Status Check

✅ Razorpay account created?  
✅ Keys added to .env?  
✅ Server restarted?  
✅ Test payment successful?  

**All checked?** You're good to go! 🎉

---

## Support
- **Razorpay**: support@razorpay.com
- **Docs**: https://razorpay.com/docs
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/

---

**Estimated Time**: 5 minutes  
**Difficulty**: Easy ⭐  
**Cost**: FREE (Test Mode)
