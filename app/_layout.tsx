import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform, useColorScheme } from 'react-native';
import { useFonts, Lora_400Regular, Lora_500Medium } from '@expo-google-fonts/lora';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookProvider } from '../contexts/BookContext';

const HAS_ONBOARDED_KEY = 'storysound.hasOnboarded';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_500Medium,
  });

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
        const hasOnboarded = value === 'true';
        const inTabsGroup = segments[0] === '(tabs)';
        if (!hasOnboarded && inTabsGroup) {
          router.replace('/onboarding');
        }
      } finally {
        setCheckingOnboarding(false);
      }
    })();
  }, [router, segments]);

  useEffect(() => {
    LogBox.ignoreLogs(['props.pointerEvents is deprecated. Use style.pointerEvents']);

    if (Platform.OS !== 'web') return;

    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      const [first] = args;
      if (
        typeof first === 'string' &&
        first.includes('props.pointerEvents is deprecated. Use style.pointerEvents')
      ) {
        return;
      }
      originalWarn(...args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  if (!fontsLoaded || checkingOnboarding) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0F1014', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#F5A623" />
      </View>
    );
  }

  return (
    <BookProvider>
      <View style={{ flex: 1, backgroundColor: '#0F1014' }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </View>
    </BookProvider>
  );
}
