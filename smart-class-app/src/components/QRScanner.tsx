import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Camera } from 'expo-camera';

interface QRScannerProps {
  onQRCodeRead: (data: string) => void;
  loading?: boolean;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onQRCodeRead, loading = false }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState<boolean>(true);

  // Keeps JSX typing stable across editor TS/react-native type combinations.
  const ScannerComponent = Camera as unknown as React.ComponentType<any>;

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  useEffect(() => {
    const initializeCamera = async () => {
      const available = await Camera.isAvailableAsync();
      setCameraAvailable(available);
      await requestCameraPermission();
    };

    initializeCamera();
  }, []);

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);
    onQRCodeRead(data);
  };

  const handleOpenSettings = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        'Camera Permission',
        'Allow camera access in your browser site permissions, then reload the page.'
      );
      return;
    }

    try {
      await Linking.openSettings();
    } catch {
      Alert.alert('Error', 'Unable to open settings');
    }
  };

  if (!cameraAvailable) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera is not available on this device/browser.</Text>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.settingsButton]}
          onPress={handleOpenSettings}
        >
          <Text style={styles.buttonText}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      <ScannerComponent
        onBarCodeScanned={scanned || loading ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{ barCodeTypes: ['qr'] }}
        style={styles.scanner}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Position QR code in frame</Text>
        </View>
      </ScannerComponent>
      {scanned && (
        <TouchableOpacity style={styles.resetButton} onPress={() => setScanned(false)}>
          <Text style={styles.resetButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  settingsButton: {
    backgroundColor: '#FF9800',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanner: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderRadius: 12,
  },
  scanText: {
    position: 'absolute',
    bottom: 40,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  resetButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF9800',
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
