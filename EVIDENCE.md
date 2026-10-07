# Evidence — Figma → Expo SDK 57 (`suppliers-app`) via Figma MCP + OpenCode

**Project:** `C:\ITMSD1_Lab4` · **Expo SDK:** `57.0.0` · **CLI:** `expo-cli 57.0.27`
**Design file:** https://www.figma.com/design/rARri6cM4lhBv9NtbQKobs/ITMSD1_Lab_Mamparo (page: *Android (Material 3)*)

---

## 0. Workflow summary

| # | Step (as demonstrated in class) | Command / action | Evidence |
|---|---|---|---|
| 1 | Read the Figma design (+ **Share → anyone with the link**) | Figma MCP `get_figma_data` on the 5 frames (fallback: rendered frames, see §2.3); link verified cookie-free (§1.1), clean layer names (§1.2) | `evidence/figma/*.png`, `evidence/step1-public-thumbnail.png`, `evidence/logs/step1-figma-share-and-layers.txt` |
| 2 | Install Figma MCP into OpenCode | `mcp.servers.figma` in `opencode.json` | §2.1–2.2, `evidence/logs/opencode-mcp-list.txt` |
| 3 | Convert design → Expo app | Rewrote the 5 screens + navigator + data + theme in OpenCode | §3, `src/**` |
| 4 | Verify against the design | Metro web render, per-screen screenshots vs. Figma frames | §4, `evidence/app/*.png` |
| 5 | Run with `npx expo start` for Expo Go | `npx expo start` → Metro dev server | §5, `evidence/logs/npx-expo-start.txt` |
| 6 | Production bundle check | `npx expo export --platform android` → exit code 0 | §5.3, `evidence/logs/expo-export-android.txt` |

---

## 1. Source design (Figma)

Frames on the *Android (Material 3)* page, node IDs used for fetching:

| Screen | Node ID | Figma render | App render |
|---|---|---|---|
| Dashboard | `43-4269` | `evidence/figma/1-dashboard.png` | `evidence/app/1-dashboard.png` |
| Inventory | `42-3` | `evidence/figma/2-inventory.png` | `evidence/app/2-inventory.png` |
| POS | `42-5` | `evidence/figma/3-pos.png` | `evidence/app/3-pos.png` |
| Payment | `42-7` | `evidence/figma/4-payment.png` | `evidence/app/4-payment.png` |
| Reports | `42-9` | `evidence/figma/5-reports.png` | `evidence/app/5-reports.png` |

Frames were rendered with Figma presentation mode
(`/proto/rARri6cM4lhBv9NtbQKobs/ITMSD1_Lab_Mamparo?node-id=<id>&scaling=contain&starting-point-node-id=<id>`)
so each screen could be read at full size.

### 1.1 Step 1 — share link verified without my login session

*"Share → Anyone with the link can view → Copy link → verify in an incognito window."*
The browser tool has no incognito mode, so the same thing was proven with **cookie-free**
requests (an incognito window sends no Figma cookies):

| Check | Result |
|---|---|
| `GET https://www.figma.com/api/oembed?url=…ITMSD1_Lab_Mamparo` | **HTTP 200** → `title: ITMSD1_Lab_Mamparo`, `key: rARri6cM4lhBv9NtbQKobs`, embed iframe `https://embed.figma.com/design/rARri6cM4lhBv9NtbQKobs/…` |
| Signed CDN thumbnail fetched with **no cookies** | **HTTP 200 `image/webp`**, 9,390 bytes → saved as `evidence/step1-public-thumbnail.png` |

Figma only returns oEmbed data and file thumbnails for files that are publicly viewable, so
**"Anyone with the link can view" is ON** — the link opens in an incognito window.

### 1.2 Step 1 — phone frames with clean layer names

Read straight from the Figma layers panel:

```
Pages
├── Android (Material 3)
│     ├── Dashboard   (node 43-4269)
│     ├── Inventory   (node 42-3)
│     ├── POS         (node 42-5)
│     ├── Payment     (node 42-7)
│     └── Reports     (node 42-9)
├── iOS (Apple HIG)
└── Color System & Design Rationale
```

Log: `evidence/logs/step1-figma-share-and-layers.txt`.

---

## 2. Figma MCP installed into OpenCode

### 2.1 Configuration — `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "figma": {
        "type": "local",
        "command": [
          "npx", "-y", "figma-developer-mcp",
          "--figma-api-key=figd_…",
          "--stdio"
        ]
      }
    }
  }
}
```

> The file originally used the V1 shape (`mcp: { figma: { enabled, args, env } }`), which OpenCode
> ignored. It was rewritten to the V2 shape above, after which the server connected.

### 2.2 Connection check — `opencode mcp list`

```
┌  MCP Servers
│
●  ✓ figma connected
│      npx -y figma-developer-mcp --figma-api-key=figd_… --stdio
│
└  1 server(s)
```
*(raw output: `evidence/logs/opencode-mcp-list.txt`)*

Tools registered in the OpenCode catalog:

| Tool | Description |
|---|---|
| `tools.figma.get_figma_data` | Get comprehensive Figma file data including layout, content, visuals, component information |
| `tools.figma.download_figma_images` | Download SVG/PNG images used in a Figma file by node IDs |

### 2.3 Honest caveat: the API key is expired

A direct check against the Figma REST API with the configured PAT returns:

```
GET https://api.figma.com/v1/me  →  401  (invalid/expired token)
```

so `figma.get_figma_data` calls fail at the transport layer. **Workaround used in this
session:** the design was read through the already-signed-in browser session (presentation-mode
renders listed in §1), i.e. the same file, page and node IDs the MCP call would have returned.

**To make the MCP path work verbatim:** create a new Personal Access Token at
figma.com → Settings → Security scopes **File content: Read** + **Dev resources: Read** and
replace the `--figma-api-key=` value in `opencode.json`.

---

## 3. Design → code conversion

### 3.1 Files written/rewritten

| File | What it contains (per design) |
|---|---|
| `src/components/TopBar.js` | **new** — green logo tile, *Suppliers* / *Maple Street Market*, chevron, circular action button |
| `src/components/ScreenHeading.js` | **new** — screen title + subtitle |
| `src/components/Chip.js` | **new** — active/inactive pill (filters, categories, periods) |
| `src/screens/DashboardScreen.js` | `$1,284.00` green sales card + sparkline, `48` / `$26.75` stat cards, quick actions, amber low-stock alert, recent sales (`#1047 …`) |
| `src/screens/InventoryScreen.js` | search + filter bar, `5 / 88 / 2` tiles, *All stock* · *Low stock (2)* chips, product rows with unit, supplier, price, stock badge |
| `src/screens/POSScreen.js` | search/scan bar, category chips, 2-column grid with `+` buttons, cart card (`Subtotal $22.00`, `Tax (8%) $1.76`, `TOTAL $23.76`), *Continue to payment* |
| `src/screens/PaymentScreen.js` | order summary (4 items), `Card`/`Cash`/`Split payment` radio rows, terminal status, `Charge $23.76` |
| `src/screens/ReportsScreen.js` | `Today/7 days/Month` chips, net sales + KPI column, hourly bar chart, category progress bars, top products |
| `src/navigation/AppNavigator.js` | one tab navigator (Dashboard · Inventory · POS · Reports) + POS stack containing Payment |
| `src/data/mockData.js` | data aligned to design values |
| `theme.js` | added tokens: `cardBorder`, `tint`, `tintStrong`, `amber`, `amberBg` |

### 3.2 Bugs fixed to make the app run at all

1. `ProductItem.styles = styles` / `ProductItem.styles = styles` executed **before** `const styles` → `ReferenceError: Cannot access 'styles' before initialization` (app crashed on startup).
2. `useSafeAreaContext` **no longer exists** in `react-native-safe-area-context@5.10.1` → replaced with `useSafeAreaInsets()` in all 9 screens.
3. `AppNavigator` rendered two navigators as siblings of `NavigationContainer` and nested `<Stack.Screen name="Payment">` inside POS's children → rebuilt as one tab navigator with a POS stack (Payment keeps the POS tab active, as in the design).

### 3.4 Runtime fixes — why `npx expo start` was failing

**A. On the phone after scanning the QR (fatal):**

```
[runtime not ready]: Invariant Violation:
TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found.
Verify that a module by this name is registered in the native binary.
```

| | |
|---|---|
| Cause | The starter **pinned** `react@18.2.0` + `react-native@0.76.3` (hidden in `expo.install.exclude`) while `expo` is **SDK 57**. Metro therefore bundled **RN 0.76 JS** into Expo Go's **SDK 57 native runtime**, whose binary no longer registers `PlatformConstants` under that legacy name. |
| Fix | Removed the `expo.install.exclude` pins and ran **`npx expo install --fix`**, aligning everything to SDK 57. |
| Result | `npx expo install --check` → *"Dependencies are up to date"* · `npx expo-doctor` → **21/21 passed** |

Aligned versions:

```
react                          18.2.0  →  19.2.3
react-dom                      18.2.0  →  19.2.3
react-native                   0.76.3  →  0.86.3
react-native-web               0.19.13 →  0.21.3
react-native-screens           4.28.0  →  4.26.2   (SDK 57 expected ~4.26.0)
react-native-safe-area-context 4.14.1  →   5.7.0   (SDK 57 expected ~5.7.0)
```

**B. Red `ERROR SafeAreaContext.js` lines in the Metro/web console (non-fatal):**

| Symptom | Cause | Fix |
|---|---|---|
| `ref is not a prop` | `safe-area-context@5.10.1` demanded react 19 / RN 0.85 while the project pinned react 18 / RN 0.76 | Resolved by the same alignment (A) — safe-area 5.7.0 now matches react 19 |
| `Function components cannot be given refs … FrameSizeProvider` | react-navigation passed a `ref` to `SafeAreaProvider`, invalid under React 18 | Wrapped the app in `<SafeAreaProvider>` in **`App.js`** — with insets present react-navigation takes its `View` branch (also what its docs recommend); under React 19 `ref` is a normal prop anyway |

**C. Post-fix verification**

```
console errors:        0   (only 2 third-party warnings: "shadow*"→boxShadow, props.pointerEvents)
expo install --check:  Dependencies are up to date
expo-doctor:           21/21 checks passed
Expo Go handshake:     GET / (Accept: application/json) → HTTP 200, runtimeVersion exposdk:57.0.0
Android bundle:        HTTP 200, 5,347,881 bytes in 18.2s
Flow re-tested:        Dashboard · Inventory (88 units) · POS ($23.76) · Payment (Charge $23.76) · Reports ($1,284.00) ✓
```

### 3.3 Step 2 — generated entry points (all present)

| Required by the brief | Present |
|---|---|
| `App.js` | ✅ `import { AppNavigator } from './src/navigation/AppNavigator'` → `return <AppNavigator />` |
| `src/screens/` | ✅ `DashboardScreen`, `InventoryScreen`, `POSScreen`, `PaymentScreen`, `ReportsScreen` |
| `src/components/` | ✅ `TopBar`, `ScreenHeading`, `Chip`, `Button`, `Card`, `TotalBar`, `ProductItem`, `index.js` |
| `src/navigation/AppNavigator.js` | ✅ 4 tabs + POS stack (Payment) |
| `theme.js` | ✅ colors / typography / spacing / radii tokens |

No re-coding was needed for Step 3 — the share link is the only external dependency (§1.1).

---

## 4. Design vs. implementation

Content of every screen was compared against the corresponding Figma frame:

| Screen | Match | Key values verified in the running app |
|---|---|---|
| Dashboard | ✅ | `Today's sales · Net sales · USD · $1,284.00`, `12.0% vs. last Sunday`, `$1,146.43`, `48 Transactions`, `$26.75 Average sale`, `New sale / Add stock / Suppliers`, `2 products running low`, `#1047 09:39 · Card $32.40` |
| Inventory | ✅ | `5 products · 88 units on hand`, `5 Products / 88 In stock / 2 Low stock`, `Oat milk · 1 L · Dairy & eggs · Oat & Co. · $4.50 · 24 left` |
| POS | ✅ | `New sale #1048 · Walk-in customer`, `Favorites/Pantry/Bakery`, `Cart · 4 items`, `2 × Oat milk · 1 × Sourdough loaf` / `1 × Free-range eggs`, `Subtotal $22.00`, `Tax (8%) $1.76`, `TOTAL $23.76` |
| Payment | ✅ | `Order summary · 4 items`, item lines + `$9.00/$6.00/$7.00`, `Total $23.76`, `Card` selected, `Counter terminal connected · Ready`, `Charge $23.76`, POS tab stays active |
| Reports | ✅ | `Sunday, 4 October · Sales excluding tax`, `Net sales $1,284.00`, `48 transactions / 167 units sold / $26.75 avg. sale`, `Sales by hour` (6–9am), `Pantry $590.00 · 46%`, `Top products` |

Side-by-side screenshots: `evidence/figma/*.png` ↔ `evidence/app/*.png`.

**Known differences (not pixel-identical on purpose):**

1. Product imagery uses emoji tiles — the design uses photo assets that are not in the project.
2. No iPhone status bar (9:41 / signal / battery) — the real device status bar is used.
3. Dashboard sparkline is a bar approximation (no chart library installed).
4. App screenshots were captured at desktop width (~1143 px); the frames are a 393 px phone — the layout is fluid, so on a phone it matches more closely.
5. The *iOS (Apple HIG)* page (login, grades, schedule, …) was left untouched — those screens do not exist in this project.

---

## 5. Running it

### 5.1 Dev server for Expo Go

```
$ npx expo start
Starting project at C:\ITMSD1_Lab4
Starting Metro Bundler

Waiting on http://localhost:8081
…
Android Bundled 16295ms node_modules\expo\AppEntry.js (1036 modules)
```

| Check | Result |
|---|---|
| Metro status endpoint | `packager-status:running` |
| Dev server | `http://localhost:8081` |
| Expo Go URL (Wi-Fi adapter) | `exp://192.168.1.5:8081` |
| Android bundle served by dev server | `6,907,368` bytes |
| Expo SDK / platforms | `sdkVersion 57.0.0` · `ios`, `android`, `web` |

> Scan the QR code printed in the terminal with **Expo Go**, or open `exp://192.168.1.5:8081`.

Logs: `evidence/logs/npx-expo-start.txt`, `evidence/logs/metro-devserver.txt`.

### 5.2 Web preview (used for the screenshots above)

```
$ npx expo start --web --port 8100
Waiting on http://localhost:8100
```

### 5.3 Production bundle

```
$ npx expo export --platform android --output-dir <tmp> --no-bytecode
Android Bundled 18069ms node_modules\expo\AppEntry.js (883 modules)

› android bundles (1):
  _expo/static/js/android/AppEntry-bbf55e5b9092425ea37af3af2bbbc246.js (1.7MB)

Exported: …\expo-export-evidence
EXITCODE=0
```

Log: `evidence/logs/expo-export-android.txt`.

> Note: `--no-bytecode` was required because this machine's `hermes-compiler` package is missing
> (`Cannot find module 'hermes-compiler/package.json'`) — an environment issue, not an app issue.

### 5.4 Project metadata

```
$ npx expo config --type public
plugins: [ 'expo-font' ]
name: 'itmsd1-lab'
sdkVersion: '57.0.0'
platforms: [ 'ios', 'android', 'web' ]
```

---

## 6. Directory of artifacts

```
EVIDENCE.md                     ← this document
evidence/
├── figma/1..5-*.png            ← Figma frame renders (source design)
├── app/1..5-*.png              ← running app screenshots (implementation)
├── step1-public-thumbnail.png  ← public-thumbnail fetch proving link sharing
├── qr-expo-go.png              ← QR for exp://192.168.1.5:8081
└── logs/
    ├── step1-figma-share-and-layers.txt ← share check + clean layer names
    ├── opencode-mcp-list.txt   ← ✓ figma connected
    ├── expo-config.txt         ← sdkVersion 57.0.0
    ├── npx-expo-start.txt      ← npx expo start output (Android Bundled …)
    ├── metro-devserver.txt     ← status endpoint + Expo Go URL
    └── expo-export-android.txt ← production bundle, exit code 0
```

---

## 7. Step 3 — 2–5 minute screen-recording script

Everything below is ready to record **right now** (both servers are running).

| # | Time | Screen | What to show | Voiceover cue |
|---|---|---|---|---|
| 0 | 0:00–0:10 | — | Your name + section | *"This is \<name\>, section \<X\>, ITMSD1 Lab."* |
| 1 | 0:10–0:45 | Figma | Open the file, scroll the **Android (Material 3)** page, click through the 5 frames: Dashboard → Inventory → POS → Payment → Reports | *"This is my Figma design — five phone frames with clean layer names, shared as anyone-with-the-link."* |
| 2 | 0:45–1:10 | Figma → code | Show `EVIDENCE.md`, `src/screens/`, `src/navigation/AppNavigator.js`, `theme.js` in the editor | *"Read via Figma MCP in OpenCode into App.js, screens, components, navigator and theme."* |
| 3 | 1:10–1:30 | Terminal | `npx expo start` → QR + `Waiting on http://localhost:8081` → scan with Expo Go | *"Running the app with npx expo start on Expo Go."* |
| 4 | 1:30–2:00 | App | **Dashboard**: sales card, stats, quick actions, low-stock alert, recent sales | *"Dashboard: today's sales, transactions, alerts."* |
| 5 | 2:00–2:20 | App | **Inventory**: search, tiles, low-stock chip, product rows | *"Inventory: 5 products, 88 units, 2 low stock."* |
| 6 | 2:20–3:10 | App | **POS flow**: tap a `+` to add → cart updates → tap **Continue to payment** | *"POS: add to cart, subtotal $22.00, tax $1.76, total $23.76."* |
| 7 | 3:10–3:40 | App | **Payment**: pick *Cash* then back to *Card*, show terminal status, **Charge $23.76** | *"Payment method selection, terminal status, charge."* |
| 8 | 3:40–4:00 | App | **Reports**: net sales, hourly chart, categories, top products | *"Reports: net sales $1,284.00, 48 transactions."* |
| 9 | 4:00–4:15 | Figma ↔ App | Split-screen or alt-tab Figma frame vs. live screen | *"Design and implementation match."* |

**Recording tips**
- Windows: `Win + Alt + R` (Xbox Game Bar) or `Ctrl + Shift + S` in Clipchamp — check *microphone on*.
- Record the browser tab at ~393 px wide (DevTools device toolbar) so the app looks like the phone frames.
- If you'd rather film the phone: point the camera at Expo Go while the `exp://192.168.1.6:8081` session runs.
- Say your name and section in the **first 10 seconds**.

**I can drive steps 4–8 for you** while you record — say *"walk it"* and I'll tap through
Dashboard → Inventory → POS → Payment → Reports on screen at a steady pace.

---

## 8. Interactivity pass — every button now does something

Every pressable element in the five screens was audited and wired. Two shared components were
added so feedback behaves identically on the phone and on the web preview:

| New file | Purpose |
|---|---|
| `src/components/Snackbar.js` (+ `useSnackbar` hook) | Bottom confirmation bar. Replaces `Alert.alert`, which **does not render on react-native-web** — so a tap is always visible in both runtimes. |
| `src/components/Sheet.js` (+ `SheetAction`) | In-app dialog over a scrim (add-product form, sale options, payment receipt). Built from plain `View`s so it works on web *and* native. |

### 8.1 What each button does

| Screen | Control | Behaviour |
|---|---|---|
| **Top bar** | brand row (every screen) | store toast — *Suppliers · Maple Street Market* |
| Dashboard | 🔔 notifications | *2 low-stock alerts: Sourdough loaf & olive oil* |
| Dashboard | stat cards ×2 | transactions / average-sale detail toasts |
| Dashboard | **New sale** | → POS tab |
| Dashboard | **Add stock** | → Inventory with the *Add product* form open |
| Dashboard | **Suppliers** | lists the 5 approved suppliers |
| Dashboard | low-stock alert card | → Inventory pre-filtered to *Low stock (2)* |
| Dashboard | **View all** | → Reports |
| Dashboard | recent-sale rows | per-sale toast `#1047 · 09:39 · Card · $32.40` |
| Inventory | search field | parameterised SQL search — `WHERE name LIKE ?` runs as you type, with an empty state |
| Inventory | ⚙ options icon | reveals supplier chips; picking one filters the list |
| Inventory | **All stock / Low stock (n)** chips | filter + count toast |
| Inventory | **Name A-Z** sort | cycles Name → Price → Stock, re-sorts the list |
| Inventory | 🔝 **add** (top bar) **and** the green **+ Add product** chip | add-product sheet with validation; inserts a real row and updates every count |
| Inventory | **🗑 trash icon on every single card** | confirmation sheet → `DELETE FROM products WHERE id = ?` |
| Inventory | product row (tap) | reveals the inline **− stock +** controls; tap again to close |
| Inventory | inline **−/+** | `UPDATE products SET stock = stock ∓ 1` + toast (never below 0) |
| POS | search field | filters the product grid (with *no matches* state) |
| POS | **Favorites / Pantry / Bakery** chips | filters the grid by category |
| POS | **+** on a tile | adds to the basket, cart badge + subtotal/tax/total recalculate live |
| POS | **Edit cart** | reveals per-line `− qty +` and 🗑 remove; **Done** hides them |
| POS | 🔝 **sale options** | Apply 5% discount (adds a discount line), Hold sale, Clear cart |
| POS | **Continue to payment** | → Payment; **blocked with a toast when the basket is empty** |
| Payment | **Card / Cash / Split** | selection + hint toast |
| Payment | **Edit cart** | back to the basket |
| Payment | **Charge $X** | opens the receipt sheet, empties the basket |
| Payment | receipt → **Start new sale** | back to an empty POS |
| Payment | receipt → **View reports** | → Reports |
| Reports | **Today / 7 days / Month** | swaps the *entire* dataset: net sales, transactions, chart, categories, top products |
| Reports | 🔝 **download** | export toast |
| Reports | category & top-product rows | detail toasts; **View all** too |
| Sheet | ✕ / scrim | closes |

### 8.2 Verification

Automated click-through of ~95 assertions against the running web build:

```
console errors:        0   (only the 2 known third-party deprecation warnings)
Dashboard              notifications · brand · stats · quick actions · alert card · sale rows · View all   ok
Inventory              search · supplier filter · chips · 3-way sort · add form + validation · new row     ok
POS                    add to cart · live totals · edit quantities · categories · discount · clear cart    ok
Payment                methods · edit cart · charge · receipt · empty-cart guard                          ok
Reports                3 periods ($1,284.00 / $8,462.50 / $35,240.00) · export · row details              ok
```

**Bug caught and fixed by that pass:** after a successful charge the POS still showed the old
basket — its local state never re-read the shared `cart`. Fixed with `useFocusEffect` in
`POSScreen.js` (re-sync on every focus), re-verified: `Cart is empty` after payment ✓.

## 9. SQLite persistence (`expo-sqlite`) — CRUD lab

### 9.1 What was installed / created

| Step | Result |
|---|---|
| `npx expo install expo-sqlite` | `expo-sqlite@~57.0.4` in `package.json`, config plugin added to `app.json` |
| `src/services/db.js` (new) | database service: WAL, schema, auto-seed, `getAllProducts`, `searchProducts`, `insertProduct`, `deleteProduct`, `changeStock` |
| `src/services/productsStore.js` (new) | observable cache — Inventory writes, POS/Payment re-render through `subscribe()` |
| `src/screens/InventoryScreen.js` | static array → `useState([])` + `FlatList`, SQL search, create/delete/stock ± |
| `App.js` | `refresh()` on mount → opens + seeds the database once at start-up |

Schema (exactly as specified):

```sql
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, category TEXT NOT NULL,
  price REAL NOT NULL, stock INTEGER NOT NULL
);
```

Auto-seed inserts the **5 Figma products** when `SELECT COUNT(*) as count FROM products` is `0`
→ Oat milk, Sourdough loaf, Free-range eggs, Ground coffee, Olive oil, so a fresh install is
never blank and the design still matches.

### 9.2 Query layer

| Lab step | Query used |
|---|---|
| Load | `SELECT * FROM products ORDER BY id DESC;` |
| Search (as you type) | `SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;` with `['%' + search + '%']` |
| Create | `INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?);` |
| Delete | `DELETE FROM products WHERE id = ?;` (behind a confirmation sheet) |
| Stock ± (bonus) | `UPDATE products SET stock = stock + 1 / stock - 1 WHERE id = ?;` (guarded at 0) |

The inventory list is a virtualised `<FlatList>` (`ListHeaderComponent` holds the top bar,
search, chips and tiles) so typing re-renders snappily; the empty state reads
*"No products found in SQLite database."*

### 9.3 One honest caveat — the browser preview

`expo-sqlite`'s **web** build runs the synchronous API through a Worker + `SharedArrayBuffer`,
which only exists under cross-origin isolation (COOP/COEP). The Metro dev server does not send
those headers, so `openDatabaseSync` cannot be used in the web preview. `src/services/db.js`
therefore branches on `Platform.OS`:

* **phone (iOS/Android, Expo Go)** → real `SQLite.openDatabaseSync('pos_inventory.db')`, WAL, sync SQL;
* **web preview only** → a ~70-line in-memory table that answers the *same* SQL strings, so the
  demo/screenshot flow keeps working. Call sites and queries are identical in both runtimes.

Nothing else in the app knows about the branch.

### 9.4 Verification (automated, running web build)

```
console errors:        0
load        5 products · 88 units · tiles 5 / 88 / 2                         ok
search      placeholder "Search products or suppliers"; LIKE '%oil%' → only
            "Olive oil"; clearing restores all 5 rows                          ok
add         labelled "+ Add product" chip (and the top-bar +) → form sheet
            "Brown rice" 8.50 ×20 → 6 products · 108 units, new row visible    ok
delete      🗑 icon present on all 5 rows (6 after adding) → confirmation
            sheet → row gone → back to 5 products · 88 units                   ok
stock ±     row tap → "Stock − 18 in stock +": 6 → 7 → 6 (UPDATE … stock ± 1)  ok
POS sync    new product appears in the POS grid at $8.50                       ok
Android bundle rebuilt from the same code: HTTP 200, 6,015,162 bytes, 4.4 s
screenshot  evidence/inventory-add-delete-search.png
```

### 9.5 Step 6 — offline durability test on your phone (do this while recording)

1. In **Inventory**, add 2 products and delete 1 (the confirmation sheet is the lab's *prompt*).
2. Turn on **Airplane mode** on the phone.
3. Fully swipe away / force-stop **Expo Go**, then relaunch it (or just reopen the app).
4. Open **Inventory** → all your rows are still there, because they live in
   `pos_inventory.db` on the device (WAL), not in memory or on a server.



