// Custom personalized theme with unique brand colors
export const darkTheme = {
  // Sophisticated navy-blue base with warm accents
  background: '#0A1929',      // Deep navy blue background
  surface: '#132F4C',         // Lighter navy for cards
  card: '#1A3A52',            // Subtle card variation
  
  // Unique brand colors - blue/teal/gold palette
  primary: '#2E7D9A',         // Professional teal-blue
  primaryLight: '#48A9C5',    // Lighter variant
  primaryDark: '#1F5673',     // Darker variant
  
  secondary: '#F4A261',       // Warm golden accent
  accent: '#E76F51',          // Coral-red accent for highlights
  success: '#06D6A0',         // Bright teal for success
  error: '#EF476F',           // Modern pink-red for errors
  warning: '#F4A261',         // Golden warning
  info: '#48A9C5',            // Light blue info
  
  // Text colors
  text: '#E8F1F5',           // Soft white for main text
  textSecondary: '#94A3B8',  // Slate gray for secondary text
  textMuted: '#64748B',      // Muted gray
  
  // UI elements
  border: '#1E3A52',         // Subtle border
  divider: '#1E3A52',        // Divider line
  
  // Chart specific colors
  chart: {
    line: '#2E7D9A',         // Primary chart line
    gradient: ['#2E7D9A', '#48A9C5', '#06D6A0'],  // Multi-color gradient
    grid: '#1E3A52',         // Grid lines
    label: '#94A3B8',        // Label text
    positive: '#06D6A0',     // Positive values
    negative: '#EF476F',     // Negative values
  },
  
  // Enhanced shadow for depth
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  
  // Subtle shadow for smaller elements
  shadowSmall: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  
  // Gradient backgrounds
  gradients: {
    primary: ['#2E7D9A', '#1F5673'],
    secondary: ['#F4A261', '#E76F51'],
    success: ['#06D6A0', '#2E7D9A'],
    card: ['#132F4C', '#1A3A52'],
  },
};
