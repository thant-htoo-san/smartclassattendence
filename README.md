📚 Smart Class Check-in & Learning Reflection App
A cross-platform React Native mobile application built with Expo that enables students to check in to class using GPS location and QR code scanning, while collecting learning reflections before and after class sessions.

🎯 Features
✅ Class Check-in - Students scan QR code, capture GPS location, and fill pre-class reflection form
🏁 Class Completion - Students scan QR code, capture GPS location, and submit post-class feedback
📱 Cross-platform - Runs on Web, iOS, and Android via Expo
☁️ Firebase Firestore Integration - Real-time cloud sync of attendance data
📦 Offline-First - AsyncStorage local caching with periodic sync
🎨 Clean UI - Intuitive, mobile-first user interface
🔒 Type-Safe - Full TypeScript implementation
🛠️ Tech Stack
React Native with Expo
React Navigation for routing
TypeScript for type safety
Formik + Yup for forms and validation
Firebase Firestore for cloud storage
AsyncStorage for local storage
Expo Camera & Barcode Scanner for QR scanning
Expo Location for GPS capture
📋 Prerequisites
Node.js >= 16.0.0
npm or yarn
Expo CLI: npm install -g expo-cli
Firebase project with Firestore enabled
⚙️ Setup Instructions
1. Clone or Extract Project
cd smart-class-app
2. Install Dependencies
npm install
# or
yarn install
3. Configure Firebase
Create a .env.local file in the root directory with your Firebase credentials:

EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
Or update src/config/firebase.ts directly with your credentials.

4. Firebase Firestore Schema
Create the following collections in Firestore:

checkins collection
{
  studentId: string,
  qrCodeValue: string,
  checkInTime: timestamp,
  gpsLatitude: number,
  gpsLongitude: number,
  previousTopic: string,
  expectedTopic: string,
  mood: number (1-5),
  synced: boolean
}
checkouts collection
{
  studentId: string,
  qrCodeValue: string,
  checkOutTime: timestamp,
  gpsLatitude: number,
  gpsLongitude: number,
  learnedTopic: string,
  feedback: string,
  synced: boolean
}
🚀 Running the App
Start Development Server
npm start
# or
npx expo start
Run on Web
npm run web
# or
npx expo start --web
Press w in the terminal or navigate to http://localhost:19006

Run on iOS (macOS only)
npm run ios
# or
npx expo start --ios
Run on Android
npm run android
# or
npx expo start --android
📁 Project Structure
smart-class-app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Main navigation
│   │   ├── CheckInScreen.tsx      # Pre-class check-in
│   │   └── FinishScreen.tsx       # Post-class completion
│   ├── services/
│   │   ├── FirebaseService.ts     # Firebase operations
│   │   ├── LocationService.ts     # GPS location handling
│   │   └── StorageService.ts      # AsyncStorage operations
│   ├── models/
│   │   ├── CheckInRecord.ts       # Check-in data model
│   │   └── CheckOutRecord.ts      # Check-out data model
│   ├── context/
│   │   └── AttendanceContext.tsx  # Global state management
│   ├── components/
│   │   ├── QRScanner.tsx          # QR code scanner UI
│   │   ├── LocationCapture.tsx    # GPS capture UI
│   │   └── MoodSelector.tsx       # Mood selector UI
│   ├── hooks/
│   │   ├── useLocation.ts         # Location hook
│   │   ├── useQRScanner.ts        # QR scanner hook
│   │   └── useAttendance.ts       # Attendance submission hook
│   ├── config/
│   │   └── firebase.ts            # Firebase configuration
│   └── App.tsx
├── app.json                        # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
🔄 Data Flow
Check-in Process

User taps "Check-in"
Scans QR code
Captures GPS location
Fills pre-class form
Data saved to AsyncStorage
Automatic Firebase sync attempt
Offline-First Sync

Records stored in AsyncStorage immediately
Marked as synced: false
Background task attempts Firebase upload every 60s
Once synced, marked as synced: true
User sees status indicator (📦 Local vs ☁️ Synced)
📝 Form Validation
Student ID: Required, non-empty
QR Code: Must be scanned before submission
GPS Location: Must be captured before submission
Mood: Integer 1-5
Text Fields: All required, non-empty
⚠️ Error Handling
Camera Permission Denied: User gets alert with option to retry
Location Permission Denied: User gets alert with retry button
Network Error: Records queued locally, retried automatically
QR Scan Timeout: Can rescan or skip
GPS Timeout: Can retry or use manual fallback
🔐 Permissions
Android (android/app/src/main/AndroidManifest.xml)
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
iOS (ios/Runner/Info.plist)
<key>NSCameraUsageDescription</key>
<string>Camera is required to scan class QR codes.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location is required to verify class attendance.</string>
🎨 UI Components
HomeScreen
List of recent submissions with sync status
Statistics (check-ins, check-outs count)
Navigation buttons
CheckInScreen
QR code scanner
GPS location capture
Form fields: Student ID, Previous topic, Expected topic, Mood
Submit button with validation
FinishScreen
QR code scanner
GPS location capture
Form fields: Student ID, Learned topic, Feedback
Submit button with validation
💾 Storage
AsyncStorage Keys
@smartclass_checkins - Array of check-in records
@smartclass_checkouts - Array of check-out records
Firebase Collections
checkins - Synced check-in records
checkouts - Synced check-out records
🔄 Sync Mechanism
On Submit: Save to AsyncStorage, attempt Firebase upload
On App Launch: Check for unsynced records, retry sync
Periodic: Every 60 seconds, retry unsynced records
Manual: User can manually trigger sync via context
🐛 Troubleshooting
QR Scanner Not Working
Check camera permissions in device settings
Ensure good lighting when scanning
Try rescanning
Location Not Captured
Enable location services on device
Grant location permissions to app
Ensure GPS signal is available (may take time indoors)
Try capturing again
Firebase Not Syncing
Verify Firebase credentials in src/config/firebase.ts
Check internet connection
Verify Firestore collections exist
Check Firebase security rules allow writes
App Won't Start
Delete node_modules and reinstall: npm install
Clear cache: expo start -c
Check Node.js version >= 16
📱 Deployment
Deploy to Firebase Hosting
firebase init
firebase deploy
Deploy with Expo
eas build --platform all
eas submit --platform ios
eas submit --platform android
💡 Tips & Best Practices
Test on Real Device: Emulators may have limited camera/GPS
Use HTTPS: For production Firebase projects
Test Offline: Disable internet to verify offline-first behavior
Monitor Sync: Check recent records to verify sync status
Regular Backups: Export Firestore data periodically
📄 License
This project is part of Mobile Application Development course (1305216).

👨‍💻 AI Usage Report
AI Tools Used: - Claude / ChatGPT for code generation and architecture

Generated by AI: - Project structure and scaffolding - Service layer (Firebase, Location, Storage, QR) - UI components structure - Form validation patterns

Manually Implemented/Modified: - Feature-specific business logic - Context API state management - Offline-first sync mechanism - Error handling and user feedback - UI styling and layout (custom Stylesheet) - Form submission workflows - Navigation setup

For support or questions, refer to the official documentation: - Expo Documentation - React Native Documentation - Firebase Documentation - React Navigation Documentation
