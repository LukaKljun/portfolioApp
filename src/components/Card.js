import React from 'react';
import { View, StyleSheet } from 'react-native';
import { darkTheme } from '../utils/theme';

export default function Card({ children, style, variant = 'default' }) {
  return (
    <View style={[
      styles.card, 
      variant === 'primary' && styles.primaryCard,
      style
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: darkTheme.surface,
    borderRadius: 8, // Tighter radius for pro look
    padding: 16,
    borderWidth: 1,
    borderColor: darkTheme.border,
    ...darkTheme.shadow,
  },
  primaryCard: {
    backgroundColor: darkTheme.primary,
    borderColor: darkTheme.primary,
  }
});
