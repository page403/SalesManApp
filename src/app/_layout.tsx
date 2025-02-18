import React from 'react';
import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { Slot } from 'expo-router';
import { StatusBar } from 'react-native';

function RootLayoutNav() {
  const { user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: true }}>
      {!user ? (
        <>
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
        </>
      ) : (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="toko/[id]" />
          <Stack.Screen name="order-detail/[id]" />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}