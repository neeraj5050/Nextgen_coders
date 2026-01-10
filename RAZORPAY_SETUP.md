# Razorpay Integration Guide for MindCare

## ✅ Integration Complete!

Razorpay payment gateway has been integrated into your subscription system.

---

## 🔑 Step 1: Get Your Razorpay Keys

### For Testing (Free):
1. Go to https://razorpay.com/
2. Sign up for a free account
3. Go to **Settings → API Keys**
4. Copy your **Test Key ID** (starts with `rzp_test_`)

### For Production (Live Payments):
1. Complete KYC verification on Razorpay
2. Get your **Live Key ID** (starts with `rzp_live_`)

---

## 🛠️ Step 2: Add Your Key to .env

Open your `.env` file and replace:

```env
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id_here
```

With your actual key:

```env
REACT_APP_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

---

## 🧪 Step 3: Test the Payment

### Test Mode (No Real Money):
1. Run `npm start`
2. Go to `/subscription`
3. Click "Upgrade to Pro"
4. Use these test card details:

**Test Card Details:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., `12/25`)
- CVV: Any 3 digits (e.g., `123`)
- Name: Any name

### What Happens:
1. Razorpay payment modal opens
2. User enters card details
3. Payment processes (test mode = instant success)
4. On success:
   - User subscription updated to "pro"
   - Payment ID saved to Firestore
   - User gets Pro access immediately

---

## 💰 Pricing Structure

Current pricing in the code:

```javascript
{
  id: "pro",
  amount: 2900,  // Amount in paise (₹29)
}
```

**To change price:**
- ₹29 = `2900` paise
- ₹49 = `4900` paise
- ₹99 = `9900` paise
- ₹299 = `29900` paise
- ₹499 = `49900` paise

---

## 📊 Payment Flow

```
User clicks "Upgrade to Pro"
  ↓
Razorpay modal opens
  ↓
User enters payment details
  ↓
Payment processed
  ↓
Success? 
  ├─ YES → Update Firestore → Grant Pro access
  └─ NO  → Show error → User stays on Free
```

---

## 🗄️ Data Stored in Firestore

After successful payment:

```javascript
users/{userId}
  - subscription: "pro"
  - subscriptionDate: timestamp
  - paymentId: "pay_xxxxxxxxxxxxx"
  - lastPaymentDate: timestamp
```

---

## 🔒 Security Notes

1. **Never expose your Key Secret** - Only use Key ID in frontend
2. **Test Mode** - No real money is charged
3. **Live Mode** - Real payments, requires KYC
4. **Webhook** - For production, set up webhooks to verify payments

---

## 🚀 Going Live Checklist

- [ ] Complete Razorpay KYC verification
- [ ] Get Live API Key
- [ ] Update `.env` with live key
- [ ] Test with small real payment
- [ ] Set up Razorpay webhooks (optional but recommended)
- [ ] Add refund policy page
- [ ] Add terms & conditions

---

## 🎯 Features Implemented

✅ Razorpay payment modal integration
✅ Test mode support
✅ Payment success handling
✅ Automatic subscription upgrade
✅ Payment ID tracking
✅ User-friendly error handling
✅ Payment cancellation handling

---

## 🐛 Troubleshooting

### Payment modal not opening?
- Check if Razorpay script is loaded in `index.html`
- Check browser console for errors
- Verify `REACT_APP_RAZORPAY_KEY_ID` is set

### Payment succeeds but subscription not updating?
- Check Firestore rules allow writes
- Check browser console for errors
- Verify user is logged in

### "Invalid key" error?
- Verify key format: `rzp_test_xxxxxxxxxx`
- Check for extra spaces in `.env`
- Restart dev server after changing `.env`

---

## 📞 Support

- Razorpay Docs: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

## 🎉 You're All Set!

Your payment system is ready to accept payments. Just add your Razorpay key and start testing!

**Next Steps:**
1. Get Razorpay test key
2. Add to `.env`
3. Restart server: `npm start`
4. Test payment with test card
5. Celebrate! 🎊
