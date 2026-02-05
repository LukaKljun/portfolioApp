export const darkTheme = {
  // Base Colors - Professional Dark Mode
  background: '#0b1016', // Deep Midnight Navy (Delta/Binance feel)
  surface: '#151a21', // Slightly Lighter Navy for cards
  card: '#151a21', // Alias for surface
  
  // Brand/Action Colors
  primary: '#2962FF', // Professional Blue (Yahoo Finance / Coinbase)
  secondary: '#848e9c', // Standard financial grey
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#848e9c', // Muted grey for labels
  
  // Status Colors (Solid, High Contrast)
  success: '#00C087', // Financial Green
  error: '#F6465D', // Financial Red
  warning: '#F0B90B', // Crypto Yellow/Gold
  
  // Borders
  border: '#2a2e39',
  
  // Shadows (Subtle)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Gradients (Subtle to none for Pro feel, mostly solid)
  gradients: {
    primary: ['#2962FF', '#1E88E5'], // Subtle blue gradient for primary buttons
  },

  // Asset Specific (kept for icons)
  assets: {
    bitcoin: '#F7931A',
    ethereum: '#627EEA',
    tether: '#26A17B',
    bnb: '#F0B90B',
    cardano: '#0033AD',
    solana: '#00FFA3',
    polkadot: '#E6007A',
    dogecoin: '#C2A633',
    stock: '#2962FF',
  }
};
