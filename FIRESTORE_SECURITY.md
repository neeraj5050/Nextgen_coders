# Firestore Security Rules Setup

## Overview
These security rules protect MindCare user data by ensuring:
- Only authenticated users can access data
- Users can only read/write their own data
- Data validation on writes
- No unauthorized access to any collection

## Rules Breakdown

### 1. **users/{userId}**
- Users can only access their own profile
- Subscription must be 'free' or 'pro'
- Prevents users from reading other users' data

### 2. **users/{userId}/journals/{journalId}**
- Users can only access their own journal entries
- Required fields: title, content, timestamp
- Timestamp must be valid Firestore timestamp

### 3. **chatUsage/{userId}**
- Users can only access their own chat usage data
- Count must be a non-negative number
- Prevents manipulation of usage limits

### 4. **moodTracking/{userId}** & **sleepTracking/{userId}**
- Users can only access their own tracking data
- Full read/write access to own data

### 5. **bookings/{bookingId}**
- Users can only see their own bookings
- Required fields: userId, doctorName, date, time, status
- Prevents viewing other users' appointments

### 6. **Default Deny**
- All other collections are blocked by default
- Prevents unauthorized access to any data

## Deployment Steps

### Option 1: Firebase Console (Easiest)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your MindCare project
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy contents from `firestore.rules` file
5. Paste into the rules editor
6. Click **Publish**

### Option 2: Firebase CLI
```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project (if not done)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## Testing Rules

### Test in Firebase Console
1. Go to **Firestore Database** → **Rules** tab
2. Click **Rules Playground**
3. Test scenarios:
   - Authenticated user reading own data ✅
   - Authenticated user reading other user's data ❌
   - Unauthenticated user reading any data ❌

### Test Scenarios
```javascript
// ✅ ALLOWED: User reads own profile
Location: /users/USER_ID
Auth: USER_ID
Operation: get

// ❌ DENIED: User reads another user's profile
Location: /users/OTHER_USER_ID
Auth: USER_ID
Operation: get

// ✅ ALLOWED: User creates own journal
Location: /users/USER_ID/journals/JOURNAL_ID
Auth: USER_ID
Operation: create
Data: { title: "Test", content: "Content", timestamp: <timestamp> }

// ❌ DENIED: User creates journal for another user
Location: /users/OTHER_USER_ID/journals/JOURNAL_ID
Auth: USER_ID
Operation: create
```

## Security Features

### ✅ Protected Against
- Unauthorized data access
- Cross-user data reading
- Invalid subscription values
- Missing required fields
- Negative usage counts
- Unauthenticated requests

### 🔒 Data Privacy
- Journal entries are private
- Mood/sleep tracking is private
- Chat usage is private
- Bookings are private
- Subscription status is private

## Important Notes

1. **Deploy Before Production**: These rules MUST be deployed before launching
2. **Test Thoroughly**: Use Rules Playground to verify all scenarios
3. **Monitor Access**: Check Firebase Console for denied requests
4. **Update Rules**: If you add new collections, update rules accordingly

## Current Collections Protected
- ✅ users
- ✅ users/{userId}/journals
- ✅ chatUsage
- ✅ moodTracking
- ✅ sleepTracking
- ✅ bookings

## Future Collections
When adding new collections, follow this pattern:
```javascript
match /newCollection/{docId} {
  allow read: if isAuthenticated() && resource.data.userId == request.auth.uid;
  allow write: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
}
```

## Emergency Access
If you need admin access for debugging:
1. Create a Cloud Function with Admin SDK
2. Never expose admin access to client
3. Use Firebase Console for manual data inspection

## Compliance
These rules help with:
- GDPR compliance (data privacy)
- HIPAA considerations (healthcare data protection)
- User data isolation
- Audit trail (Firebase logs all access)
