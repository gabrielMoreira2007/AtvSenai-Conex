// Gabriel Moreira e Matheus
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // Começa invisível

  useEffect(() => {
    // Animação de entrada (fade in)
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 777, // 1 segundo para aparecer
      useNativeDriver: true,
    }).start();

    // Espera 3 segundos, faz fade out e navega
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // 1 segundo para sumir
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('MainTabs');
      });
    }, 3000); // Tempo total antes de desaparecer

    return () => clearTimeout(timeout);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Image 
        source={require('../img/logoconex.png')} 
        style={[styles.image, { opacity: fadeAnim }]} 
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
  }
});

export default SplashScreen;
