import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useLocation } from '../hooks/useLocation';
import { useQRScanner } from '../hooks/useQRScanner';
import { useAttendanceContext } from '../context/AttendanceContext';
import { useAuthContext } from '../context/AuthContext';
import { createCheckInRecord } from '../models/CheckInRecord';
import { QRScanner } from '../components/QRScanner';
import { LocationCapture } from '../components/LocationCapture';
import { MoodSelector } from '../components/MoodSelector';

interface CheckInScreenProps {
  navigation: any;
}

const validationSchema = Yup.object().shape({
  studentId: Yup.string().required('Student ID is required'),
  previousTopic: Yup.string().required('Previous topic is required'),
  expectedTopic: Yup.string().required('Expected topic is required'),
});

export const CheckInScreen: React.FC<CheckInScreenProps> = ({ navigation }) => {
  const [showQRScanner, setShowQRScanner] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mood, setMood] = useState(3);

  const { location, loading: locationLoading, error: locationError, captureLocation } = useLocation();
  const { qrCode, scanned, handleQRCodeRead, resetQR } = useQRScanner();
  const { saveCheckIn } = useAttendanceContext();
  const { user } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      studentId: '',
      previousTopic: '',
      expectedTopic: '',
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  async function handleSubmit(values: any) {
    if (!qrCode) {
      Alert.alert('Error', 'Please scan a QR code first');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please capture GPS location first');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit attendance.');
      return;
    }

    setSubmitting(true);

    try {
      const record = createCheckInRecord(
        user.uid,
        values.studentId,
        qrCode,
        location.latitude,
        location.longitude,
        values.previousTopic,
        values.expectedTopic,
        mood
      );

      const success = await saveCheckIn(record);

      if (success) {
        formik.resetForm();
        setMood(3);
        resetQR();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert(
          'Save failed',
          'Check-in was not stored in Firebase. Please verify Firestore rules and try again.'
        );
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  }

  if (showQRScanner && !scanned) {
    return (
      <View style={styles.scannerContainer}>
        <QRScanner onQRCodeRead={handleQRCodeRead} loading={false} />
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setShowQRScanner(false)}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>✅ Check-in</Text>
        </View>

        {/* QR Code Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QR Code</Text>
          {qrCode ? (
            <View style={styles.qrDisplay}>
              <Text style={styles.qrLabel}>QR Scanned:</Text>
              <Text style={styles.qrValue}>{qrCode}</Text>
              <TouchableOpacity
                style={styles.rescanButton}
                onPress={() => {
                  resetQR();
                  setShowQRScanner(true);
                }}
              >
                <Text style={styles.rescanButtonText}>Rescan QR Code</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => setShowQRScanner(true)}
            >
              <Text style={styles.scanButtonText}>📱 Start QR Scanner</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Location Section */}
        <LocationCapture
          latitude={location?.latitude ?? null}
          longitude={location?.longitude ?? null}
          loading={locationLoading}
          onCapture={captureLocation}
          error={locationError}
        />

        {/* Form Section */}
        <View style={styles.formSection}>
          <TextInput
            style={styles.input}
            placeholder="Student ID"
            value={formik.values.studentId}
            onChangeText={formik.handleChange('studentId')}
            placeholderTextColor="#ccc"
          />
          {formik.errors.studentId && (
            <Text style={styles.errorText}>{formik.errors.studentId}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Previous class topic"
            value={formik.values.previousTopic}
            onChangeText={formik.handleChange('previousTopic')}
            placeholderTextColor="#ccc"
          />
          {formik.errors.previousTopic && (
            <Text style={styles.errorText}>{formik.errors.previousTopic}</Text>
          )}

          <TextInput
            style={styles.input}
            placeholder="Expected topic today"
            value={formik.values.expectedTopic}
            onChangeText={formik.handleChange('expectedTopic')}
            placeholderTextColor="#ccc"
          />
          {formik.errors.expectedTopic && (
            <Text style={styles.errorText}>{formik.errors.expectedTopic}</Text>
          )}

          <MoodSelector value={mood} onChange={setMood} />

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={() => formik.handleSubmit()}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Check-in</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    backgroundColor: '#rgba(0, 0, 0, 0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  qrDisplay: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  qrLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  qrValue: {
    fontSize: 13,
    color: '#333',
    marginTop: 4,
    fontFamily: 'monospace',
  },
  rescanButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 6,
    alignItems: 'center',
  },
  rescanButtonText: {
    color: '#FF9800',
    fontWeight: '600',
    fontSize: 12,
  },
  formSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
