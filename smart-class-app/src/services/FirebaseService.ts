import { db, isFirebaseConfigured } from '../config/firebase';
import { FirebaseError } from 'firebase/app';
import {
  doc,
  collection,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { CheckInRecord } from '../models/CheckInRecord';
import { CheckOutRecord } from '../models/CheckOutRecord';

export class FirebaseService {
  private static isConfigured(): boolean {
    if (isFirebaseConfigured) {
      return true;
    }

    console.error(
      'Firebase is not configured. Set EXPO_PUBLIC_FIREBASE_* in .env.local and restart Expo.'
    );
    return false;
  }

  private static logFirestoreError(action: string, error: unknown): void {
    if (error instanceof FirebaseError && error.code === 'permission-denied') {
      console.error(
        `${action} failed: Missing or insufficient Firestore permissions. ` +
          'Update Firestore rules to allow authenticated users to read/write their own userId records.'
      );
      return;
    }

    console.error(`${action} failed:`, error);
  }

  static async uploadCheckIn(record: CheckInRecord): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      await setDoc(doc(db, 'checkins', record.id), {
        ...record,
        checkInTime: Timestamp.fromMillis(record.checkInTime),
      });
      return true;
    } catch (error) {
      this.logFirestoreError('Check-in upload', error);
      return false;
    }
  }

  static async uploadCheckOut(record: CheckOutRecord): Promise<boolean> {
    if (!this.isConfigured()) {
      return false;
    }

    try {
      await setDoc(doc(db, 'checkouts', record.id), {
        ...record,
        checkOutTime: Timestamp.fromMillis(record.checkOutTime),
      });
      return true;
    } catch (error) {
      this.logFirestoreError('Check-out upload', error);
      return false;
    }
  }

  static async getCheckInsByUser(userId: string): Promise<CheckInRecord[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const q = query(collection(db, 'checkins'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map((snapshot) => ({
        ...(snapshot.data() as Omit<CheckInRecord, 'checkInTime'>),
        id: snapshot.id,
        checkInTime: (snapshot.data().checkInTime as Timestamp).toMillis(),
      }));
      return records.sort((a, b) => b.checkInTime - a.checkInTime);
    } catch (error) {
      this.logFirestoreError('Check-ins fetch', error);
      return [];
    }
  }

  static async getCheckOutsByUser(userId: string): Promise<CheckOutRecord[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const q = query(collection(db, 'checkouts'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const records = querySnapshot.docs.map((snapshot) => ({
        ...(snapshot.data() as Omit<CheckOutRecord, 'checkOutTime'>),
        id: snapshot.id,
        checkOutTime: (snapshot.data().checkOutTime as Timestamp).toMillis(),
      }));
      return records.sort((a, b) => b.checkOutTime - a.checkOutTime);
    } catch (error) {
      this.logFirestoreError('Check-outs fetch', error);
      return [];
    }
  }
}
