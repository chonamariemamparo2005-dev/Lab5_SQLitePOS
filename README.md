# ITMSD1 Lab - Mamparo

Expo React Native prototype converting Figma mobile design into a working app that runs on Expo Go.

## Project Structure

```
ITMSD1_Lab4/
├── App.js                  # Main app entry point
├── package.json            # Project dependencies
├── theme.js                # Design tokens (colors, typography, spacing, radii, shadows)
├── src/
│   ├── AppNavigator.js     # Navigation (bottom tabs + native stack)
│   ├── data/
│   │   └── mockData.js     # Mock products, cart, total, payment methods
│   ├── components/
│   │   ├── Button.js       # Primary/secondary/ghost buttons
│   │   ├── Card.js         # Card component with elevation
│   │   ├── ProductItem.js  # Product card with add-to-cart
│   │   └── TotalBar.js     # Cart total with checkout button
│   │   └── index.js        # Component re-exports
│   └── screens/
│       ├── DashboardScreen.js    # Main screen with product grid and total
│       ├── InventoryScreen.js    # Product list with search/filter
│       ├── POSScreen.js          # Point-of-sale screen
│       ├── ReportsScreen.js      # Summary cards and chart
│       ├── HomeScreen.js         # Tab icon: Home
│       ├── ScheduleScreen.js     # Tab icon: Schedule
│       ├── NewsScreen.js         # Tab icon: News
│       └── ProfileScreen.js      # Tab icon: Profile
└── node_modules/           # Installed packages
```

## Screens & Navigation

### Bottom Tabs (main screens)
- **Dashboard** - Overview with product grid, total $240.00
- **Inventory** - Product list with search functionality
- **POS** - Point-of-sale interface for adding products to cart
- **Reports** - Summary cards and weekly sales chart

### Native Stack (flow screens)
- **Home → Schedule → News → Profile** - Main tab navigation
- **Dashboard → POS → Payment** - Purchase flow
  - Dashboard: Tap products to add to cart
  - POS: View cart, proceed to payment
  - Payment: Select payment method, confirm → success state → back to Dashboard

### Tab Icons
- **Home** - House icon
- **Schedule** - Calendar icon
- **News** - Newscaster icon
- **Profile** - User icon

## Design Tokens (from Figma)

### Colors
- `#20332F` - Primary dark navy (headings, primary text)
- `#176B5B` - Teal (secondary actions)
- `#007AFF` - Blue (accent)
- `#34C759` - Green (success)
- `#FF3B30` - Red (error)
- `#74807A` - Muted text
- `#D1D1D6` - Divider
- `#F6F5F0` - Light background
- `#FFFFFF` - White

### Typography
- Font Family: Inter (primary), SF Pro (secondary)
- Font sizes: 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 20px, 22px, 24px, 28px, 34px
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
- xs: 4px, sm: 6px, md: 8px, lg: 10px, xl: 12px, xxl: 16px, xxxl: 20px
- section: 24px, padding: 32px

### Border Radii
- sm: 6px, md: 8px, lg: 10px, xl: 12px, xxl: 16px, full: 100px

### Shadows
- sm: 0px 2px 4px rgba(0,0,0,0.08)
- md: 0px 4px 8px rgba(0,0,0,0.08)
- lg: 0px 2px 8px rgba(0,0,0,0.08)

## Available Scripts

```bash
npm install        # Install dependencies
npx expo start     # Start the development server
# Scan QR code in Expo Go to view the app
npx expo start --tunnel  # Use if network blocks the default QR code
```

## App Flow Demo

1. **Start** on Dashboard screen - see products grid and total $240.00
2. **Tap a product** - adds to cart, quantity can be increased
3. **View Cart** - cart total updates live
4. **Proceed to POS** - navigate to POS screen
5. **Add more products** in POS mode
6. **Proceed to Payment** - select payment method (Card/Cash/Mobile)
7. **Confirm payment** - success state, then back to Dashboard
8. **Use bottom tabs** to navigate between Dashboard, Inventory, POS, Reports
9. **Search/Filter** in Inventory screen works on mock data

## Packages Used (Expo Go compatible)

- `@react-navigation/native` - Navigation core
- `@react-navigation/bottom-tabs` - Bottom tab navigator
- `@react-navigation/native-stack` - Native stack navigator
- `react-native-screens` - Performance optimization
- `react-native-safe-area-context` - Notch/status bar safety
- `@expo/vector-icons` - Icon library
- `expo-font` - Font loading support

## Commands to Start the App

```bash
npm install
npx expo start
# Or if network blocks:
npx expo start --tunnel
```

Scan the QR code with Expo Go on your physical device to view the app.

## Notes

- All mock data is hardcoded in `src/data/mockData.js`
- No API tokens or secrets are used
- SafeAreaView used throughout for notch/status bar compatibility
- Fixed bottom bars (TotalBar, tab bar) stay visible
- No chart libraries used - Reports chart built from Views
- Product quantity toggles (add/remove) with live total updates