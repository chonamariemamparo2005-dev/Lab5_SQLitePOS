import React, { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { cart } from '../data/mockData';
import { getProducts, subscribe, refresh } from '../services/productsStore';
import { TopBar, ScreenHeading, Chip, Sheet, SheetAction, useSnackbar } from '../components';
import { colors, spacing, radii } from '../../theme';

const CATEGORIES = ['Favorites', 'Pantry', 'Bakery'];

const ProductTile = ({ product, onAdd }) => {
  const low = product.stock <= 10;
  return (
    <View style={styles.tile}>
      <View style={styles.tileImage}>
        <Text style={styles.tileEmoji}>{product.image}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAdd(product)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Add ${product.name}`}
        >
          <Ionicons name="add" size={18} color={colors.secondary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.tileName}>{product.name}</Text>
      <View style={styles.tileFooter}>
        <Text style={styles.tilePrice}>${product.price.toFixed(2)}</Text>
        <Text style={[styles.tileStock, low && styles.tileStockLow]}>{product.stock} left</Text>
      </View>
    </View>
  );
};

export const POSScreen = ({ navigation }) => {
  const safeArea = useSafeAreaInsets();
  const { show, element: snackbar } = useSnackbar();

  const [category, setCategory] = useState('Favorites');
  const [query, setQuery] = useState('');
  const [cartItems, setCartItems] = useState([...cart]);
  const [editCart, setEditCart] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [saleMenuOpen, setSaleMenuOpen] = useState(false);

  // Products come from SQLite (via the shared store), so rows added or deleted
  // in Inventory show up here immediately.
  const [products, setProducts] = useState(getProducts());

  useEffect(() => {
    refresh();
    setProducts(getProducts());
    return subscribe(setProducts);
  }, []);

  // Re-read the shared cart every time the screen (re)gains focus, so the basket
  // reflects a completed payment, a held sale, or stock added in Inventory.
  useFocusEffect(
    React.useCallback(() => {
      setCartItems([...cart]);
    }, [])
  );

  // Keep the shared `cart` (used by Payment) and the screen state in sync.
  const commitCart = (next) => {
    cart.splice(0, cart.length, ...next);
    setCartItems([...next]);
  };

  const items = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return { ...item, name: product?.name, price: product?.price || 0 };
    })
    .filter((item) => item.name); // drop rows deleted from the database

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const gross = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const subtotal = Math.max(gross - discount, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = subtotal + tax;

  const visibleProducts = products.filter((product) => {
    const term = query.trim().toLowerCase();
    const matchesQuery =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);
    const matchesCategory =
      category === 'Favorites' ? product.favorite !== false : product.category === category;
    return matchesQuery && matchesCategory;
  });

  const handleAdd = (product) => {
    const existing = cartItems.find((item) => item.productId === product.id);
    const next = existing
      ? cartItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity >= 5 ? 1 : item.quantity + 1 }
            : item
        )
      : [...cartItems, { productId: product.id, quantity: 1 }];
    commitCart(next);
    show(`${product.name} added · cart is now ${next.reduce((s, i) => s + i.quantity, 0)} items`);
  };

  const changeQuantity = (productId, delta) => {
    const next = cartItems
      .map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    commitCart(next);
  };

  const removeItem = (productId) => {
    const target = items.find((item) => item.productId === productId);
    commitCart(cartItems.filter((item) => item.productId !== productId));
    show(`${target?.name || 'Item'} removed from the cart`);
  };

  const clearCart = () => {
    commitCart([]);
    setDiscount(0);
    setEditCart(false);
    show('Cart cleared · ready for the next customer');
  };

  const applyDiscount = () => {
    const value = Math.round(gross * 0.05 * 100) / 100;
    setDiscount(value);
    setSaleMenuOpen(false);
    show(value > 0 ? `5% discount applied · −$${value.toFixed(2)}` : 'Add items before applying a discount');
  };

  const pickCategory = (label) => {
    setCategory(label);
    const count = products.filter((product) =>
      label === 'Favorites' ? product.favorite !== false : product.category === label
    ).length;
    show(`${label} · ${count} products`);
  };

  const goToPayment = () => {
    if (items.length === 0) {
      show('Add at least one product before checkout');
      return;
    }
    navigation.navigate('Payment');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: safeArea.top }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TopBar
          actionIcon="ellipsis-horizontal"
          actionHint="Sale options"
          onBrandPress={() => show('Suppliers · Maple Street Market')}
          onAction={() => setSaleMenuOpen(true)}
        />
        <ScreenHeading title="POS" subtitle="New sale #1048 · Walk-in customer" />

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search" size={17} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search or scan a product"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            autoCorrect={false}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Scan barcode"
            onPress={() => show('Scanner ready — point the camera at a barcode')}
          >
            <Ionicons name="barcode-outline" size={18} color={colors.secondary} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.chipsRow}>
          {CATEGORIES.map((label) => (
            <Chip
              key={label}
              label={label}
              active={category === label}
              onPress={() => pickCategory(label)}
            />
          ))}
        </View>

        {/* Product grid */}
        <View style={styles.grid}>
          {visibleProducts.length === 0 ? (
            <Text style={styles.gridEmpty}>No products match “{query}”</Text>
          ) : (
            visibleProducts.map((product) => (
              <ProductTile key={product.id} product={product} onAdd={handleAdd} />
            ))
          )}
        </View>

        {/* Cart */}
        <View style={styles.cartCard}>
          <View style={styles.cartHeader}>
            <View style={styles.cartTitleRow}>
              <Ionicons name="cart-outline" size={16} color={colors.secondary} />
              <Text style={styles.cartTitle}>Cart · {itemCount} items</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                const next = !editCart;
                setEditCart(next);
                show(next ? 'Editing cart — use + / − to change quantities' : 'Cart changes saved');
              }}
              accessibilityRole="button"
              accessibilityLabel="Edit cart"
            >
              <Text style={styles.link}>{editCart ? 'Done' : 'Edit cart'}</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <Text style={styles.cartEmpty}>Cart is empty — tap + on a product to start.</Text>
          ) : (
            <>
              <Text style={styles.cartSummary}>
                {[
                  items.slice(0, 2).map((i) => `${i.quantity} × ${i.name}`).join(' · '),
                  items.slice(2).map((i) => `${i.quantity} × ${i.name}`).join(' · '),
                ]
                  .filter(Boolean)
                  .join('\n')}
              </Text>

              {editCart && (
                <View style={styles.editList}>
                  {items.map((item) => (
                    <View key={item.productId} style={styles.editRow}>
                      <Text style={styles.editName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          activeOpacity={0.7}
                          accessibilityRole="button"
                          accessibilityLabel={`Decrease ${item.name}`}
                          onPress={() => changeQuantity(item.productId, -1)}
                        >
                          <Ionicons name="remove" size={14} color={colors.secondary} />
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          activeOpacity={0.7}
                          accessibilityRole="button"
                          accessibilityLabel={`Increase ${item.name}`}
                          onPress={() => changeQuantity(item.productId, 1)}
                        >
                          <Ionicons name="add" size={14} color={colors.secondary} />
                        </TouchableOpacity>
                      </View>
                      <Text style={styles.editAmount}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                      <TouchableOpacity
                        style={styles.qtyBtn}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel={`Remove ${item.name}`}
                        onPress={() => removeItem(item.productId)}
                      >
                        <Ionicons name="trash-outline" size={14} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Subtotal</Text>
              {discount > 0 && <Text style={styles.totalLabel}>Discount (5%)</Text>}
              <Text style={styles.totalLabel}>Tax (8%)</Text>
            </View>
            <View style={styles.totalValues}>
              <Text style={styles.totalValue}>${gross.toFixed(2)}</Text>
              {discount > 0 && <Text style={styles.totalValue}>−${discount.toFixed(2)}</Text>}
              <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.grandRow}>
            <Text style={styles.grandLabel}>TOTAL</Text>
            <Text style={styles.grandValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={goToPayment}
        >
          <Ionicons name="arrow-forward" size={18} color={colors.white} />
          <Text style={styles.primaryButtonText}>Continue to payment</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sale options */}
      <Sheet
        visible={saleMenuOpen}
        title="Sale options"
        subtitle="Sale #1048 · Walk-in customer"
        onClose={() => setSaleMenuOpen(false)}
      >
        <SheetAction
          icon="pricetags-outline"
          label="Apply 5% discount"
          hint={discount > 0 ? `Currently −$${discount.toFixed(2)}` : 'Loyalty discount on this sale'}
          onPress={applyDiscount}
        />
        <SheetAction
          icon="pause-circle-outline"
          label="Hold sale"
          hint="Park this basket and start another"
          onPress={() => {
            setSaleMenuOpen(false);
            show('Sale #1048 held · resume it from the basket list');
          }}
        />
        <SheetAction
          icon="trash-outline"
          label="Clear cart"
          hint="Remove every item"
          danger
          onPress={clearCart}
        />
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
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: colors.muted,
  },
  gridEmpty: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: colors.muted,
    paddingVertical: spacing.section,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
    marginTop: spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    paddingHorizontal: spacing.section,
    marginTop: spacing.xxl,
  },
  tile: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  tileImage: {
    height: 84,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmoji: {
    fontSize: 34,
  },
  addButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.lg,
  },
  tileFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  tilePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
  },
  tileStock: {
    fontSize: 11,
    color: colors.muted,
  },
  tileStockLow: {
    color: colors.amber,
  },
  cartCard: {
    marginHorizontal: spacing.section,
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radii.lg,
    padding: spacing.xl,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  cartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondary,
  },
  cartSummary: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: spacing.lg,
  },
  cartEmpty: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: spacing.lg,
    fontStyle: 'italic',
  },
  editList: {
    marginTop: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.md,
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  editName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  editAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    minWidth: 56,
    textAlign: 'right',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: radii.full,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    minWidth: 16,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: spacing.xl,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 20,
  },
  totalValues: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 20,
  },
  grandRow: {
    marginTop: spacing.md,
    alignItems: 'flex-end',
  },
  grandLabel: {
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.muted,
  },
  grandValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
    marginTop: 2,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginHorizontal: spacing.section,
    marginTop: spacing.xxl,
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
