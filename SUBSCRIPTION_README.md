# MindCare Subscription System

## ✅ Implementation Complete!

### Files Created:
1. **src/hooks/useSubscription.js** - Hook to check user subscription status
2. **src/pages/Subscription.jsx** - Subscription page with Free & Pro plans
3. **src/componet/SubscriptionBanner.jsx** - Upgrade prompt component
4. **src/App.js** - Updated with subscription route

### Files Updated:
1. **src/pages/DoctorChat.jsx** - Added Pro subscription check
2. **src/pages/BookingHistory.jsx** - Added Pro subscription check

---

## 📋 Subscription Plans

### Free Plan (₹0)
- Basic mood tracking
- Limited journal entries (5/month)
- Basic chatbot access
- Music therapy
- Relaxation exercises
- Help resources

### Pro Plan (₹499/month)
- Everything in Free
- Unlimited journal entries
- Advanced AI chatbot
- **Doctor consultations** 🔒
- **Booking history** 🔒
- Priority support
- Personalized therapy plans
- Ad-free experience

---

## 🚀 How to Use

### Access Subscription Page:
Navigate to: `http://localhost:3000/subscription`

### Check Subscription in Components:
```javascript
import { useSubscription } from "../hooks/useSubscription";

const MyComponent = () => {
  const { isPro, isFree, subscription, loading } = useSubscription();

  if (loading) return <div>Loading...</div>;

  if (!isPro()) {
    return <SubscriptionBanner />;
  }

  // Your component code
};
```

### Protected Features:
- **Doctor Chat** - Pro only
- **Booking History** - Pro only

---

## 🔧 Next Steps (Optional)

1. **Add Razorpay Integration** - When you get API keys
2. **Add to Navbar** - Link to subscription page
3. **Journal Limit** - Implement 5 entries/month for free users
4. **Chatbot Limits** - Add usage limits for free users

---

## 📝 Testing

1. Run: `npm start`
2. Login to your account
3. Visit `/subscription`
4. Try switching between Free and Pro
5. Test accessing Doctor Chat (should show upgrade prompt for free users)

---

## 💾 Database Structure

Subscription data is stored in Firestore:
```
users/{userId}
  - subscription: "free" | "pro"
  - subscriptionDate: timestamp
```

---

Enjoy your new subscription system! 🎉
