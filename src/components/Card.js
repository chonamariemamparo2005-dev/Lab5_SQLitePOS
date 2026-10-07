import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const ProductItem = ({ product, onAddToCart, inCart = false }) => {
  return (
    <TouchableOpacity style={styles.container} styleActiveOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Text style={styles.imageText}>🛒</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.action}>
        <Text style={styles.actionText}>{inCart ? 'In cart' : 'Add'}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const Card = ({ title, children, style }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
};

const styles = {
  container: {
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
  card: {
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
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#20332F',
    marginBottom: 12,
  },
  cardContent: {},
  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F6F5F0',
  },
  imageText: {
    fontSize: 24,
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
    marginTop: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: 500,
    color: '#20332F',
  },
};