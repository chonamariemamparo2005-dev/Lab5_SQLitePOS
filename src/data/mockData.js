export const products = [
  { id: 1, name: 'Oat milk', price: 4.5, image: '🥛', category: 'Dairy & eggs', unit: '1 L', supplier: 'Oat & Co.', stock: 24, favorite: true },
  { id: 2, name: 'Sourdough loaf', price: 6.0, image: '🍞', category: 'Bakery', unit: '500 g', supplier: 'Daly Bake', stock: 8, favorite: true },
  { id: 3, name: 'Free-range eggs', price: 7.0, image: '🥚', category: 'Dairy & eggs', unit: '6 pack', supplier: 'Meadow Farm', stock: 18, favorite: true },
  { id: 4, name: 'Ground coffee', price: 14.0, image: '☕', category: 'Pantry', unit: '250 g', supplier: 'North Roasters', stock: 32, favorite: true },
  { id: 5, name: 'Olive oil', price: 12.0, image: '🫒', category: 'Pantry', unit: '500 ml', supplier: 'Grove Supply', stock: 6, favorite: true },
];

export const cart = [
  { productId: 1, quantity: 2 },
  { productId: 2, quantity: 1 },
  { productId: 3, quantity: 1 },
];

export const subtotal = 22.0;
export const taxRate = 0.08;
export const tax = 1.76;
export const total = 23.76;

export const stats = {
  todaySales: 1284.0,
  lastSales: 1146.43,
  growth: '12.0%',
  transactions: 48,
  averageSale: 26.75,
  unitsSold: 167,
  productCount: 5,
  lowStockCount: 2,
};

export const store = {
  name: 'Suppliers',
  location: 'Maple Street Market',
  date: 'Sunday, 4 October',
};

export const recentSales = [
  { id: '1047', time: '09:39', method: 'Card', amount: 32.4 },
  { id: '1046', time: '09:31', method: 'Cash', amount: 18.9 },
  { id: '1045', time: '09:24', method: 'Card', amount: 27.0 },
];

export const salesByHour = [
  { label: '6am', value: 180 },
  { label: '7am', value: 255 },
  { label: '8am', value: 360 },
  { label: '9am', value: 470 },
];

export const salesByCategory = [
  { label: 'Pantry', amount: 590.0, percent: 46 },
  { label: 'Dairy & eggs', amount: 454.0, percent: 35 },
  { label: 'Bakery', amount: 240.0, percent: 19 },
];

export const topProducts = [
  { name: 'Ground coffee', sold: 25, amount: 350.0 },
  { name: 'Olive oil', sold: 20, amount: 240.0 },
  { name: 'Sourdough loaf', sold: 19, amount: 114.0 },
];

export const paymentMethods = [
  { id: 'card', label: 'Card', hint: 'Debit or credit · Contactless' },
  { id: 'cash', label: 'Cash', hint: 'Accept cash at the counter' },
  { id: 'split', label: 'Split payment', hint: 'Use more than one method' },
];

export const suppliers = [
  'Oat & Co.',
  'Daly Bake',
  'Meadow Farm',
  'North Roasters',
  'Grove Supply',
];

/** Every Reports period drives its own numbers, chart and breakdowns. */
export const reportData = {
  Today: {
    netSales: 1284.0,
    transactions: 48,
    unitsSold: 167,
    averageSale: 26.75,
    growth: '12.0%',
    growthLabel: 'vs. last Sunday',
    chartTitle: 'Sales by hour',
    chartMax: 500,
    chartUnit: 'USD',
    chart: [
      { label: '6am', value: 180 },
      { label: '7am', value: 255 },
      { label: '8am', value: 360 },
      { label: '9am', value: 470 },
    ],
    categories: [
      { label: 'Pantry', amount: 590.0, percent: 46 },
      { label: 'Dairy & eggs', amount: 454.0, percent: 35 },
      { label: 'Bakery', amount: 240.0, percent: 19 },
    ],
    top: [
      { name: 'Ground coffee', sold: 25, amount: 350.0 },
      { name: 'Olive oil', sold: 20, amount: 240.0 },
      { name: 'Sourdough loaf', sold: 19, amount: 114.0 },
    ],
  },
  '7 days': {
    netSales: 8462.5,
    transactions: 312,
    unitsSold: 1104,
    averageSale: 27.12,
    growth: '8.4%',
    growthLabel: 'vs. previous 7 days',
    chartTitle: 'Sales by day',
    chartMax: 2000,
    chartUnit: 'USD',
    chart: [
      { label: 'M', value: 1180 },
      { label: 'T', value: 940 },
      { label: 'W', value: 1320 },
      { label: 'T', value: 1105 },
      { label: 'F', value: 1490 },
      { label: 'S', value: 1760 },
      { label: 'S', value: 667.5 },
    ],
    categories: [
      { label: 'Pantry', amount: 3890.0, percent: 46 },
      { label: 'Dairy & eggs', amount: 3050.0, percent: 36 },
      { label: 'Bakery', amount: 1522.5, percent: 18 },
    ],
    top: [
      { name: 'Ground coffee', sold: 174, amount: 2436.0 },
      { name: 'Olive oil', sold: 132, amount: 1584.0 },
      { name: 'Sourdough loaf', sold: 118, amount: 708.0 },
    ],
  },
  Month: {
    netSales: 35240.0,
    transactions: 1327,
    unitsSold: 4712,
    averageSale: 26.56,
    growth: '15.2%',
    growthLabel: 'vs. previous month',
    chartTitle: 'Sales by week',
    chartMax: 10000,
    chartUnit: 'USD',
    chart: [
      { label: 'W1', value: 8120 },
      { label: 'W2', value: 8940 },
      { label: 'W3', value: 9360 },
      { label: 'W4', value: 8820 },
    ],
    categories: [
      { label: 'Pantry', amount: 16560.0, percent: 47 },
      { label: 'Dairy & eggs', amount: 12334.0, percent: 35 },
      { label: 'Bakery', amount: 6346.0, percent: 18 },
    ],
    top: [
      { name: 'Ground coffee', sold: 742, amount: 10388.0 },
      { name: 'Olive oil', sold: 586, amount: 7032.0 },
      { name: 'Sourdough loaf', sold: 512, amount: 3072.0 },
    ],
  },
};
