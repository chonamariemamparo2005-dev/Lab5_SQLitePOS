const colors = {
  primary: '#20332F',
  onPrimary: '#FFFFFF',
  secondary: '#176B5B',
  onSecondary: '#FFFFFF',
  accent: '#007AFF',
  onAccent: '#FFFFFF',
  secondaryAccent: '#34C759',
  onSecondaryAccent: '#FFFFFF',
  background: '#F6F5F0',
  surface: '#FFFFFF',
  onBackground: '#20332F',
  onSurface: '#20332F',
  muted: '#74807A',
  divider: '#D1D1D6',
  cardBorder: '#EDEBE3',
  tint: '#E4F0EA',
  tintStrong: '#D6E9DF',
  amber: '#A96A12',
  amberBg: '#FBEEDA',
  error: '#FF3B30',
  success: '#30D158',
  cartBadge: '#00758F',
  white: '#FFFFFF',
  black: '#000000',
  likeTint: rgba => `rgba(0, 122, 255, ${rgba})`,
};

const typography = {
  fontFamily: {
    inter: 'Inter',
    sfPro: 'SF Pro',
  },
  fontSize: {
    xs: 10,
    sm: 11,
    md: 12,
    lg: 13,
    xl: 14,
    xxl: 15,
    xxxl: 16,
    display: 20,
    heading: 22,
    hero: 24,
    bigHeading: 28,
    displayBold: 34,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    loose: 1.6,
  },
};

const spacing = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  xxxl: 20,
  section: 24,
  padding: 32,
};

const radii = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 16,
  full: 100,
};

const shadows = {
  sm: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
  md: '0px 4px 8px 0px rgba(0, 0, 0, 0.08)',
  lg: '0px 2px 8px 0px rgba(0, 0, 0, 0.08)',
  xl: '0px 4px 10px 0px rgba(0, 0, 0, 0.08)',
};

export { colors, typography, spacing, radii, shadows };