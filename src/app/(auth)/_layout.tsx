import { Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { user } = useAuth();

  // If user is authenticated, redirect to home
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
} 