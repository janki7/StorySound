import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Platform, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTTS } from '../../hooks/useTTS';

const SETTINGS_KEY = 'storysound.settings';

type ThemePreference = 'light' | 'dark' | 'system';
type FontSize = 's' | 'm' | 'l';

interface SettingsState {
  theme: ThemePreference;
  fontSize: FontSize;
  speed: number;
}

const defaultSettings: SettingsState = {
  theme: 'system',
  fontSize: 'm',
  speed: 1,
};

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const tts = useTTS();

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(SETTINGS_KEY);
        if (value) {
          const parsed = JSON.parse(value) as SettingsState;
          setSettings({ ...defaultSettings, ...parsed });
          tts.setSpeed(parsed.speed);
        }
      } catch {
        // ignore
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)).catch(() => undefined);
  }, [loaded, settings]);

  const setTheme = (theme: ThemePreference) => setSettings((s) => ({ ...s, theme }));
  const setFontSize = (fontSize: FontSize) => setSettings((s) => ({ ...s, fontSize }));
  const setSpeed = (speed: number) => {
    setSettings((s) => ({ ...s, speed }));
    tts.setSpeed(speed);
  };

  const openCallibre = () => {
    const url = 'https://calibre-ebook.com';
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1014' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 40 : 56, paddingBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#F0EFE9', letterSpacing: -0.5 }}>
            Settings
          </Text>
        </View>

        {/* Theme */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B6866', letterSpacing: 1, marginBottom: 12 }}>
            APPEARANCE
          </Text>
          <View style={{ backgroundColor: '#1A1B20', borderRadius: 16, padding: 4, flexDirection: 'row' }}>
            {(['light', 'dark', 'system'] as ThemePreference[]).map((value) => {
              const isActive = settings.theme === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => setTheme(value)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: isActive ? '#F5A623' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isActive ? '#0F1014' : '#6B6866',
                    }}
                  >
                    {value === 'light' ? '☀️ Light' : value === 'dark' ? '🌙 Dark' : '🔄 System'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Font size */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B6866', letterSpacing: 1, marginBottom: 12 }}>
            READER FONT SIZE
          </Text>
          <View style={{ backgroundColor: '#1A1B20', borderRadius: 16, padding: 4, flexDirection: 'row' }}>
            {([
              { key: 's' as FontSize, label: 'Small', icon: 'A' },
              { key: 'm' as FontSize, label: 'Medium', icon: 'A' },
              { key: 'l' as FontSize, label: 'Large', icon: 'A' },
            ]).map(({ key, label, icon }) => {
              const isActive = settings.fontSize === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setFontSize(key)}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: isActive ? '#F5A623' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: key === 's' ? 12 : key === 'm' ? 15 : 18,
                      fontWeight: '700',
                      color: isActive ? '#0F1014' : '#6B6866',
                    }}
                  >
                    {icon}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: isActive ? '#0F1014' : '#6B6866',
                      marginTop: 2,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Default speed */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B6866', letterSpacing: 1, marginBottom: 12 }}>
            DEFAULT SPEED
          </Text>
          <View
            style={{
              backgroundColor: '#1A1B20',
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pressable
              onPress={() => setSpeed(Math.max(0.5, settings.speed - 0.1))}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#242530',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: '#B0ADA5', fontWeight: '600' }}>−</Text>
            </Pressable>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#F5A623' }}>
                {settings.speed.toFixed(1)}x
              </Text>
              <Text style={{ fontSize: 11, color: '#6B6866', marginTop: 2 }}>playback speed</Text>
            </View>
            <Pressable
              onPress={() => setSpeed(Math.min(3, settings.speed + 0.1))}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#242530',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: '#B0ADA5', fontWeight: '600' }}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Kindle tip */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B6866', letterSpacing: 1, marginBottom: 12 }}>
            TIPS
          </Text>
          <Pressable
            onPress={openCallibre}
            style={{
              backgroundColor: '#1A1B20',
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 28, marginRight: 14 }}>📚</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#F0EFE9', marginBottom: 4 }}>
                Got Kindle books?
              </Text>
              <Text style={{ fontSize: 12, color: '#6B6866', lineHeight: 18 }}>
                Use Calibre to convert them to EPUB. Tap here to visit calibre-ebook.com
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: '#6B6866' }}>→</Text>
          </Pressable>
        </View>

        {/* About */}
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#6B6866', letterSpacing: 1, marginBottom: 12 }}>
            ABOUT
          </Text>
          <View style={{ backgroundColor: '#1A1B20', borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>🔊</Text>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#F0EFE9' }}>
                  StorySound
                </Text>
                <Text style={{ fontSize: 12, color: '#6B6866' }}>Version 1.0.0</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: '#B0ADA5', lineHeight: 20 }}>
              A minimalist text-to-speech reader that turns your books into audiobooks using your device's built-in voices. Import PDF, EPUB, or TXT files and listen on the go.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
