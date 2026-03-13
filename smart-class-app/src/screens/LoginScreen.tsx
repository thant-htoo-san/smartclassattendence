import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuthContext } from '../context/AuthContext';

export const LoginScreen: React.FC = () => {
  const { signIn, signUp } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);

    try {
      if (isRegisterMode) {
        await signUp(email, password);
        Alert.alert('Account created', 'Your account is ready.');
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.';
      Alert.alert('Auth error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Smart Class</Text>
        <Text style={styles.subtitle}>Sign in to save attendance data in Firebase</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.authButton, submitting && styles.authButtonDisabled]}
          disabled={submitting}
          onPress={handleAuth}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.authButtonText}>{isRegisterMode ? 'Create Account' : 'Sign In'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => setIsRegisterMode((prev) => !prev)}
          disabled={submitting}
        >
          <Text style={styles.switchButtonText}>
            {isRegisterMode ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#263238',
  },
  subtitle: {
    fontSize: 13,
    color: '#607d8b',
    marginTop: 6,
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dfe6eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#263238',
  },
  authButton: {
    backgroundColor: '#1565c0',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 4,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  switchButton: {
    marginTop: 14,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#1565c0',
    fontSize: 13,
    fontWeight: '600',
  },
});
