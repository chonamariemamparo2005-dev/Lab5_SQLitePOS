import { initDatabase, getAllProducts, decorateProducts } from './db';

/**
 * Small observable cache of the SQLite `products` table.
 * Inventory writes to the database and calls `refresh()`; every other screen
 * (POS grid, payment receipt) re-renders automatically through `subscribe()`.
 */
let snapshot = [];
const listeners = new Set();

export const getProducts = () => snapshot;

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function refresh() {
  initDatabase();
  snapshot = decorateProducts(getAllProducts());
  listeners.forEach((listener) => listener(snapshot));
  return snapshot;
}
