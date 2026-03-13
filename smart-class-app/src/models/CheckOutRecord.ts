export interface CheckOutRecord {
  id: string;
  userId: string;
  studentId: string;
  qrCodeValue: string;
  checkOutTime: number;
  gpsLatitude: number;
  gpsLongitude: number;
  learnedTopic: string;
  feedback: string;
  synced: boolean;
}

export const createCheckOutRecord = (
  userId: string,
  studentId: string,
  qrCodeValue: string,
  gpsLatitude: number,
  gpsLongitude: number,
  learnedTopic: string,
  feedback: string
): CheckOutRecord => {
  return {
    id: `checkout-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    studentId,
    qrCodeValue,
    checkOutTime: Date.now(),
    gpsLatitude,
    gpsLongitude,
    learnedTopic,
    feedback,
    synced: false,
  };
};
