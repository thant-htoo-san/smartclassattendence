# Product Requirement Document (PRD)

## Product Name

Smart Class Check-in & Learning Reflection App

---

# 1. Problem Statement

Universities need a reliable way to verify student attendance and encourage engagement during in-person classes. Traditional attendance methods such as manual roll calls or sign-in sheets are prone to errors and do not capture students’ learning experiences.

This project aims to build a **mobile application** that allows students to check in to class using **GPS location verification and QR code scanning**, while also collecting **learning reflections before and after class**. The system helps instructors confirm student presence and gain insights into students’ learning outcomes.

---

# 2. Target Users

**Primary Users**

* University students attending in-person classes

**Secondary Users**

* Instructors who want to track attendance and collect learning reflections

---

# 3. Core Features (MVP)

### 1. Class Check-in (Before Class)

Students can confirm their attendance by:

* Pressing **Check-in**
* Scanning the **class QR code**
* Automatically recording **GPS location**
* Recording **timestamp**

Students must complete a short reflection form:

* Topic covered in the **previous class**
* Topic they **expect to learn today**
* **Mood before class** Mood scale: (1--5)

| Score | Mood |
|------|------|
| 1 | 😡 Very negative |
| 2 | 🙁 Negative |
| 3 | 😐 Neutral |
| 4 | 🙂 Positive |
| 5 | 😄 Very positive |



---

### 2. Class Completion (After Class)

At the end of the class, students must:

* Press **Finish Class**
* Scan the **QR code again**
* Record **GPS location**
* Record **timestamp**

Students also submit:

* **What they learned today**
* **Feedback about the class**

---

### 3. Local Data Storage

All attendance and reflection data will be stored locally in the mobile device using:

* **SQLite** or
* **Local storage**

This allows the application to work even without an internet connection.

---

### 4. Firebase Integration (Optional Enhancement)

Firebase may be used for:

* Hosting a demo web version of the application
* Syncing attendance and reflection data
* Providing a simple web interface to view submitted records

---

# 4. Application Screens

### 1. Home Screen

Main navigation screen containing:

* **Check-in button**
* **Finish Class button**

---

### 2. Check-in Screen

Allows students to:

* Scan the **QR code**
* Capture **GPS location**
* Fill in the **pre-class reflection form**
* Submit attendance

---

### 3. Finish Class Screen

Allows students to:

* Scan the **QR code**
* Capture **GPS location**
* Fill in the **post-class reflection form**
* Submit learning feedback

---

# 5. User Flow

1. Student opens the mobile application.
2. The **Home Screen** appears.
3. Before class:

   * Student taps **Check-in**
   * QR code is scanned
   * GPS location and timestamp are recorded
   * Student fills the pre-class reflection form
   * Data is saved locally.
4. After class:

   * Student taps **Finish Class**
   * QR code is scanned again
   * GPS location and timestamp are recorded
   * Student submits learning reflection and feedback
   * Data is saved locally and optionally synced to Firebase.

---

# 6. Data Fields

## Check-in Record

| Field                 | Type          |
| --------------------- | ------------- |
| studentId             | String        |
| classId / qrCodeValue | String        |
| checkInTime           | Timestamp     |
| gpsLatitude           | Double        |
| gpsLongitude          | Double        |
| previousTopic         | Text          |
| expectedTopic         | Text          |
| mood                  | Integer (1–5) |

---

## Class Completion Record

| Field                 | Type      |
| --------------------- | --------- |
| studentId             | String    |
| classId / qrCodeValue | String    |
| checkOutTime          | Timestamp |
| gpsLatitude           | Double    |
| gpsLongitude          | Double    |
| learnedTopic          | Text      |
| feedback              | Text      |

---

# 7. Technology Stack

**Frontend**

* React Native (Mobile Application)

**Programming Language**

* JavaScript / TypeScript

**Device Features**

* QR Code Scanner library (e.g., `react-native-vision-camera`, `vision-camera-code-scanner`)
* Location services (e.g., `react-native-geolocation-service`)

**Local Storage**

* AsyncStorage (local device storage)
* Firebase Firestore (cloud sync)

**Cloud & Deployment**

* Firebase Hosting (demo web component)
* Expo (React Native deployment)

**Development Tools**

* Node.js + npm/yarn
* Android Studio or VS Code
* GitHub for version control
* Expo CLI

---

# 8. Success Criteria

The application will be considered successful if:

* Students can successfully **check in and finish class**
* **QR code scanning and GPS location capture** work correctly
* Reflection forms store data properly
* The application runs smoothly on a mobile device
* A demo component is successfully **deployed using Firebase**

---
