import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const ProductItem = ({ product, onAddToCart, inCart = false, quantity = 1 }) => {
  const handlePress = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <View style={styles.container} onPress={handlePress}>
      <View style={styles.image}>
        <Text style={styles.imageText}>🛒</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.action}>
        <Text style={styles.actionText}>{inCart ? 'In cart' : 'Add'}</Text>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F5F0',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F6F5F0',
  },
  imageText: {
    fontSize: 24,
    color: '#20332F',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    color: '#20332F',
  },
  price: {
    fontSize: 12,
    color: '#74807A',
    marginTop: 2,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#20332F',
  },
};