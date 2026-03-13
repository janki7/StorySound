import '../global.css';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform } from 'react-native';
import { useFonts, Lora_400Regular, Lora_500Medium } from '@expo-google-fonts/lora';
import { View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookProvider } from '../contexts/BookContext';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';

const HAS_ONBOARDED_KEY = 'storysound.hasOnboarded';

function ThemedAppContent() {
  const { colors } = useSettings();
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
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
    <SettingsProvider>
      <BookProvider>
        <ThemedAppContent />
      </BookProvider>
    </SettingsProvider>
  );
}
