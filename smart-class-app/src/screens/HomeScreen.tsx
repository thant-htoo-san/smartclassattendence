import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useAttendanceContext } from '../context/AttendanceContext';
import { useAuthContext } from '../context/AuthContext';
import { CheckInRecord } from '../models/CheckInRecord';
import { CheckOutRecord } from '../models/CheckOutRecord';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { checkIns, checkOuts, loading } = useAttendanceContext();
  const { user, signOut } = useAuthContext();
  const [showRecent, setShowRecent] = useState(false);

  const allRecords = [
    ...checkIns.map((record) => ({
      ...record,
      type: 'checkin',
      timestamp: record.checkInTime,
    })),
    ...checkOuts.map((record) => ({
      ...record,
      type: 'checkout',
      timestamp: record.checkOutTime,
    })),
  ].sort((a, b) => b.timestamp - a.timestamp);

  const recentRecords = allRecords.slice(0, 5);

  const renderRecordItem = (item: any) => {
    const date = new Date(item.timestamp);
    const timeStr = date.toLocaleTimeString();
    const dateStr = date.toLocaleDateString();
    const type = item.type === 'checkin' ? 'Check-in' : 'Check-out';

    return (
      <View style={styles.recordItem}>
        <View style={styles.recordInfo}>
          <Text style={styles.recordType}>{type}</Text>
          <Text style={styles.recordStudent}>Student: {item.studentId}</Text>
          <Text style={styles.recordTime}>
            {dateStr} {timeStr}
          </Text>
          <Text style={styles.recordQR}>QR: {item.qrCodeValue}</Text>
        </View>
        <View
          style={[
            styles.syncBadge,
            item.synced ? styles.syncedBadge : styles.unsyncedBadge,
          ]}
        >
          <Text style={styles.syncText}>{item.synced ? '☁️ Synced' : '📦 Local'}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View>
            <Text style={styles.title}>📚 Smart Class</Text>
            <Text style={styles.subtitle}>Attendance & Reflection</Text>
            <Text style={styles.userText}>{user?.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              void signOut();
            }}
          >
            <Text style={styles.logoutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && (
        <View style={styles.syncBanner}>
          <ActivityIndicator size="small" color="#1565c0" />
          <Text style={styles.syncBannerText}>Syncing latest attendance...</Text>
        </View>
      )}

      <>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.buttonEmoji}>✅</Text>
            <Text style={styles.buttonText}>Check-in</Text>
            <Text style={styles.buttonSubtext}>Before Class</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Finish')}
          >
            <Text style={styles.buttonEmoji}>🏁</Text>
            <Text style={styles.buttonText}>Finish Class</Text>
            <Text style={styles.buttonSubtext}>After Class</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{checkIns.length}</Text>
            <Text style={styles.statLabel}>Check-ins</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{checkOuts.length}</Text>
            <Text style={styles.statLabel}>Check-outs</Text>
          </View>
        </View>

        {recentRecords.length > 0 && (
          <View style={styles.recentContainer}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>📋 Recent Records</Text>
              <TouchableOpacity onPress={() => setShowRecent(!showRecent)}>
                <Text style={styles.toggleText}>{showRecent ? '▼' : '▶'}</Text>
              </TouchableOpacity>
            </View>

            {showRecent && (
              <FlatList
                data={recentRecords}
                renderItem={({ item }) => renderRecordItem(item)}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                nestedScrollEnabled={false}
              />
            )}
          </View>
        )}
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  userText: {
    fontSize: 11,
    color: '#607d8b',
    marginTop: 6,
  },
  logoutButton: {
    backgroundColor: '#eceff1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoutButtonText: {
    color: '#455a64',
    fontWeight: '600',
    fontSize: 12,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#e3f2fd',
  },
  syncBannerText: {
    color: '#1565c0',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  buttonSubtext: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: '#eee',
  },
  recentContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  toggleText: {
    fontSize: 14,
    color: '#999',
  },
  recordItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  recordInfo: {
    flex: 1,
  },
  recordType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4CAF50',
  },
  recordStudent: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  recordTime: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  recordQR: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
    fontFamily: 'monospace',
  },
  syncBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  syncedBadge: {
    backgroundColor: '#E8F5E9',
  },
  unsyncedBadge: {
    backgroundColor: '#FFF3E0',
  },
  syncText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
  },
});
