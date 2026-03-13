import AsyncStorage from '@react-native-async-storage/async-storage';
import { CheckInRecord } from '../models/CheckInRecord';
import { CheckOutRecord } from '../models/CheckOutRecord';

const CHECKINS_KEY = '@smartclass_checkins';
const CHECKOUTS_KEY = '@smartclass_checkouts';

export class StorageService {
  // Check-in operations
  static async saveCheckIn(record: CheckInRecord): Promise<void> {
    try {
      const existing = await this.getAllCheckIns();
      const updated = [...existing, record];
      await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving check-in:', error);
      throw error;
    }
  }

  static async getAllCheckIns(): Promise<CheckInRecord[]> {
    try {
      const data = await AsyncStorage.getItem(CHECKINS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving check-ins:', error);
      return [];
    }
  }

  static async getUnsyncedCheckIns(): Promise<CheckInRecord[]> {
    try {
      const all = await this.getAllCheckIns();
      return all.filter((record) => !record.synced);
    } catch (error) {
      console.error('Error retrieving unsynced check-ins:', error);
      return [];
    }
  }

  static async markCheckInSynced(id: string): Promise<void> {
    try {
      const all = await this.getAllCheckIns();
      const updated = all.map((record) =>
        record.id === id ? { ...record, synced: true } : record
      );
      await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking check-in as synced:', error);
      throw error;
    }
  }

  // Check-out operations
  static async saveCheckOut(record: CheckOutRecord): Promise<void> {
    try {
      const existing = await this.getAllCheckOuts();
      const updated = [...existing, record];
      await AsyncStorage.setItem(CHECKOUTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving check-out:', error);
      throw error;
    }
  }

  static async getAllCheckOuts(): Promise<CheckOutRecord[]> {
    try {
      const data = await AsyncStorage.getItem(CHECKOUTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error retrieving check-outs:', error);
      return [];
    }
  }

  static async getUnsyncedCheckOuts(): Promise<CheckOutRecord[]> {
    try {
      const all = await this.getAllCheckOuts();
      return all.filter((record) => !record.synced);
    } catch (error) {
      console.error('Error retrieving unsynced check-outs:', error);
      return [];
    }
  }

  static async markCheckOutSynced(id: string): Promise<void> {
    try {
      const all = await this.getAllCheckOuts();
      const updated = all.map((record) =>
        record.id === id ? { ...record, synced: true } : record
      );
      await AsyncStorage.setItem(CHECKOUTS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error marking check-out as synced:', error);
      throw error;
    }
  }

  // Clear all data
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([CHECKINS_KEY, CHECKOUTS_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }
}
