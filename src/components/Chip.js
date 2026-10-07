import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme';

export const Chip = ({ label, active = false, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.active]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radii.full,
    backgroundColor: '#E9E7DE',
  },
  active: {
    backgroundColor: colors.secondary,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4C5A55',
  },
  labelActive: {
    color: colors.white,
  },
};
