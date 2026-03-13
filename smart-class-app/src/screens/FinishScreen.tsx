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
import { createCheckOutRecord } from '../models/CheckOutRecord';
import { QRScanner } from '../components/QRScanner';
import { LocationCapture } from '../components/LocationCapture';

interface FinishScreenProps {
  navigation: any;
}

const validationSchema = Yup.object().shape({
  studentId: Yup.string().required('Student ID is required'),
  learnedTopic: Yup.string().required('What you learned is required'),
  feedback: Yup.string().required('Feedback is required'),
});

export const FinishScreen: React.FC<FinishScreenProps> = ({ navigation }) => {
  const [showQRScanner, setShowQRScanner] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { location, loading: locationLoading, error: locationError, captureLocation } = useLocation();
  const { qrCode, scanned, handleQRCodeRead, resetQR } = useQRScanner();
  const { saveCheckOut } = useAttendanceContext();
  const { user } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      studentId: '',
      learnedTopic: '',
      feedback: '',
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
      const record = createCheckOutRecord(
        user.uid,
        values.studentId,
        qrCode,
        location.latitude,
        location.longitude,
        values.learnedTopic,
        values.feedback
      );

      const success = await saveCheckOut(record);

      if (success) {
        formik.resetForm();
        resetQR();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert(
          'Save failed',
          'Class completion was not stored in Firebase. Please verify Firestore rules and try again.'
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
          <Text style={styles.title}>🏁 Finish Class</Text>
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
            style={[styles.input, styles.textArea]}
            placeholder="What did you learn today?"
            value={formik.values.learnedTopic}
            onChangeText={formik.handleChange('learnedTopic')}
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={3}
          />
          {formik.errors.learnedTopic && (
            <Text style={styles.errorText}>{formik.errors.learnedTopic}</Text>
          )}

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Feedback about the class / instructor"
            value={formik.values.feedback}
            onChangeText={formik.handleChange('feedback')}
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={3}
          />
          {formik.errors.feedback && (
            <Text style={styles.errorText}>{formik.errors.feedback}</Text>
          )}

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={() => formik.handleSubmit()}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Completion</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: '#FF9800',
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
    borderLeftColor: '#FF9800',
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
  textArea: {
    textAlignVertical: 'top',
    minHeight: 80,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: '#FF9800',
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
