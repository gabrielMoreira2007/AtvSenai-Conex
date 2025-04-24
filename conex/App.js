// Gabriel Moreira
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Image, View, StyleSheet } from 'react-native';

// Telas
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SplashScreen from './src/screens/SplashScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente da barra superior com logo no meio
const CustomHeader = () => (
  <View style={styles.header}>
    <Image 
      source={require("./src/img/logoconex.png")} 
      style={styles.logo} 
      resizeMode="contain" 
    />
  </View>
);

// Tabs visíveis só após login
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}> 
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [splashDone, setSplashDone] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setSplashDone(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ header: () => <CustomHeader /> }}>  
        {!splashDone ? (
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        ) : !user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} initialParams={{ setUser }} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Estilos do cabeçalho personalizado
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff', 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 4, 
  },
  logo: {
    width: 120,
    height: 40,
  },
});
