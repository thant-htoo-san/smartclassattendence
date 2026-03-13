import { useState } from 'react';

export const useQRScanner = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  const handleQRCodeRead = (data: string) => {
    setQrCode(data);
    setScanned(true);
  };

  const resetQR = () => {
    setQrCode(null);
    setScanned(false);
  };

  return {
    qrCode,
    scanned,
    handleQRCodeRead,
    resetQR,
  };
};
