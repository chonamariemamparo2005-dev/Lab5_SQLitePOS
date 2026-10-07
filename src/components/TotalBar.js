import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const TotalBar = ({ total, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total</Text>
      <Text style={styles.amount}>${total.toFixed(2)}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Checkout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#D1D1D6',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 12,
    color: '#74807A',
  },
  amount: {
    fontSize: 16,
    fontWeight: 600,
    color: '#20332F',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#20332F',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 600,
  },
};