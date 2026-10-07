import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const Button = ({ title, onPress, variant = 'primary', disabled, style }) => {
  const variants = {
    primary: {
      backgroundColor: '#20332F',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 100,
      elevation: 2,
    },
    secondary: {
      backgroundColor: '#ECEEE7',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 20,
      elevation: 1,
    },
    ghost: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      elevation: 1,
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.variant[variant],
        { marginVertical: 4 },
        style,
      ]}
    >
      <Text style={styles.textColor}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const Card = ({ children, style, radius = 'md', elevation = 'sm' }) => {
  return (
    <View style={[
      styles.cardBackground,
      { borderRadius: styles.radiusMap[radius], ...styles.shadowMap[elevation] },
      { backgroundColor: '#FFFFFF', padding: 16 },
      style,
    ]}>
      {children}
    </View>
  );
};

export const Header = ({ title, leftComponent, rightComponent }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        {leftComponent}
      </View>
      <View style={styles.headerTitle}>
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <View style={styles.headerRight}>
        {rightComponent}
      </View>
    </View>
  );
};

export const ProductItem = ({ product, onAddToCart, inCart = false, quantity = 1 }) => {
  const handlePress = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <View style={styles.productContainer} onPress={handlePress}>
      <View style={styles.productImage}>
        <Text style={styles.productImageText}>{product.image}</Text>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.productAction}>
        <Button
          title={inCart ? 'In cart' : 'Add'}
          onPress={handlePress}
          variant={inCart ? 'secondary' : 'primary'}
          disabled={inCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  variant: {
    primary: {
      backgroundColor: '#20332F',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 100,
      elevation: 2,
    },
    secondary: {
      backgroundColor: '#ECEEE7',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 20,
      elevation: 1,
    },
    ghost: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      elevation: 1,
    },
  },
  cardBackground: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  textColor: {
    color: '#FFFFFF',
    fontWeight: 600,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D1D6',
  },
  headerLeft: {},
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#20332F',
  },
  headerRight: {},
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F5F0',
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F6F5F0',
  },
  productImageText: {
    fontSize: 24,
    color: '#20332F',
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: 500,
    color: '#20332F',
  },
  productPrice: {
    fontSize: 12,
    color: '#74807A',
    marginTop: 2,
  },
  productAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#20332F',
  },
  radiusMap: {
    sm: 6,
    md: 10,
    lg: 12,
    xl: 16,
    xxl: 20,
  },
  shadowMap: {
    sm: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
    md: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)',
    lg: '0px 2px 8px 0px rgba(0, 0, 0, 0.08)',
  },
});