import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ProfileScreen = () => {
  const safeArea = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.profileContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Mamparo Lab Demo</Text>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>M</Text>
        </View>
        <Text style={styles.name}>User Name</Text>
        <Text style={styles.email}>user@example.com</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F5F0',
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#20332F',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#74807A',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECEEE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 600,
    color: '#20332F',
  },
  name: {
    fontSize: 16,
    fontWeight: 500,
    color: '#20332F',
    marginBottom: 8,
  },
  email: {
    fontSize: 12,
    color: '#74807A',
  },
};