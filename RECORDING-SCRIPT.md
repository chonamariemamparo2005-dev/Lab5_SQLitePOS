# Video Script — Figma → Expo SDK 57 (Suppliers / POS)

**Total: ~4 min 15 s** (allowed: 2–5 min) · **Mic on · say your name + section in the first 10 seconds**

---

## ⚙️ Before you hit record (60 seconds)

- [ ] PC and phone on the **same Wi-Fi** — confirm the IP: `ipconfig` → IPv4 (currently **192.168.1.6**)
- [ ] Dev server running: `npx expo start` → terminal shows `Waiting on http://localhost:8081`
- [ ] **Force-close Expo Go** on the phone, then reopen it
- [ ] Scan the QR (`evidence/qr-expo-go.png`) → app loads **Dashboard**
- [ ] Open the Figma file in a browser tab, zoomed so the 5 frames are visible
- [ ] Have the editor open on `src/screens/DashboardScreen.js`
- [ ] Mic test: `Win + Alt + R` (Xbox Game Bar) or Clipchamp — **tick the microphone**

---

## 🎬 SCENE 1 — Title / intro (0:00 – 0:10)

**On screen:** your desktop, webcam bubble or just the desktop
**Say:**

> "Hi, this is **[YOUR FULL NAME]**, section **[YOUR SECTION]**, for ITMSD1 Lab.
> This is my submission: I converted my Figma design into a working Expo SDK 57 app
> using Figma MCP inside OpenCode, and I'm running it on Expo Go."

---

## 🎬 SCENE 2 — The Figma design (0:10 – 0:50)

**On screen:** Figma, the **Android (Material 3)** page

**Do:** scroll/hover across the 5 frames — **Dashboard → Inventory → POS → Payment → Reports**
**Say:**

> "This is the design file, ITMSD1 Lab Mamparo. The Android page has five phone frames
> with clean layer names: Dashboard, Inventory, POS, Payment and Reports.
> Sharing is set to *Anyone with the link can view* — I verified the link opens in an
> incognito window. There's also an iOS page and a colour-system page."

**Optional click:** `Share` → show *Anyone with the link* → close.

---

## 🎬 SCENE 3 — Design → code via Figma MCP + OpenCode (0:50 – 1:20)

**On screen:** code editor (`App.js`, then `src/screens/`), or `EVIDENCE.md`

**Do:** open `App.js`, then expand `src/screens/` and `src/navigation/AppNavigator.js`
**Say:**

> "Using the Figma MCP server in OpenCode, the frames were generated into App.js,
> src/screens, src/components, src/navigation/AppNavigator.js and theme.js —
> Dashboard, Inventory, POS, Payment and Reports.
> The shared top bar, chips and headings live in src/components,
> and the tab bar is configured in AppNavigator."

**Optional:** show the terminal line `opencode mcp list` → `✓ figma connected`

---

## 🎬 SCENE 4 — Running it with `npx expo start` (1:20 – 1:50)

**On screen:** terminal → then the phone

**Do:** show the terminal output, then scan the QR with Expo Go
**Say:**

> "I run it with npx expo start. Metro is waiting on port 8081, and I scan the QR code
> with Expo Go on the same Wi-Fi network.
> The build is healthy: expo-doctor reports twenty-one of twenty-one checks passed."

**Show on screen (terminal):**
```
$ npx expo start
Waiting on http://localhost:8081
$ npx expo-doctor        →  21/21 checks passed
```

---

## 🎬 SCENE 5 — Dashboard (1:50 – 2:15)

**On screen:** app on the phone (or browser in device mode)
**Say:**

> "Landing on Dashboard: today's sales of one thousand two hundred eighty-four dollars,
> forty-eight transactions, an average sale of twenty-six seventy-five,
> quick actions, a low-stock alert for two products, and recent sales below."

---

## 🎬 SCENE 6 — Inventory + SQLite CRUD (2:15 – 2:40)

**Do:** tap the **Inventory** tab; tap the *Low stock (2)* chip, then back to *All stock*;
then tap **one product row** (e.g. Olive oil) → tap **+** once and **−** once
**Say:**

> "Inventory: five products, eighty-eight units on hand, two low in stock.
> Each row shows the unit, category, supplier, price and remaining stock,
> and the low-stock chip filters the list.
> Every row is stored in SQLite — tap it and you get the stock buttons and the delete
> button, and searching runs a parameterised SQL query as I type."

---

## 🎬 SCENE 7 — POS flow (2:40 – 3:15)  ← the important one

**Do:** tap **POS** → tap a **+** on a product → tap **Continue to payment**
**Say:**

> "The POS screen: search and scan, category chips, and the product grid.
> Adding to the cart updates it — four items, subtotal twenty-two dollars,
> tax at eight per cent one seventy-six, total twenty-three seventy-six.
> Tapping Continue to payment pushes the Payment screen, with the POS tab still active."

**Show on screen:** the cart card reading
`Subtotal $22.00 · Tax (8%) $1.76 · TOTAL $23.76`

---

## 🎬 SCENE 8 — Payment (3:15 – 3:40)

**Do:** tap **Cash**, then back to **Card**; scroll to the charge button
**Say:**

> "Payment: the order summary with all four items, then the payment methods —
> card, cash or split payment — with the terminal showing connected and ready.
> Charging twenty-three seventy-six completes the sale."

**Show on screen:** `Charge $23.76` button + `Counter terminal connected · Ready`

---

## 🎬 SCENE 9 — Reports (3:40 – 4:00)

**Do:** tap **Reports**; tap the **7 days** chip
**Say:**

> "Reports for Sunday the fourth of October: net sales of one thousand two hundred
> eighty-four dollars, forty-eight transactions and a twenty-six seventy-five average,
> sales by hour, sales by category — pantry forty-six, dairy thirty-five, bakery nineteen —
> and the top products."

---

## 🎬 SCENE 10 — Design vs. app + wrap (4:00 – 4:15)

**On screen:** alt-tab — Figma frame beside the running app
**Say:**

> "Comparing side by side, the live app matches the Figma frames.
> That was the full workflow: Figma design, Figma MCP with OpenCode,
> an Expo SDK 57 app, running on Expo Go.
> This is **[YOUR FULL NAME]**, section **[YOUR SECTION]**. Thanks."

---

## 🎬 SCENE 11 (optional) — SQLite durability (4:15 – 4:45)

*Only if your instructor wants the offline proof on video — otherwise send it as a separate clip.*

**Do:** in Inventory tap **+ Add**, create two products, delete one; then enable **Airplane mode**,
force-close **Expo Go**, reopen it, and open **Inventory** again
**Say:**

> "Adding two products and deleting one runs real SQL: insert, delete and update.
> With airplane mode on and Expo Go restarted, the rows are still here —
> the data lives in `pos_inventory.db` on the phone, not on a server."

**Show on screen:** the rows you created still listed after the relaunch

---

## 🎹 Recording notes

- **If you can't film the phone**, record the browser instead: open `http://localhost:8100`,
  press `F12` → device-toolbar → **393 px wide**, and say the same lines.
  Replace Scene 4's wording with: *"…and here is the same React Native app running through
  react-native-web at phone width."*
- **Keep it inside 2–5 minutes** — if you need to cut, drop Scene 3 and Scene 10.
- Say your **name and section out loud** in Scene 1 (and again at the end).
- Save as **`ITMSD1-Lab4_[YourName]_video.mp4`**.
- Evidence folder (`EVIDENCE.md`, `evidence/`) can be shown briefly but is not a substitute
  for the recording.

## ✅ Values you'll mention (memorise these six)

| Screen | Value |
|---|---|
| Dashboard | **$1,284.00** · 48 transactions · **$26.75** avg |
| Inventory | **5** products · **88** units · **2** low stock |
| POS | 4 items · **$22.00** + **$1.76** tax = **$23.76** |
| Payment | Card / Cash / Split · **Charge $23.76** |
| Reports | **$1,284.00** · Pantry 46% · Dairy 35% · Bakery 19% |
