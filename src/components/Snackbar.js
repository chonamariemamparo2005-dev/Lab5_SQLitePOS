import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme';

/**
 * Non-blocking confirmation bar. Used instead of Alert.alert so that
 * feedback is visible on BOTH react-native-web and a real device.
 */
export const Snackbar = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => onDismiss(), 2600);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <View style={styles.wrap}>
      <Ionicons name="checkmark-circle" size={16} color="#B7E4CF" />
      <Text style={styles.text} numberOfLines={2}>
        {toast.message}
      </Text>
    </View>
  );
};

/** Returns { show(message), element } — render `element` once near the screen root. */
export const useSnackbar = () => {
  const [toast, setToast] = useState(null);

  const show = useCallback((message) => {
    setToast({ id: Date.now(), message });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return { show, element: <Snackbar toast={toast} onDismiss={dismiss} /> };
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: spacing.section,
    right: spacing.section,
    bottom: spacing.xxl,
    zIndex: 60,
    pointerEvents: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
});
