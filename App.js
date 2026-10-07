import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { refresh } from './src/services/productsStore';

export default function App() {
  // Open (and auto-seed) the SQLite database once at start-up, then publish
  // the rows so Inventory / POS / Payment all render from the same table.
  useEffect(() => {
    refresh();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
