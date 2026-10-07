import React, { useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reportData } from '../data/mockData';
import { TopBar, ScreenHeading, Chip, useSnackbar } from '../components';
import { colors, spacing, radii } from '../../theme';

const PERIODS = ['Today', '7 days', 'Month'];
const CHART_HEIGHT = 108;

const money = (value) => `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

export const ReportsScreen = () => {
  const safeArea = useSafeAreaInsets();
  const { show, element: snackbar } = useSnackbar();
  const [period, setPeriod] = useState('Today');

  const data = reportData[period];
  const chartMax = data.chartMax;

  const selectPeriod = (label) => {
    setPeriod(label);
    show(`${label} · ${money(reportData[label].netSales)} net sales`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: safeArea.top }]}
        showsVerticalScrollIndicator={false}
      >
        <TopBar
          actionIcon="download-outline"
          actionHint="Export report"
          onBrandPress={() => show('Suppliers · Maple Street Market')}
          onAction={() => show(`Exporting the ${period.toLowerCase()} report as CSV… saved`)}
        />
        <ScreenHeading
          title="Reports"
          subtitle="Sunday, 4 October · Sales excluding tax"
        />

        {/* Periods */}
        <View style={styles.chipsRow}>
          {PERIODS.map((label) => (
            <Chip key={label} label={label} active={period === label} onPress={() => selectPeriod(label)} />
          ))}
        </View>

        {/* Net sales */}
        <View style={styles.card}>
          <View style={styles.salesRow}>
            <View style={styles.salesLeft}>
              <Text style={styles.cardLabel}>Net sales</Text>
              <Text style={styles.salesValue}>{money(data.netSales)}</Text>
              <View style={styles.growthRow}>
                <Ionicons name="trending-up" size={13} color={colors.secondary} />
                <Text style={styles.growthText}>{data.growth} {data.growthLabel}</Text>
              </View>
            </View>

            <View style={styles.salesRight}>
              <Text style={styles.metaText}>{data.transactions} transactions</Text>
              <Text style={styles.metaText}>{data.unitsSold} units sold</Text>
              <Text style={styles.metaText}>${data.averageSale.toFixed(2)} avg. sale</Text>
            </View>
          </View>
        </View>

        {/* Sales by period */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{data.chartTitle}</Text>
            <Text style={styles.cardTag}>{data.chartUnit}</Text>
          </View>

          <View style={styles.chart}>
            <View style={styles.yAxis}>
              <Text style={styles.yLabel}>{chartMax}</Text>
              <Text style={styles.yLabel}>{Math.round(chartMax / 2)}</Text>
              <Text style={styles.yLabel}>0</Text>
            </View>

            <View style={styles.plot}>
              <View style={[styles.gridline, { top: 0 }]} />
              <View style={[styles.gridline, { top: CHART_HEIGHT / 2 }]} />
              <View style={[styles.gridline, { top: CHART_HEIGHT }]} />

              <View style={[styles.bars, { height: CHART_HEIGHT }]}>
                {data.chart.map((bar, index) => (
                  <View key={`${bar.label}-${index}`} style={styles.barSlot}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max((bar.value / chartMax) * CHART_HEIGHT, 6),
                          backgroundColor:
                            index === data.chart.length - 1 ? colors.secondary : '#B7DCC9',
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>

              <View style={styles.xAxis}>
                {data.chart.map((bar, index) => (
                  <Text key={`${bar.label}-${index}`} style={styles.axisText}>{bar.label}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Sales by category */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sales by category</Text>
          {data.categories.map((category) => (
            <TouchableOpacity
              key={category.label}
              style={styles.categoryBlock}
              activeOpacity={0.7}
              onPress={() =>
                show(`${category.label} · ${money(category.amount)} · ${category.percent}% of ${period.toLowerCase()} sales`)
              }
            >
              <View style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>{category.label}</Text>
                <Text style={styles.categoryValue}>
                  {money(category.amount)} · {category.percent}%
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${category.percent}%` }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top products */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top products</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="View all top products"
              onPress={() => show(`${data.top.length} top products in ${period.toLowerCase()}`)}
            >
              <Text style={styles.cardTag}>View all</Text>
            </TouchableOpacity>
          </View>
          {data.top.map((product) => (
            <TouchableOpacity
              key={product.name}
              style={styles.productRow}
              activeOpacity={0.7}
              onPress={() => show(`${product.name} · ${product.sold} sold · ${money(product.amount)}`)}
            >
              <View>
                <Text style={styles.categoryLabel}>{product.name}</Text>
                <Text style={styles.soldText}>{product.sold} sold</Text>
              </View>
              <Text style={styles.categoryValue}>{money(product.amount)}</Text>
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
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
    marginBottom: spacing.xl,
  },
  card: {
    marginHorizontal: spacing.section,
    marginBottom: spacing.lg,
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
    marginBottom: spacing.lg,
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
    marginBottom: spacing.lg,
  },
  cardLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  salesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salesLeft: {
    flex: 1,
  },
  salesValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.xs,
    letterSpacing: -0.5,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  growthText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  salesRight: {
    borderLeftWidth: 1,
    borderLeftColor: colors.cardBorder,
    paddingLeft: spacing.xl,
    gap: spacing.sm,
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
  },
  chart: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  yAxis: {
    height: CHART_HEIGHT + 18,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  plot: {
    flex: 1,
  },
  gridline: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.cardBorder,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.lg,
  },
  barSlot: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  xAxis: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  axisText: {
    flex: 1,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
  },
  yLabel: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'right',
  },
  categoryBlock: {
    marginBottom: spacing.xl,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  categoryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  track: {
    height: 6,
    borderRadius: radii.full,
    backgroundColor: '#EFEDE5',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radii.full,
    backgroundColor: colors.secondary,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  soldText: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
  },
};
