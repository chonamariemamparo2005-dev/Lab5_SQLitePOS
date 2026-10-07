import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const ScreenHeading = ({ title, subtitle }) => {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = {
  wrap: {
    paddingHorizontal: spacing.section,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: spacing.xs,
  },
};
