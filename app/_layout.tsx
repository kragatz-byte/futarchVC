/**
 * Root layout: auth gate, tab stack, startup detail, global decision/forecast modals.
 * CS153 product loop — AI diligence → forecast → invest/pass → reputation (see README).
 */
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import AppModalHost from '@/components/AppModalHost';
import AuthGate from '@/components/AuthGate';
import { AuthProvider } from '@/contexts/AuthContext';
import { DecisionProvider } from '@/contexts/DecisionContext';
import { ForecastProvider } from '@/contexts/ForecastContext';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthGate>
        <DecisionProvider>
          <ForecastProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerStyle: { backgroundColor: '#071A33' },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: { fontWeight: '600' },
                contentStyle: { backgroundColor: '#071A33' },
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="startup/[id]"
                options={{
                  title: 'Startup',
                  presentation: 'card',
                }}
              />
            </Stack>
            <AppModalHost />
          </ForecastProvider>
        </DecisionProvider>
      </AuthGate>
    </AuthProvider>
  );
}
