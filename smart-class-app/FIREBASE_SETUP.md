# Firebase Setup Guide

## Overview
This guide walks you through setting up Firebase for the Smart Class Check-in app.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a new project"**
3. Enter Project Name: `smart-class-checkin`
4. Choose your region
5. Click **"Create project"** (wait 1-2 minutes for setup)

## Step 2: Set Up Firestore Database

1. In Firebase Console, go to **Build** → **Firestore Database**
2. Click **"Create database"**
3. Choose **Start in production mode**
4. Select your preferred location
5. Click **"Enable"**

## Step 3: Get Firebase Credentials

1. Click the gear icon (⚙️) → **Project settings**
2. Go to **Service Accounts** tab
3. Click **"Generate new private key"** (keep this secret!)
4. Or go to **General** tab and scroll down to **Your apps** section
5. Click **"Web"** to create a web app
6. Copy the `firebaseConfig` object

Your config should look like:
```javascript
{
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

## Step 4: Create Firestore Collections

### Collection 1: `checkins`

1. In Firestore, click **"+ Start collection"**
2. Collection ID: `checkins`
3. Click **"Next"**
4. Click **"Auto ID"** (or use random ID)
5. Add sample document:

```json
{
  "studentId": "STU001",
  "qrCodeValue": "CLASS-101-2026-03-13",
  "checkInTime": new Date(),
  "gpsLatitude": 13.7563,
  "gpsLongitude": 100.5018,
  "previousTopic": "Introduction to Databases",
  "expectedTopic": "SQL Queries",
  "mood": 4,
  "synced": true
}
```

6. Click **"Save"**

### Collection 2: `checkouts`

1. Click **"+ Start collection"**
2. Collection ID: `checkouts`
3. Click **"Next"**
4. Click **"Auto ID"**
5. Add sample document:

```json
{
  "studentId": "STU001",
  "qrCodeValue": "CLASS-101-2026-03-13",
  "checkOutTime": new Date(),
  "gpsLatitude": 13.7563,
  "gpsLongitude": 100.5018,
  "learnedTopic": "Learned about database indexing",
  "feedback": "Great explanation of query optimization",
  "synced": true
}
```

6. Click **"Save"**

## Step 5: Configure Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anonymous reads and writes
    // Change this for production!
    match /checkins/{document=**} {
      allow read, write: if true;
    }
    match /checkouts/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

⚠️ **Warning**: These rules allow anyone to read/write. For production, add proper authentication.

## Step 6: Add Firebase Credentials to App

### Option A: Using Environment Variables (Recommended)

1. In project root, create `.env.local`:

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

2. Save the file
3. These will auto-load in `src/config/firebase.ts`

### Option B: Direct Update

1. Open `src/config/firebase.ts`
2. Replace the credentials directly:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  // ... rest of config
};
```

## Step 7: Test Connection

1. Run the app: `npm start`
2. Open browser or device
3. Go to Check-in screen
4. Submit a check-in
5. Go to Firebase Console → Firestore
6. Check if new document appears in `checkins` collection

✅ If you see your data in Firestore, you're connected!

## Firebase Pricing

- **Firestore**: Free tier includes:
  - 1 GB storage
  - 50,000 reads/day
  - 20,000 writes/day
  - 20,000 deletes/day

- For production apps, consider:
  - Enabling billing
  - Setting up proper authentication
  - Implementing rate limiting

## Troubleshooting

### Error: "Permission denied"
- Check Firestore security rules (allow `read, write: if true`)
- Verify Firebase credentials in `.env.local`

### Error: "Firebase not initialized"
- Make sure `.env.local` has all required fields
- Restart app with `expo start -c`

### No data in Firestore after submit
- Check device internet connection
- Verify Firebase project ID matches
- Check browser console for errors
- Check Firestore rules are set to allow writes

### Collections not appearing
- Make sure collections are created (follow Step 4)
- Manually create documents if needed
- Check that auto-ID is enabled

## Next Steps

1. ✅ Project created
2. ✅ Firestore setup
3. ✅ Credentials configured
4. ✅ Security rules applied
5. Ready to deploy!

## Helpful Links

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Console](https://console.firebase.google.com/)
