import { useCallback } from 'react';
import { FirebaseService } from '../services/FirebaseService';
import { CheckInRecord } from '../models/CheckInRecord';
import { CheckOutRecord } from '../models/CheckOutRecord';
import { useAuthContext } from '../context/AuthContext';

export const useAttendance = () => {
  const { user } = useAuthContext();

  const saveCheckIn = useCallback(async (record: CheckInRecord) => {
    if (!user) {
      console.error('Cannot save check-in without authenticated user');
      return false;
    }

    try {
      return await FirebaseService.uploadCheckIn({ ...record, synced: true });
    } catch (error) {
      console.error('Error saving check-in:', error);
      return false;
    }
  }, [user]);

  const saveCheckOut = useCallback(async (record: CheckOutRecord) => {
    if (!user) {
      console.error('Cannot save check-out without authenticated user');
      return false;
    }

    try {
      return await FirebaseService.uploadCheckOut({ ...record, synced: true });
    } catch (error) {
      console.error('Error saving check-out:', error);
      return false;
    }
  }, [user]);

  const syncUnsyncedRecords = useCallback(async () => {
    return;
  }, []);

  return {
    saveCheckIn,
    saveCheckOut,
    syncUnsyncedRecords,
  };
};
