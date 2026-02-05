import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortfolioProvider } from './src/context/PortfolioContext';
import PortfolioDashboard from './src/screens/PortfolioDashboard';
import Holdings from './src/screens/Holdings';
import AddTransaction from './src/screens/AddTransaction';
import GoalsScreen from './src/screens/GoalsScreen';
import CashManager from './src/screens/CashManager';
import { darkTheme } from './src/utils/theme';
import CustomTabBar from './src/components/CustomTabBar';

// Suppress the pointerEvents deprecation warning from React Native Web
// This is a known issue with React Navigation and will be fixed in future versions
LogBox.ignoreLogs([
  'props.pointerEvents is deprecated',
]);

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <PortfolioProvider>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: darkTheme.primary,
            background: darkTheme.background,
            card: darkTheme.surface,
            text: darkTheme.text,
            border: darkTheme.border,
            notification: darkTheme.error,
          },
          fonts: {
            regular: {
              fontFamily: 'System',
              fontWeight: '400',
            },
            medium: {
              fontFamily: 'System',
              fontWeight: '500',
            },
            bold: {
              fontFamily: 'System',
              fontWeight: '600',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '700',
            },
          },
        }}
      >
        <StatusBar style="light" />
        <Tab.Navigator
          tabBar={props => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false, // Hide default header for custom implementation in screens
            tabBarActiveTintColor: darkTheme.primary,
            tabBarInactiveTintColor: darkTheme.textSecondary,
          }}
        >
          <Tab.Screen
            name="Portfolio"
            component={PortfolioDashboard}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="📊" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Holdings"
            component={Holdings}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="📈" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddTransaction}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="➕" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Goals"
            component={GoalsScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="🎯" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Cash"
            component={CashManager}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <TabBarIcon name="💰" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PortfolioProvider>
  );
}

// Simple emoji-based icon component
function TabBarIcon({ name, color, size }) {
  return (
    <Text style={{ fontSize: size }}>
      {name}
    </Text>
  );
}
