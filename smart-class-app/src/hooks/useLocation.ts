import { useEffect, useState } from 'react';
import { LocationService } from '../services/LocationService';

export const useLocation = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const captureLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const loc = await LocationService.getCurrentLocation();
      setLocation(loc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    captureLocation,
  };
};
