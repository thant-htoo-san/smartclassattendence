import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { CheckInRecord } from '../models/CheckInRecord';
import { CheckOutRecord } from '../models/CheckOutRecord';
import { useAttendance } from '../hooks/useAttendance';
import { FirebaseService } from '../services/FirebaseService';
import { useAuthContext } from './AuthContext';

interface AttendanceContextType {
  checkIns: CheckInRecord[];
  checkOuts: CheckOutRecord[];
  syncUnsyncedRecords: () => Promise<void>;
  saveCheckIn: (record: CheckInRecord) => Promise<boolean>;
  saveCheckOut: (record: CheckOutRecord) => Promise<boolean>;
  loading: boolean;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [checkOuts, setCheckOuts] = useState<CheckOutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoadedOnce = useRef(false);
  const { user } = useAuthContext();
  const { saveCheckIn, saveCheckOut, syncUnsyncedRecords } = useAttendance();

  const loadData = useCallback(async () => {
    if (!user) {
      setCheckIns([]);
      setCheckOuts([]);
      setLoading(false);
      hasLoadedOnce.current = false;
      return;
    }

    if (!hasLoadedOnce.current) {
      setLoading(true);
    }

    try {
      const [ins, outs] = await Promise.all([
        FirebaseService.getCheckInsByUser(user.uid),
        FirebaseService.getCheckOutsByUser(user.uid),
      ]);
      setCheckIns(ins);
      setCheckOuts(outs);
    } catch (error) {
      console.error('Error loading attendance data:', error);
    } finally {
      hasLoadedOnce.current = true;
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();

    const syncInterval = setInterval(() => {
      syncUnsyncedRecords();
      loadData();
    }, 60000);

    return () => clearInterval(syncInterval);
  }, [loadData, syncUnsyncedRecords]);

  const handleSaveCheckIn = async (record: CheckInRecord): Promise<boolean> => {
    const result = await saveCheckIn(record);
    if (result) {
      await loadData();
    }
    return result;
  };

  const handleSaveCheckOut = async (record: CheckOutRecord): Promise<boolean> => {
    const result = await saveCheckOut(record);
    if (result) {
      await loadData();
    }
    return result;
  };

  const value: AttendanceContextType = {
    checkIns,
    checkOuts,
    syncUnsyncedRecords,
    saveCheckIn: handleSaveCheckIn,
    saveCheckOut: handleSaveCheckOut,
    loading,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendanceContext = (): AttendanceContextType => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendanceContext must be used within AttendanceProvider');
  }
  return context;
};
