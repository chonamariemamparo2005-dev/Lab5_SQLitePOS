import React, { useEffect, useState } from 'react';
import { View, FlatList, SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar, ScreenHeading, Chip, Sheet, useSnackbar } from '../components';
import {
  initDatabase,
  getAllProducts,
  searchProducts,
  insertProduct,
  deleteProduct,
  changeStock,
  decorateProducts,
} from '../services/db';
import { refresh } from '../services/productsStore';
import { colors, spacing, radii } from '../../theme';

const LOW_STOCK = 10;

const StatTile = ({ value, label, tone = 'default' }) => (
  <View style={[styles.tile, tone === 'amber' && styles.tileAmber]}>
    <Text style={[styles.tileValue, tone === 'amber' && styles.tileValueAmber]}>{value}</Text>
    <Text style={styles.tileLabel}>{label}</Text>
  </View>
);

const ProductRow = ({ product, selected, onPress, onStock, onDelete }) => {
  const low = product.stock <= LOW_STOCK;
  return (
    <View>
      <View style={styles.productCard}>
        <TouchableOpacity
          style={styles.productMain}
          activeOpacity={0.75}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`${product.name}, ${product.stock} left`}
        >
          <View style={styles.thumb}>
            <Text style={styles.thumbEmoji}>{product.image}</Text>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productMeta}>{product.unit} · {product.category}</Text>
            <View style={styles.supplierRow}>
              <Ionicons name="pricetag-outline" size={11} color={colors.muted} />
              <Text style={styles.supplier}>{product.supplier}</Text>
            </View>
          </View>
          <View style={styles.productRight}>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            <View style={[styles.badge, low ? styles.badgeAmber : styles.badgeGreen]}>
              <Text style={[styles.badgeText, low ? styles.badgeTextAmber : styles.badgeTextGreen]}>
                {product.stock} left
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* DELETE — a visible trash button on every single card */}
        <TouchableOpacity
          style={styles.rowDelete}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${product.name}`}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={15} color={colors.error} />
        </TouchableOpacity>
      </View>

      {/* Stock +1 / −1 — revealed when the row is selected */}
      {selected && (
        <View style={styles.rowActions}>
          <Text style={styles.stockLabel}>Stock</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Decrease stock of ${product.name}`}
            onPress={() => onStock(-1)}
          >
            <Ionicons name="remove" size={15} color={colors.secondary} />
          </TouchableOpacity>
          <Text style={styles.stockValue}>{product.stock} in stock</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Increase stock of ${product.name}`}
            onPress={() => onStock(1)}
          >
            <Ionicons name="add" size={15} color={colors.secondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const SORTS = [
  { id: 'name', label: 'Name A-Z', arrow: 'arrow-down' },
  { id: 'price', label: 'Price low-high', arrow: 'arrow-down' },
  { id: 'stock', label: 'Stock low-high', arrow: 'arrow-up' },
];

export const InventoryScreen = ({ route }) => {
  const safeArea = useSafeAreaInsets();
  const { show, element: snackbar } = useSnackbar();

  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState(route?.params?.filter === 'low' ? 'low' : 'all');
  const [sortBy, setSortBy] = useState('name');
  const [supplier, setSupplier] = useState('All');
  const [showSuppliers, setShowSuppliers] = useState(false);
  const [allItems, setAllItems] = useState([]); // every row in the database
  const [items, setItems] = useState([]); // rows returned by the current SQL search
  const [selectedId, setSelectedId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ name: '', category: '', price: '', stock: '' });

  /** Step 3 — reusable loader: full table, or a parameterised LIKE search. */
  const loadProducts = (search = '') => {
    const all = decorateProducts(getAllProducts());
    const term = search.trim();
    setAllItems(all);
    setItems(term ? decorateProducts(searchProducts(term)) : all);
  };

  // Step 3 — initial mount
  useEffect(() => {
    initDatabase();
    refresh();
    loadProducts('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reacts to navigation sent from Dashboard ("Review stock", "Add stock")
  useEffect(() => {
    if (!route?.params) return;
    if (route.params.filter) setFilter(route.params.filter);
    if (route.params.action === 'add') setAddOpen(true);
  }, [route?.params]);

  const supplierList = ['All', ...Array.from(new Set(allItems.map((product) => product.supplier)))];

  // Client-side refinement on top of the SQL result (filter chips, supplier, sort)
  const filteredProducts = items
    .filter((product) => {
      const matchesFilter = filter === 'all' || product.stock <= LOW_STOCK;
      const matchesSupplier = supplier === 'All' || product.supplier === supplier;
      return matchesFilter && matchesSupplier;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return a.stock - b.stock;
      return a.name.localeCompare(b.name);
    });

  const totalUnits = allItems.reduce((sum, product) => sum + product.stock, 0);
  const lowCount = allItems.filter((product) => product.stock <= LOW_STOCK).length;
  const sort = SORTS.find((option) => option.id === sortBy) || SORTS[0];

  const handleSearch = (text) => {
    setSearchText(text);
    loadProducts(text); // Step 4 — SQL LIKE, executed as the user types
  };

  const cycleSort = () => {
    const next = SORTS[(SORTS.findIndex((option) => option.id === sortBy) + 1) % SORTS.length];
    setSortBy(next.id);
    show(`Sorted by ${next.label}`);
  };

  const changeFilter = (value) => {
    setFilter(value);
    show(value === 'low' ? `Showing ${lowCount} low-stock products` : `Showing all ${allItems.length} products`);
  };

  const pickSupplier = (value) => {
    setSupplier(value);
    show(value === 'All' ? 'Showing all suppliers' : `Filtered to ${value}`);
  };

  const toggleRow = (product) => {
    const next = selectedId === product.id ? null : product.id;
    setSelectedId(next);
    show(next ? `${product.name} selected — adjust stock or delete` : 'Row closed');
  };

  // Step 5 — Create
  const confirmAdd = () => {
    const name = draft.name.trim();
    const category = draft.category.trim() || 'General';
    const price = parseFloat(draft.price);
    const stock = parseInt(draft.stock, 10);
    if (!name || Number.isNaN(price) || Number.isNaN(stock)) {
      show('Enter a name, a price and a stock quantity');
      return;
    }
    insertProduct({ name, category, price, stock });
    refresh(); // POS grid + payment receipt pick the new row up
    loadProducts(searchText);
    setDraft({ name: '', category: '', price: '', stock: '' });
    setAddOpen(false);
    show(`${name} saved to SQLite · $${price.toFixed(2)} · ${stock} in stock`);
  };

  // Step 5 — Delete (with confirmation)
  const confirmDelete = () => {
    if (!pendingDelete) return;
    deleteProduct(pendingDelete.id);
    refresh();
    loadProducts(searchText);
    setSelectedId(null);
    show(`${pendingDelete.name} deleted from SQLite`);
    setPendingDelete(null);
  };

  // Step 5 (bonus) — stock +1 / −1
  const handleStock = (product, delta) => {
    const result = changeStock(product.id, delta);
    if (!result.changes) {
      show(`${product.name} is already out of stock`);
      return;
    }
    refresh();
    loadProducts(searchText);
    show(`${product.name} · stock ${delta > 0 ? '+' : '−'}1 → ${product.stock + delta}`);
  };

  const header = (
    <>
      <TopBar
        actionIcon="add"
        actionHint="Add product"
        onBrandPress={() => show('Suppliers · Maple Street Market')}
        onAction={() => setAddOpen(true)}
      />
      <ScreenHeading
        title="Inventory"
        subtitle={`${allItems.length} products · ${totalUnits} units on hand`}
      />

      {/* Search — Step 4: parameterised SQL LIKE */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={17} color={colors.muted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products or suppliers"
          placeholderTextColor={colors.muted}
          value={searchText}
          onChangeText={handleSearch}
          accessibilityLabel="Search products"
        />
        <TouchableOpacity
          onPress={() => setShowSuppliers((visible) => !visible)}
          activeOpacity={0.7}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Supplier filters"
        >
          <Ionicons name="options-outline" size={18} color={colors.secondary} />
        </TouchableOpacity>
      </View>

      {/* Supplier filter (revealed by the options button) */}
      {showSuppliers && (
        <View style={styles.chipsRow}>
          {supplierList.map((name) => (
            <Chip
              key={name}
              label={name}
              active={supplier === name}
              onPress={() => pickSupplier(name)}
            />
          ))}
        </View>
      )}

      {/* Stats */}
      <View style={styles.tilesRow}>
        <StatTile value={String(allItems.length)} label="Products" />
        <StatTile value={String(totalUnits)} label="In stock" />
        <StatTile value={String(lowCount)} label="Low stock" tone="amber" />
      </View>

      {/* Filters */}
      <View style={styles.chipsRow}>
        <Chip label="All stock" active={filter === 'all'} onPress={() => changeFilter('all')} />
        <Chip label={`Low stock (${lowCount})`} active={filter === 'low'} onPress={() => changeFilter('low')} />
      </View>

      {/* List header */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Products</Text>
        {/* ADD — labelled button (same action as the top-bar +) */}
        <TouchableOpacity
          style={styles.addChip}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Add product"
          onPress={() => setAddOpen(true)}
        >
          <Ionicons name="add" size={14} color={colors.white} />
          <Text style={styles.addChipText}>Add product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sort}
          onPress={cycleSort}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Sort products"
        >
          <Text style={styles.sortText}>{sort.label}</Text>
          <Ionicons name={sort.arrow} size={13} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        style={styles.list}
        contentContainerStyle={[styles.container, { paddingTop: safeArea.top }]}
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={header}
        renderItem={({ item, index }) => (
          <View style={index < filteredProducts.length - 1 && styles.divider}>
            <ProductRow
              product={item}
              selected={selectedId === item.id}
              onPress={() => toggleRow(item)}
              onStock={(delta) => handleStock(item, delta)}
              onDelete={() => setPendingDelete(item)}
            />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found in SQLite database.</Text>
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Step 5 — Add product */}
      <Sheet
        visible={addOpen}
        title="Add product"
        subtitle="New stock item · Suppliers"
        onClose={() => setAddOpen(false)}
        footer={
          <TouchableOpacity style={styles.addButton} activeOpacity={0.85} onPress={confirmAdd}>
            <Ionicons name="add-circle-outline" size={18} color={colors.white} />
            <Text style={styles.addButtonText}>Add to inventory</Text>
          </TouchableOpacity>
        }
      >
        <Text style={styles.fieldLabel}>Product name</Text>
        <TextInput
          style={styles.field}
          placeholder="e.g. Brown rice"
          placeholderTextColor={colors.muted}
          value={draft.name}
          onChangeText={(text) => setDraft((prev) => ({ ...prev, name: text }))}
        />
        <Text style={styles.fieldLabel}>Category</Text>
        <TextInput
          style={styles.field}
          placeholder="e.g. Pantry"
          placeholderTextColor={colors.muted}
          value={draft.category}
          onChangeText={(text) => setDraft((prev) => ({ ...prev, category: text }))}
        />
        <Text style={styles.fieldLabel}>Unit price (USD)</Text>
        <TextInput
          style={styles.field}
          placeholder="e.g. 8.50"
          placeholderTextColor={colors.muted}
          keyboardType="decimal-pad"
          value={draft.price}
          onChangeText={(text) => setDraft((prev) => ({ ...prev, price: text }))}
        />
        <Text style={styles.fieldLabel}>Stock on hand</Text>
        <TextInput
          style={styles.field}
          placeholder="e.g. 20"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          value={draft.stock}
          onChangeText={(text) => setDraft((prev) => ({ ...prev, stock: text }))}
        />
      </Sheet>

      {/* Step 5 — Delete confirmation */}
      <Sheet
        visible={!!pendingDelete}
        title="Delete product?"
        subtitle={pendingDelete ? `${pendingDelete.name} · ${pendingDelete.stock} in stock` : ''}
        onClose={() => setPendingDelete(null)}
        footer={
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={() => setPendingDelete(null)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              activeOpacity={0.8}
              onPress={confirmDelete}
            >
              <Ionicons name="trash-outline" size={16} color={colors.white} />
              <Text style={styles.confirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        }
      >
        <Text style={styles.confirmBody}>
          This row is removed from the SQLite table with
          {' '}
          <Text style={styles.code}>DELETE FROM products WHERE id = ?</Text>. The change survives
          an app restart and works offline.
        </Text>
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
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  field: {
    height: 46,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    fontSize: 14,
    color: colors.primary,
    paddingVertical: 0,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.secondary,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  cancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.surface,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.muted,
  },
  confirmButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    height: 50,
    borderRadius: radii.lg,
    backgroundColor: colors.error,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  confirmBody: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    paddingVertical: spacing.md,
  },
  code: {
    fontWeight: '700',
    color: colors.secondary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginHorizontal: spacing.section,
    paddingHorizontal: spacing.xl,
    height: 46,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    padding: 0,
  },
  tilesRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
    marginTop: spacing.xl,
  },
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  tileAmber: {
    backgroundColor: colors.amberBg,
    borderColor: colors.amberBg,
  },
  tileValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  tileValueAmber: {
    color: colors.amber,
  },
  tileLabel: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
    marginTop: spacing.xxl,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.section,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.lg,
    height: 30,
    borderRadius: radii.full,
    backgroundColor: colors.secondary,
  },
  addChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  sort: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.secondary,
  },
  list: {
    marginHorizontal: spacing.section,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.xl,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    paddingVertical: spacing.section,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
  productMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  rowDelete: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 0.5,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.xl,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockValue: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.full,
    backgroundColor: '#FEE2E2',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.error,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbEmoji: {
    fontSize: 22,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  productMeta: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  supplierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  supplier: {
    fontSize: 11,
    color: colors.muted,
  },
  productRight: {
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  badge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  badgeGreen: {
    backgroundColor: colors.tint,
  },
  badgeAmber: {
    backgroundColor: colors.amberBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  badgeTextGreen: {
    color: colors.secondary,
  },
  badgeTextAmber: {
    color: colors.amber,
  },
};
