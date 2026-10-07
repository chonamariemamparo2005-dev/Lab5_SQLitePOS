import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { products as seedProducts } from '../data/mockData';

/**
 * Step 2 — Database service module.
 *
 * On iOS/Android this talks to the real expo-sqlite database (WAL mode, sync API).
 * The web preview cannot use the synchronous API (it needs SharedArrayBuffer /
 * cross-origin isolation, which the Metro dev server does not send), so the browser
 * gets a tiny in-memory table that answers the exact same SQL the app issues.
 * Call sites are identical in both runtimes.
 */
const isWeb = Platform.OS === 'web';

export const db = isWeb ? null : SQLite.openDatabaseSync('pos_inventory.db');

const SCHEMA = `
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER NOT NULL
);
`;

const INSERT_SQL = 'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);';
const COUNT_SQL = 'SELECT COUNT(*) as count FROM products;';
const LIST_SQL = 'SELECT * FROM products ORDER BY id DESC;';
const SEARCH_SQL = 'SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;';

/** Display-only fields live in the Figma mockup, keyed by product name. */
const FALLBACK_META = { image: '📦', unit: '1 unit', supplier: 'Unassigned', favorite: true };
const productMeta = seedProducts.reduce(
  (map, product) => ({
    ...map,
    [product.name]: {
      image: product.image,
      unit: product.unit,
      supplier: product.supplier,
      favorite: product.favorite !== false,
    },
  }),
  {}
);

/** Merge SQL rows with the display fields used by the POS grid / payment receipt. */
export const decorateProducts = (rows) =>
  rows.map((row) => ({ ...row, ...(productMeta[row.name] || FALLBACK_META) }));

/* ------------------------------------------------------------------ *
 * In-memory fallback (web preview only) — mirrors the SQL above
 * ------------------------------------------------------------------ */
let memoryRows = [];
let memoryNextId = 1;

const likeToRegExp = (pattern) =>
  new RegExp(
    `^${String(pattern)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/%/g, '.*')
      .replace(/_/g, '.')}$`,
    'i'
  );

const memoryGetAll = (sql, params = []) => {
  if (/WHERE name LIKE \?/i.test(sql)) {
    const re = likeToRegExp(params[0] ?? '');
    return memoryRows
      .filter((row) => re.test(row.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  if (/ORDER BY id DESC/i.test(sql)) return [...memoryRows].sort((a, b) => b.id - a.id);
  return [...memoryRows];
};

const memoryRun = (sql, params = []) => {
  if (/INSERT INTO products/i.test(sql)) {
    const [name, category, price, stock] = params;
    memoryRows.push({
      id: memoryNextId++,
      name,
      category,
      price: Number(price),
      stock: Number(stock),
    });
    return { changes: 1 };
  }
  if (/DELETE FROM products WHERE id = \?/i.test(sql)) {
    const before = memoryRows.length;
    memoryRows = memoryRows.filter((row) => row.id !== params[0]);
    return { changes: before - memoryRows.length };
  }
  if (/UPDATE products SET stock = stock \+ 1/i.test(sql)) {
    memoryRows = memoryRows.map((row) =>
      row.id === params[0] ? { ...row, stock: row.stock + 1 } : row
    );
    return { changes: 1 };
  }
  if (/UPDATE products SET stock = stock - 1/i.test(sql)) {
    memoryRows = memoryRows.map((row) =>
      row.id === params[0] ? { ...row, stock: Math.max(row.stock - 1, 0) } : row
    );
    return { changes: 1 };
  }
  return { changes: 0 };
};

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */
let ready = false;

/** WAL mode + schema + auto-seed. Idempotent, safe to call from any screen. */
export function initDatabase() {
  if (ready) return;

  if (isWeb) {
    if (memoryRows.length === 0) seedProducts.forEach((p) => insertProduct(p));
    ready = true;
    return;
  }

  db.execSync(SCHEMA);

  // Auto-seed from the Figma mockup so a fresh install is never blank (4–6 items).
  const countRow = db.getFirstSync(COUNT_SQL);
  if (countRow.count === 0) {
    seedProducts.forEach((product) =>
      db.runSync(INSERT_SQL, [product.name, product.category, product.price, product.stock])
    );
  }
  ready = true;
}

export function countProducts() {
  if (isWeb) return memoryRows.length;
  return db.getFirstSync(COUNT_SQL).count;
}

export function getAllProducts() {
  return isWeb ? memoryGetAll(LIST_SQL) : db.getAllSync(LIST_SQL);
}

export function searchProducts(term) {
  const pattern = `%${term}%`;
  return isWeb ? memoryGetAll(SEARCH_SQL, [pattern]) : db.getAllSync(SEARCH_SQL, [pattern]);
}

export function insertProduct({ name, category = 'General', price, stock }) {
  const params = [name, category, Number(price), Number(stock)];
  return isWeb ? memoryRun(INSERT_SQL, params) : db.runSync(INSERT_SQL, params);
}

export function deleteProduct(id) {
  const sql = 'DELETE FROM products WHERE id = ?;';
  return isWeb ? memoryRun(sql, [id]) : db.runSync(sql, [id]);
}

/** Bonus: +1 / −1 stock. Guarded so stock never drops below zero. */
export function changeStock(id, delta) {
  const current = isWeb
    ? memoryRows.find((row) => row.id === id)?.stock
    : db.getFirstSync('SELECT stock FROM products WHERE id = ?;', [id])?.stock;
  if (current == null) return { changes: 0 };
  if (delta < 0 && current <= 0) return { changes: 0 };

  const sql =
    delta >= 0
      ? 'UPDATE products SET stock = stock + 1 WHERE id = ?;'
      : 'UPDATE products SET stock = stock - 1 WHERE id = ?;';
  return isWeb ? memoryRun(sql, [id]) : db.runSync(sql, [id]);
}
