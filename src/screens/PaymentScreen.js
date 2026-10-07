import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cart, paymentMethods } from '../data/mockData';
import { getProducts } from '../services/productsStore';
import { TopBar, ScreenHeading, Sheet, useSnackbar } from '../components';
import { colors, spacing, radii } from '../../theme';

const METHOD_ICONS = {
  card: 'card-outline',
  cash: 'cash-outline',
  split: 'swap-horizontal-outline',
};

export const PaymentScreen = ({ navigation }) => {
  const safeArea = useSafeAreaInsets();
  const { show, element: snackbar } = useSnackbar();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [receipt, setReceipt] = useState(null);

  // Always read the live cart shared with the POS screen (prices resolved
  // against the SQLite-backed product list).
  const items = cart
    .map((item) => {
      const product = getProducts().find((p) => p.id === item.productId);
      return {
        ...item,
        name: product?.name,
        image: product?.image,
        price: product?.price || 0,
      };
    })
    .filter((item) => item.name); // skip rows deleted from the database
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const method = paymentMethods.find((m) => m.id === selectedMethod);

  const handleConfirm = () => {
    if (items.length === 0) {
      show('The cart is empty — add products in the POS first');
      return;
    }
    setReceipt({ items, total, itemCount, method: method.label });
    cart.splice(0, cart.length); // sale complete → empty the shared cart
    show(`Charged $${total.toFixed(2)} by ${method.label}`);
  };

  const startNewSale = () => {
    setReceipt(null);
    show('Receipt stored · new sale ready');
    navigation.goBack();
  };

  const openReports = () => {
    setReceipt(null);
    navigation.navigate('Reports');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: safeArea.top }]}
        showsVerticalScrollIndicator={false}
      >
        <TopBar
          actionIcon="ellipsis-horizontal"
          actionHint="Sale options"
          onBrandPress={() => show('Suppliers · Maple Street Market')}
          onAction={() => show('Payment · terminal connected · ready to charge')}
        />
        <ScreenHeading title="Payment" subtitle="Sale #1048 · Walk-in customer" />

        {/* Order summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order summary · {itemCount} items</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Edit cart"
              onPress={() => {
                show('Back to the basket');
                navigation.goBack();
              }}
            >
              <Text style={styles.link}>Edit cart</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <Text style={styles.emptyText}>
              No items in this sale yet — go back and add products from the POS.
            </Text>
          ) : (
            <>
              {items.map((item, index) => (
                <View
                  key={item.productId}
                  style={[styles.itemRow, index < items.length - 1 && styles.itemDivider]}
                >
                  <View style={styles.thumb}>
                    <Text style={styles.thumbEmoji}>{item.image}</Text>
                  </View>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.quantity} × ${item.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.itemAmount}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
            </>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment method */}
        <Text style={styles.sectionTitle}>Payment method</Text>

        <View style={styles.methods}>
          {paymentMethods.map((option) => {
            const selected = selectedMethod === option.id;
            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.method, selected && styles.methodSelected]}
                onPress={() => {
                  setSelectedMethod(option.id);
                  show(`${option.label} selected · ${option.hint}`);
                }}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={METHOD_ICONS[option.id]}
                  size={18}
                  color={selected ? colors.secondary : colors.muted}
                />
                <View style={styles.methodInfo}>
                  <Text style={styles.methodLabel}>{option.label}</Text>
                  <Text style={styles.methodHint}>{option.hint}</Text>
                </View>
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={selected ? colors.secondary : '#C7C7CC'}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Terminal status */}
        <View style={styles.status}>
          <Ionicons name="wifi" size={14} color={colors.secondary} />
          <Text style={styles.statusText}>Counter terminal connected · Ready</Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, items.length === 0 && styles.primaryButtonDisabled]}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Ionicons name="lock-closed" size={16} color={colors.white} />
          <Text style={styles.primaryButtonText}>
            {items.length === 0 ? 'Cart is empty' : `Charge $${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Receipt */}
      <Sheet
        visible={!!receipt}
        title="Payment successful"
        subtitle={`Sale #1048 · ${receipt ? receipt.method : ''}`}
        onClose={() => setReceipt(null)}
        footer={
          <>
            <TouchableOpacity
              style={[styles.primaryButton, styles.footerButton]}
              activeOpacity={0.85}
              onPress={startNewSale}
            >
              <Ionicons name="add-circle-outline" size={17} color={colors.white} />
              <Text style={styles.primaryButtonText}>Start new sale</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.secondaryButton, styles.footerButton]}
              activeOpacity={0.85}
              onPress={openReports}
            >
              <Ionicons name="stats-chart-outline" size={16} color={colors.secondary} />
              <Text style={styles.secondaryButtonText}>View reports</Text>
            </TouchableOpacity>
          </>
        }
      >
        <View style={styles.receipt}>
          <View style={styles.receiptIcon}>
            <Ionicons name="checkmark" size={26} color={colors.white} />
          </View>
          <Text style={styles.receiptAmount}>${receipt ? receipt.total.toFixed(2) : '0.00'}</Text>
          <Text style={styles.receiptMeta}>
            {receipt ? receipt.itemCount : 0} items · paid by {receipt ? receipt.method : ''}
          </Text>
          <Text style={styles.receiptMeta}>Counter terminal · Ready · 4 October</Text>
        </View>
      </Sheet>

      {snackbar}
    </SafeAreaView>
  );
};

const styles = {
  safeArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.background,
  },
  container: {
    paddingBottom: spacing.section * 2,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    fontStyle: 'italic',
    paddingVertical: spacing.lg,
  },
  receipt: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  receiptIcon: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.secondaryAccent || '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  receiptAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.6,
  },
  receiptMeta: {
    fontSize: 13,
    color: colors.muted,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    height: 50,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  primaryButtonDisabled: {
    opacity: 0.55,
  },
  footerButton: {
    marginHorizontal: 0,
    marginTop: 0,
  },
  card: {
    marginHorizontal: spacing.section,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lg,
  },
  itemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: 18,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  itemMeta: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  itemAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginTop: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 13,
    color: colors.primary,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    paddingTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    paddingHorizontal: spacing.section,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  methods: {
    marginHorizontal: spacing.section,
    gap: spacing.lg,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  methodSelected: {
    borderColor: colors.secondary,
    backgroundColor: '#EFF7F3',
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  methodHint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.section,
    marginTop: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: '#EAF3EE',
  },
  statusText: {
    fontSize: 12,
    color: '#4C5A55',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.section,
    marginTop: spacing.lg,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.secondary,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
};
