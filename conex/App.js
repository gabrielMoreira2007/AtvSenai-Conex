import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tabs visíveis só após login
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null); // Estado inicial do usuário
  const [splashDone, setSplashDone] = useState(false);

  // Timer para SplashScreen
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 3000);

    return () => {
      clearTimeout(timer); // Limpar o timer ao desmontar
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!splashDone ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !user ? (
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              initialParams={{ setUser }} // Passa o setUser para a tela de Login
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
