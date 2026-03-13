export interface CheckInRecord {
  id: string;
  userId: string;
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

export const createCheckInRecord = (
  userId: string,
  studentId: string,
  qrCodeValue: string,
  gpsLatitude: number,
  gpsLongitude: number,
  previousTopic: string,
  expectedTopic: string,
  mood: number
): CheckInRecord => {
  return {
    id: `checkin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    studentId,
    qrCodeValue,
    checkInTime: Date.now(),
    gpsLatitude,
    gpsLongitude,
    previousTopic,
    expectedTopic,
    mood,
    synced: false,
  };
};
