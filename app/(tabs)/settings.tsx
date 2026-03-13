import React from 'react';
import { View, Text, Pressable, Platform, ScrollView, Linking } from 'react-native';
import { useSettings } from '../../contexts/SettingsContext';
import { useTTSContext } from '../../contexts/TTSContext';
import type { ThemePreference, FontSize } from '../../contexts/SettingsContext';

export default function SettingsScreen() {
  const settings = useSettings();
  const { colors } = settings;
  const tts = useTTSContext();

  const setTheme = (theme: ThemePreference) => {
    settings.setTheme(theme);
  };
  const setFontSize = (fontSize: FontSize) => settings.setFontSize(fontSize);
  const setSpeed = (speed: number) => {
    settings.setSpeed(speed);
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: Platform.OS === 'web' ? 40 : 56, paddingBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 }}>
            Settings
          </Text>
        </View>

        {/* Theme */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            APPEARANCE
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 4, flexDirection: 'row' }}>
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
                    backgroundColor: isActive ? colors.accent : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: isActive ? colors.accentOnAccent : colors.textSecondary,
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
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            READER FONT SIZE
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 4, flexDirection: 'row' }}>
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
                    backgroundColor: isActive ? colors.accent : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: key === 's' ? 12 : key === 'm' ? 15 : 18,
                      fontWeight: '700',
                      color: isActive ? colors.accentOnAccent : colors.textSecondary,
                    }}
                  >
                    {icon}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: isActive ? colors.accentOnAccent : colors.textSecondary,
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
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            DEFAULT SPEED
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
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
                backgroundColor: colors.surfaceAlt,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: colors.textSecondary, fontWeight: '600' }}>−</Text>
            </Pressable>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: colors.accent }}>
                {settings.speed.toFixed(1)}x
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>playback speed</Text>
            </View>
            <Pressable
              onPress={() => setSpeed(Math.min(3, settings.speed + 0.1))}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surfaceAlt,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20, color: colors.textSecondary, fontWeight: '600' }}>+</Text>
            </Pressable>
          </View>
        </View>

        {/* Kindle tip */}
        <View style={{ marginHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            TIPS
          </Text>
          <Pressable
            onPress={openCallibre}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 28, marginRight: 14 }}>📚</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 }}>
                Got Kindle books?
              </Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
                Use Calibre to convert them to EPUB. Tap here to visit calibre-ebook.com
              </Text>
            </View>
            <Text style={{ fontSize: 16, color: colors.textSecondary }}>→</Text>
          </Pressable>
        </View>

        {/* About */}
        <View style={{ marginHorizontal: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.textSecondary, letterSpacing: 1, marginBottom: 12 }}>
            ABOUT
          </Text>
          <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>🔊</Text>
              <View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>
                  StorySound
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>Version 1.0.0</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
              A minimalist text-to-speech reader that turns your books into audiobooks using your device's built-in voices. Import PDF, EPUB, or TXT files and listen on the go.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
