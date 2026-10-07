import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radii } from '../../theme';

/**
 * In-app dialog (bottom-sheet style card over a scrim).
 * Built from plain Views so it behaves the same on web and native —
 * react-native-web's Modal is not reliable across versions.
 */
export const Sheet = ({ visible, title, subtitle, onClose, children, footer }) => {
  if (!visible) return null;

  return (
    <View style={styles.backdrop}>
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.title}>{title}</Text>
            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          <TouchableOpacity
            style={styles.close}
            onPress={onClose}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Close"
          >
            <Ionicons name="close" size={18} color={colors.muted} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        {!!footer && <View style={styles.footer}>{footer}</View>}
      </View>
    </View>
  );
};

/** Shared pressable row used inside a Sheet. */
export const SheetAction = ({ icon, label, hint, onPress, danger }) => (
  <TouchableOpacity style={styles.action} onPress={onPress} activeOpacity={0.75}>
    {!!icon && <Ionicons name={icon} size={18} color={danger ? colors.error : colors.secondary} />}
    <View style={styles.actionText}>
      <Text style={[styles.actionLabel, danger && { color: colors.error }]}>{label}</Text>
      {!!hint && <Text style={styles.actionHint}>{hint}</Text>}
    </View>
    <Ionicons name="chevron-forward" size={16} color={colors.muted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    backgroundColor: 'rgba(32,51,47,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.section,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: '100%',
    maxWidth: 460,
    maxHeight: '85%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: spacing.xs,
  },
  close: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flexGrow: 0,
  },
  footer: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  actionText: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  actionHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
});
