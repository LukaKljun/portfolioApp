import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PortfolioProvider } from './src/context/PortfolioContext';
import PortfolioDashboard from './src/screens/PortfolioDashboard';
import AddTransaction from './src/screens/AddTransaction';
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
              fontWeight: '700',
            },
            heavy: {
              fontFamily: 'System',
              fontWeight: '900',
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
            },
            tabBarActiveTintColor: darkTheme.primary,
            tabBarInactiveTintColor: darkTheme.textSecondary,
            headerStyle: {
              backgroundColor: darkTheme.surface,
              borderBottomColor: darkTheme.border,
              borderBottomWidth: 1,
            },
            headerTintColor: darkTheme.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Tab.Screen
            name="Portfolio"
            component={PortfolioDashboard}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="📊" color={color} size={size} />
              ),
              headerTitle: 'My Portfolio',
            }}
          />
          <Tab.Screen
            name="Add"
            component={AddTransaction}
            options={{
              tabBarIcon: ({ color, size }) => (
                <TabBarIcon name="➕" color={color} size={size} />
              ),
              headerTitle: 'Add Transaction',
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
