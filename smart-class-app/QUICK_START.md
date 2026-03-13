# Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd smart-class-app
npm install
```

### Step 2: Add Firebase Config
Create `.env.local`:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 3: Create Firestore Collections
1. Go to Firebase Console
2. Create two collections:
   - `checkins`
   - `checkouts`

### Step 4: Run the App
```bash
npm start
```

Press `w` for web, `i` for iOS, or `a` for Android.

---

## 📦 Deliverable Checklist

- ✅ Complete source code (clean architecture)
- ✅ `package.json` with all dependencies
- ✅ Firebase configuration template
- ✅ README.md with full documentation
- ✅ Expo configuration (`app.json`)
- ✅ TypeScript setup (`tsconfig.json`)
- ✅ AI Usage Report
- ✅ Navigation & routing setup
- ✅ All screens fully implemented
- ✅ Services layer complete
- ✅ Offline-first sync
- ✅ Form validation with Formik + Yup
- ✅ QR scanning with Expo Barcode Scanner
- ✅ GPS location capture
- ✅ Context-based state management
- ✅ Reusable React hooks
- ✅ Responsive UI components
- ✅ Error handling
- ✅ Loading states

---

## 🎯 Next Steps (Optional Enhancements)

1. **Deploy to Expo**: `eas build --platform all`
2. **Add Authentication**: Firebase Auth integration
3. **Create Admin Dashboard**: Firebase Hosting web portal
4. **Add Analytics**: Firebase Analytics
5. **Push Notifications**: Firebase Cloud Messaging

---

## 📚 Project Structure at a Glance

```
smart-class-app/
├── src/
│   ├── screens/          # 3 screens: Home, CheckIn, Finish
│   ├── services/         # 3 services: Firebase, Location, Storage
│   ├── models/           # 2 models: CheckIn, CheckOut
│   ├── components/       # 3 components: QRScanner, Location, Mood
│   ├── hooks/            # 3 hooks: useLocation, useQRScanner, useAttendance
│   ├── context/          # 1 context: Attendance global state
│   ├── config/           # Firebase config
│   └── App.tsx
├── app.json              # Expo config
├── package.json
├── tsconfig.json
├── README.md
├── AI_USAGE_REPORT.md
└── .gitignore
```

---

## 🧪 Testing Checklist

- [ ] App starts without errors
- [ ] Home screen displays correctly
- [ ] Check-in form validates
- [ ] QR scanner opens
- [ ] GPS location captures
- [ ] Mood selector works
- [ ] Data saves to AsyncStorage
- [ ] Finish screen workflow complete
- [ ] Recent records display on home
- [ ] Stats show correct counts
- [ ] Sync badge shows status
- [ ] Navigation works smoothly
- [ ] Forms clear after submission
- [ ] Error messages display clearly

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Cannot find module 'firebase'` | Run `npm install` |
| QR scanner not working | Check camera permissions in device settings |
| GPS not capturing | Enable location services, try in outdoor area |
| Firestore not syncing | Verify Firebase config in `.env.local` |
| App won't start | Run `expo start -c` to clear cache |

---

## 📱 Platform-Specific Notes

### Web
- QR scanner works via device camera
- GPS shows mock location (browser dependent)
- AsyncStorage persists in browser storage

### iOS
- Requires camera permission request
- Requires location permission request
- GPS works accurately

### Android
- Requires dangerous permissions in manifest
- Requires runtime permission requests
- GPS works accurately

---

## 💾 Firestore Security Rules (Optional)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read/write (NOT RECOMMENDED FOR PRODUCTION)
    match /checkins/{document=**} {
      allow read, write: if true;
    }
    match /checkouts/{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

For detailed documentation, see [README.md](./README.md)
