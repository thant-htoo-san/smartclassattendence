import React from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AttendanceProvider } from './context/AttendanceContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { HomeScreen } from './screens/HomeScreen';
import { CheckInScreen } from './screens/CheckInScreen';
import { FinishScreen } from './screens/FinishScreen';
import { LoginScreen } from './screens/LoginScreen';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#f5f5f5' },
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="CheckIn" component={CheckInScreen} />
    <Stack.Screen name="Finish" component={FinishScreen} />
  </Stack.Navigator>
);

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1565c0" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <AuthNavigator />;
  }

  return (
    <AttendanceProvider>
      <MainNavigator />
    </AttendanceProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
