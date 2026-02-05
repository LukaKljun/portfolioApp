import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { darkTheme } from '../utils/theme';

const { width } = Dimensions.get('window');

// Custom Tab Bar implementation
export default function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.container}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <View style={styles.tabRow}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            
            // Get label and icon from options or defaults
            const label = options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

            const icon = options.tabBarIcon 
              ? options.tabBarIcon({ focused: isFocused, color: isFocused ? '#FFF' : darkTheme.textSecondary, size: 24 }) 
              : null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabButton}
              >
                {/* Active Indicator Background */}
                {isFocused && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    style={[StyleSheet.absoluteFill, styles.activeBackground]}
                  />
                )}
                
                <View style={styles.iconContainer}>
                  {icon}
                  {isFocused && <Text style={styles.label}>{label}</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 30,
    overflow: 'hidden',
    ...darkTheme.shadow,
  },
  blurContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(20, 20, 30, 0.6)', // Semi-transparent base
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabRow: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeBackground: {
    backgroundColor: darkTheme.primary,
    borderRadius: 20,
    margin: 8,
    opacity: 0.8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    color: '#FFF',
    marginTop: 2,
    fontWeight: 'bold',
  },
});
