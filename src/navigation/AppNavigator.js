import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../theme/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import MapScreen from '../screens/MapScreen';
import CountrySearchScreen from '../screens/CountrySearchScreen';
import SharedLocationsScreen from '../screens/SharedLocationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border },
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tab.Screen
        name="Locations"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-multiple" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Countries"
        component={CountrySearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="earth" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Shared"
        component={SharedLocationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="share-variant" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (

          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="AddLocation"
              component={AddLocationScreen}
              options={{
                headerShown: true,
                title: 'Add Location',
                headerStyle: { backgroundColor: COLORS.primary },
                headerTintColor: COLORS.white,
                presentation: 'modal',
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}