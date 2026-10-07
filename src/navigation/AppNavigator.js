import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { POSScreen } from '../screens/POSScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { colors, radii } from '../../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TABS = {
  Dashboard: { outline: 'grid-outline', filled: 'grid' },
  Inventory: { outline: 'cube-outline', filled: 'cube' },
  POS: { outline: 'bag-handle-outline', filled: 'bag-handle' },
  Reports: { outline: 'stats-chart-outline', filled: 'stats-chart' },
};

const POSStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="POSMain" component={POSScreen} options={{ title: 'POS' }} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.secondary,
          tabBarInactiveTintColor: '#8A938F',
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused, color }) => {
            const icons = TABS[route.name];
            return (
              <View style={focused ? styles.tabIconActive : styles.tabIcon}>
                <Ionicons
                  name={focused ? icons.filled : icons.outline}
                  size={18}
                  color={color}
                />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Inventory" component={InventoryScreen} />
        <Tab.Screen name="POS" component={POSStack} />
        <Tab.Screen name="Reports" component={ReportsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background,
    borderTopColor: '#E9E7DE',
    borderTopWidth: 1,
    height: 68,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  tabIcon: {
    minWidth: 46,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: {
    minWidth: 46,
    height: 26,
    paddingHorizontal: 10,
    borderRadius: radii.full,
    backgroundColor: colors.tint,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
