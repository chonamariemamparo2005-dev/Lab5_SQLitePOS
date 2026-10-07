import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const NewsScreen = () => {
  const safeArea = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>News</Text>
        <Text style={styles.subtitle}>Latest updates and news</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F5F0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#20332F',
  },
  subtitle: {
    fontSize: 14,
    color: '#74807A',
    marginTop: 8,
  },
};