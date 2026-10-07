# Phone Test — Expo Go + SQLite (add · search · delete · airplane-mode durability)

**Device:** your Android/iPhone with **Expo Go (SDK 57)** · **Project:** `ITMSD1_Lab4`
**Total time:** ~2 minutes · Do the first 4 steps *before* you start recording anything you need to keep.

---

## 0. Connect the phone (pick one)

| Option | How | When to use |
|---|---|---|
| **A. Tunnel (most reliable)** | Expo Go → *Enter URL manually* → paste the `exp://…` **tunnel URL** printed by `npx expo start --tunnel` | phone is on mobile data, or on a different Wi‑Fi, or the PC↔phone LAN is blocked (our earlier case) |
| **B. Same Wi‑Fi** | `npx expo start` (no tunnel) → scan the QR → `exp://192.168.1.6:8081` | phone is on `PLDTHOMEFIBRUjXRK` **and** can reach the PC |
| **C. Windows hotspot** | Settings → Mobile hotspot on the PC, join it with the phone, then `npx expo start` | router blocks client-to-client traffic |

✅ Success = **Dashboard** opens with `Sunday, 4 October · $1,284.00`.

---

## 1. ADD — put a product into SQLite

1. Tap **Inventory**.
2. Note the subtitle: **`5 products · 88 units on hand`** (tiles: 5 / 88 / 2).
3. Tap the green **`+ Add product`** chip (or the **+** in the top bar).
4. Fill: **Name** `Wild rice` · **Category** `Pantry` · **Price** `9.25` · **Stock** `12`.
5. Tap **Add to inventory**.

✅ Subtitle becomes **`6 products · 100 units`**, new card `Wild rice · $9.25 · 12 left` appears,
snackbar: *Wild rice saved to SQLite · $9.25 · 12 in stock*.

*Why it's real:* `INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);`
in `pos_inventory.db` — not a JS array.

---

## 2. SEARCH — keyword query

1. Tap the search field (*Search products or suppliers*).
2. Type `wild` → ✅ **only** `Wild rice` remains, subtitle still `6 products` (the DB total).
3. Type `oil` (clear first) → ✅ **only** `Olive oil`.
4. Clear the field → ✅ all 6 cards return.

*Why it's real:* `SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC` with `['%wild%']`.

---

## 3. DELETE — remove a product

1. Find the **🗑 red trash icon on the `Wild rice` card** (every card has one).
2. Tap it → sheet **“Delete product? · Wild rice · 12 in stock”**.
3. Tap **Delete** (Cancel aborts, nothing is removed).

✅ Card disappears, subtitle back to **`5 products · 88 units`**, snackbar
*Wild rice deleted from SQLite*.

*Why it's real:* `DELETE FROM products WHERE id = ?` — behind a confirmation prompt.

---

## 4. OFFLINE DURABILITY — airplane mode + force-close

1. (Optional bonus) Add one more product, e.g. `Quinoa · Pantry · 7.00 · 15` — **do not delete it**.
2. **Airplane mode ON.**
   - The app keeps running: the bundle is already loaded in memory, only the Metro link drops
     (Fast Refresh stops — that's expected).
3. While still offline, add **2 products** and delete **1** — SQLite is on-device, no network needed.
   ✅ counts move exactly as you tap.
4. **Force-close Expo Go** (swipe it away from Recents / Android → App info → Force stop).
5. **Relaunch Expo Go.**
   - *If Wi‑Fi is still off*, Expo Go cannot reach Metro — this is an **Expo Go limitation, not data
     loss**. Turn Wi‑Fi back on (or re-open the tunnel URL) and let it load — **your rows are still
     there**, because the JS bundle and the database are separate things.
   - *If the bundle loads from cache*, you'll go straight to the app.

✅ **In every case:** every product you added is still listed, every product you deleted is still
gone — counts match exactly what you saw before closing.

**What proves it:** `pos_inventory.db` lives in the app's private sandbox
(`…/files/SQLite/pos_inventory.db`) with `PRAGMA journal_mode = WAL`. Metro only ships JavaScript —
it never holds your data. Killing the app cannot touch the file.

---

## 5. Clean-up (so your screenshot matches the design)

Search `Quinoa` (or whatever you kept) → 🗑 → **Delete** → back to **`5 products · 88 units`**.

---

## If something doesn't work

| Symptom | Fix |
|---|---|
| *“Failed to download remote update” / Couldn't connect* | PC firewall: allow **Node.js** on Private networks; then use the **tunnel URL** (Option A) |
| Counts don't change after Add | Make sure the sheet closed — the button reads **Add to inventory** |
| Nothing matches a search | Search matches the **name** only (supplier search is on the same field via the ⚙ chips) |
| Empty list | You deleted every row: `DELETE` is real — add a product back to continue |
| Metro port busy | Close stale terminals: `npx expo start --clear` |
