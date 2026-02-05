import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortfolioProvider } from './src/context/PortfolioContext';
import PortfolioDashboard from './src/screens/PortfolioDashboard';
import Holdings from './src/screens/Holdings';
import AddTransaction from './src/screens/AddTransaction';
import CashManager from './src/screens/CashManager';
import { darkTheme } from './src/utils/theme';

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
            notification: darkTheme.secondary,
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
          screenOptions={{
            tabBarStyle: {
              backgroundColor: darkTheme.surface,
              borderTopColor: darkTheme.border,
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 60,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarActiveTintColor: darkTheme.primaryLight,
            tabBarInactiveTintColor: darkTheme.textMuted,
            headerStyle: {
              backgroundColor: darkTheme.surface,
              borderBottomColor: darkTheme.border,
              borderBottomWidth: 1,
              elevation: 0,
              shadowOpacity: 0,
            },
            headerTintColor: darkTheme.text,
            headerTitleStyle: {
              fontWeight: '700',
              fontSize: 18,
              letterSpacing: -0.5,
            },
          }}
        >
          <Tab.Screen
            name="Portfolio"
            component={PortfolioDashboard}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="💼" color={color} size={size} />
              ),
              headerTitle: 'Portfolio Overview',
            }}
          />
          <Tab.Screen
            name="Holdings"
            component={Holdings}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="📊" color={color} size={size} />
              ),
              headerTitle: 'My Holdings',
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddTransaction}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="✨" color={color} size={size} />
              ),
              headerTitle: 'New Transaction',
            }}
          />
          <Tab.Screen
            name="Cash"
            component={CashManager}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="💰" color={color} size={size} />
              ),
              headerTitle: 'Cash Manager',
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
