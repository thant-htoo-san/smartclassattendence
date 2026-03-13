# React Native MVP Development Brief

You are a **senior React Native architect** tasked with building a **production-ready MVP** for a **Smart Class Check-in & Learning Reflection App**.

The application must run on **Web, iOS, and Android** using Expo and React Native Web.

---

# 🎯 Core Requirements

Build a cross-platform mobile application that allows students to:

1. **Check in to class** using GPS location and QR code scanning
2. Submit **pre-class reflection**
3. Submit **post-class reflection**
4. Store data locally and **sync with Firebase Firestore when online**

---

# 📋 Tech Stack (Required)

The implementation must use **Expo-compatible libraries**.

**Framework**

* React Native with Expo
* React Native Web (for browser support)

**Language**

* TypeScript (strict mode)

**Navigation**

* React Navigation (Stack navigation)

**Database**

* Firebase Firestore (cloud sync)
* AsyncStorage (offline-first local cache)

**Forms & Validation**

* Formik
* Yup

**QR Code Scanning**

* expo-camera
* expo-barcode-scanner

**Location Services**

* expo-location

**State Management**

* React Context API

---

# 🏗️ Architecture Requirements

The project must follow **clean architecture principles** with separation of concerns.

## Folder Structure

```
app/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CheckInScreen.tsx
│   │   ├── FinishScreen.tsx
│   │
│   ├── services/
│   │   ├── FirebaseService.ts
│   │   ├── LocationService.ts
│   │   ├── QRService.ts
│   │   ├── StorageService.ts
│   │
│   ├── models/
│   │   ├── CheckInRecord.ts
│   │   ├── CheckOutRecord.ts
│   │
│   ├── context/
│   │   ├── AttendanceContext.tsx
│   │
│   ├── components/
│   │   ├── QRScanner.tsx
│   │   ├── LocationCapture.tsx
│   │   ├── MoodSelector.tsx
│   │
│   ├── hooks/
│   │   ├── useLocation.ts
│   │   ├── useQRScanner.ts
│   │   ├── useAttendance.ts
│   │
│   ├── config/
│   │   ├── firebase.ts
│
│   └── App.tsx
```

---

# ⚙️ Design Patterns

The codebase must follow these patterns:

1. **Separation of Concerns**

   * Services handle Firebase, storage, location, and QR logic

2. **Custom Hooks**

   * Encapsulate reusable logic (location, QR scanning, attendance submission)

3. **Context API**

   * Global state for attendance records and sync status

4. **Offline-First Architecture**

   * Data stored in AsyncStorage
   * Sync to Firestore when internet connection is available

5. **Type Safety**

   * Full TypeScript implementation
   * No `any` types

6. **Error Handling**

   * Handle camera, GPS, and network errors gracefully

---

# ⚙️ Functional Requirements

## Home Screen

Display two primary actions:

* **Check-in**
* **Finish Class**

Optional feature:

* List of recent submissions

UI requirements:

* Clean minimal layout
* Large touch targets

---

## Check-in Screen

Flow:

1. Request **camera permission**
2. Start **QR code scanner**
3. Capture **GPS location automatically**
4. Display form after QR scan:

Form fields:

* Student ID (text input)
* Previous class topic (text input)
* Expected topic today (text input)
* Mood selector (1–5)

Submit action:

* Save to **AsyncStorage**
* Attempt **Firestore sync**
* Show success message
* Navigate back to Home

---

## Finish Class Screen

Flow:

1. Request **camera permission**
2. Start **QR scanner**
3. Capture **GPS location**
4. Display form after QR scan

Form fields:

* Student ID
* What the student learned today
* Feedback about the class

Submit action:

* Save locally
* Sync with Firestore
* Show success message
* Navigate to Home

---

# 🔐 Data Models (TypeScript)

```typescript
export interface CheckInRecord {
  id: string;
  studentId: string;
  qrCodeValue: string;
  checkInTime: number;
  gpsLatitude: number;
  gpsLongitude: number;
  previousTopic: string;
  expectedTopic: string;
  mood: number;
  synced: boolean;
}

export interface CheckOutRecord {
  id: string;
  studentId: string;
  qrCodeValue: string;
  checkOutTime: number;
  gpsLatitude: number;
  gpsLongitude: number;
  learnedTopic: string;
  feedback: string;
  synced: boolean;
}
```

---

# 🔄 Offline Sync Logic

The system must implement **offline-first behavior**.

Workflow:

1. When a submission occurs:

   * Save record to AsyncStorage
   * Attempt Firestore upload

2. If network fails:

   * Mark record `synced: false`

3. On app launch:

   * Retry syncing unsynced records

4. Periodic retry:

   * Every 60 seconds

---

# 🛡️ Non-Functional Requirements

## Permissions

Handle gracefully:

Camera permission
Location permission

If denied:

* Display alert
* Provide retry option

---

## Validation

All forms must enforce:

* Student ID required
* GPS captured before submit
* QR code scanned before submit
* Mood between 1–5

---

## Error Handling

Handle:

Network failure
Camera failure
Location timeout

Fallback options:

Manual QR entry
Retry location capture

---

## Performance

* Lazy load screens
* Use `useMemo` and `useCallback`
* Use `FlatList` for lists

---

## UX

* Loading indicators during submission
* Disable submit button while processing
* Success/error toast notifications
* Clear forms after successful submission

---

# 📦 Deliverables

The generated project must include:

1. Complete source code
2. `package.json` with dependencies
3. Firebase configuration template
4. `README.md` including:

   * Setup instructions
   * Firebase configuration
   * Expo run commands
5. Working navigation setup
6. Fully implemented screens, services, and hooks

---

# 🚀 Implementation Strategy

Build the project in this order:

1. Models
2. Services
3. Hooks
4. Context
5. Components
6. Screens
7. App navigation

All code must be **fully functional and runnable** with:

```
npm install
npx expo start
```

Avoid placeholders and ensure the project runs on:

* Web
* iOS
* Android
