import React from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stats, recentSales, suppliers, store } from '../data/mockData';
import { TopBar, ScreenHeading, useSnackbar } from '../components';
import { colors, spacing, radii } from '../../theme';

const SPARK = [10, 14, 11, 18, 16, 22, 20, 26, 24, 30, 34, 32, 40];

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity
    style={styles.actionCard}
    activeOpacity={0.85}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Ionicons name={icon} size={20} color={colors.secondary} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const StatCard = ({ value, label, icon, onPress }) => (
  <TouchableOpacity style={styles.statCard} activeOpacity={0.8} onPress={onPress}>
    <View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
    <View style={styles.statIcon}>
      <Ionicons name={icon} size={14} color={colors.muted} />
    </View>
  </TouchableOpacity>
);

export const DashboardScreen = ({ navigation }) => {
  const safeArea = useSafeAreaInsets();
  const { show, element: snackbar } = useSnackbar();

  const openNewSale = () => {
    show('New sale started — opening the POS');
    navigation.navigate('POS');
  };

  const openAddStock = () => {
    show('Add stock — product form opened in Inventory');
    navigation.navigate('Inventory', { action: 'add' });
  };

  const showSuppliers = () => {
    show(`Approved suppliers: ${suppliers.join(', ')}`);
  };

  const openLowStock = () => {
    show('Showing the 2 low-stock products');
    navigation.navigate('Inventory', { filter: 'low' });
  };

  const openSale = (sale) => {
    show(`Sale #${sale.id} · ${sale.time} · ${sale.method} · $${sale.amount.toFixed(2)}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: safeArea.top }]}
        showsVerticalScrollIndicator={false}
      >
        <TopBar
          actionIcon="notifications-outline"
          actionHint="Notifications"
          onBrandPress={() => show(`${store.name} · ${store.location}`)}
          onAction={() => show('2 low-stock alerts: Sourdough loaf & olive oil')}
        />
        <ScreenHeading
          title="Dashboard"
          subtitle="Sunday, 4 October · Your store at a glance"
        />

        {/* Today's sales */}
        <View style={styles.salesCard}>
          <View style={styles.salesHeader}>
            <Text style={styles.salesLabel}>Today's sales</Text>
            <Text style={styles.salesMeta}>Net sales · USD</Text>
          </View>

          <View style={styles.salesBody}>
            <Text style={styles.salesValue}>$1,284.00</Text>
            <View style={styles.sparkline}>
              {SPARK.map((h, i) => (
                <View key={i} style={[styles.sparkBar, { height: h }]} />
              ))}
            </View>
          </View>

          <View style={styles.salesFooter}>
            <View style={styles.growthRow}>
              <Ionicons name="trending-up" size={13} color="#B7E4CF" />
              <Text style={styles.growthText}>12.0% vs. last Sunday</Text>
            </View>
            <Text style={styles.lastValue}>$1,146.43</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            value={String(stats.transactions)}
            label="Transactions"
            icon="receipt-outline"
            onPress={() => show(`${stats.transactions} transactions today · average sale $${stats.averageSale.toFixed(2)}`)}
          />
          <StatCard
            value={`$${stats.averageSale.toFixed(2)}`}
            label="Average sale"
            icon="card-outline"
            onPress={() => show(`Average sale $${stats.averageSale.toFixed(2)} across ${stats.transactions} transactions`)}
          />
        </View>

        {/* Quick actions */}
        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actionsRow}>
          <QuickAction icon="add" label="New sale" onPress={openNewSale} />
          <QuickAction icon="cube-outline" label="Add stock" onPress={openAddStock} />
          <QuickAction icon="car-outline" label="Suppliers" onPress={showSuppliers} />
        </View>

        {/* Low stock alert */}
        <TouchableOpacity
          style={styles.alert}
          activeOpacity={0.8}
          onPress={openLowStock}
          accessibilityRole="button"
          accessibilityLabel="Review low stock"
        >
          <Ionicons name="warning-outline" size={20} color={colors.amber} />
          <View style={styles.alertBody}>
            <Text style={styles.alertTitle}>2 products running low</Text>
            <Text style={styles.alertText}>Sourdough loaf &amp; olive oil</Text>
            <Text style={styles.alertLink}>Review stock →</Text>
          </View>
        </TouchableOpacity>

        {/* Recent sales */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent sales</Text>
          <TouchableOpacity
            onPress={() => {
              show('Showing the full sales history in Reports');
              navigation.navigate('Reports');
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="View all sales"
          >
            <Text style={styles.link}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listCard}>
          {recentSales.map((sale, index) => (
            <TouchableOpacity
              key={sale.id}
              style={[styles.saleRow, index < recentSales.length - 1 && styles.saleRowDivider]}
              activeOpacity={0.75}
              onPress={() => openSale(sale)}
              accessibilityRole="button"
              accessibilityLabel={`Sale ${sale.id}`}
            >
              <View style={styles.saleIcon}>
                <Ionicons name="receipt-outline" size={15} color={colors.muted} />
              </View>
              <View style={styles.saleInfo}>
                <Text style={styles.saleId}>#{sale.id}</Text>
                <Text style={styles.saleMeta}>{sale.time} · {sale.method}</Text>
              </View>
              <Text style={styles.saleAmount}>${sale.amount.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  salesCard: {
    marginHorizontal: spacing.section,
    backgroundColor: colors.secondary,
    borderRadius: radii.xl,
    padding: spacing.section,
  },
  salesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  salesLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
  },
  salesMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
  },
  salesBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  salesValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.6,
  },
  sparkline: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 40,
  },
  sparkBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  salesFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  growthText: {
    fontSize: 12,
    color: '#B7E4CF',
  },
  lastValue: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textDecorationLine: 'line-through',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
    marginTop: spacing.lg,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  statValue: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    paddingHorizontal: spacing.section,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: spacing.section,
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
  },
  actionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  alert: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginHorizontal: spacing.section,
    marginTop: spacing.xxl,
    backgroundColor: colors.amberBg,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  alertBody: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  alertText: {
    fontSize: 12,
    color: colors.amber,
    marginTop: 2,
  },
  alertLink: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.amber,
    marginTop: spacing.md,
  },
  listCard: {
    marginHorizontal: spacing.section,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.xl,
  },
  saleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  saleRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  saleIcon: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saleInfo: {
    flex: 1,
  },
  saleId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  saleMeta: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  saleAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
};
