import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, radii } from '../../theme';
import { store } from '../data/mockData';

export const TopBar = ({ actionIcon = 'notifications-outline', onAction, onBrandPress, actionHint }) => {
  return (
    <View style={styles.bar}>
      <TouchableOpacity style={styles.brand} onPress={onBrandPress} activeOpacity={0.75}>
        <View style={styles.logo}>
          <Ionicons name="cube" size={18} color={colors.white} />
        </View>
        <View style={styles.brandText}>
          <Text style={styles.brandName}>{store.name}</Text>
          <Text style={styles.brandLocation}>{store.location}</Text>
        </View>
        <Ionicons name="chevron-down" size={14} color={colors.muted} style={styles.chevron} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.action}
        onPress={onAction}
        activeOpacity={0.8}
        accessibilityLabel={actionHint}
        accessibilityRole="button"
      >
        <Ionicons name={actionIcon} size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.section,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: radii.lg,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  brandText: {
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  brandLocation: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 1,
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  action: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
