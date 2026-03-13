import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

interface LocationCaptureProps {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  onCapture: () => void;
  error?: string | null;
}

export const LocationCapture: React.FC<LocationCaptureProps> = ({
  latitude,
  longitude,
  loading,
  onCapture,
  error,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>📍 GPS Location</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {latitude !== null && longitude !== null ? (
          <View style={styles.locationInfo}>
            <Text style={styles.label}>Latitude:</Text>
            <Text style={styles.value}>{latitude.toFixed(6)}</Text>

            <Text style={styles.label}>Longitude:</Text>
            <Text style={styles.value}>{longitude.toFixed(6)}</Text>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>✓ Location captured</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.placeholder}>Location not captured yet</Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onCapture}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>📍 Capture Location</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#2196F3',
    fontFamily: 'monospace',
    marginTop: 2,
  },
  placeholder: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 12,
  },
  locationInfo: {
    marginVertical: 12,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  statusText: {
    color: '#2E7D32',
    fontWeight: '600',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 12,
    backgroundColor: '#ffebee',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});
