import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS, type ThemeColors } from '../constants/theme';

const SETTINGS_KEY = 'storysound.settings';

export type ThemePreference = 'light' | 'dark' | 'system';
export type FontSize = 's' | 'm' | 'l';

export interface SettingsState {
  theme: ThemePreference;
  fontSize: FontSize;
  speed: number;
}

const defaultSettings: SettingsState = {
  theme: 'system',
  fontSize: 'm',
  speed: 1,
};

interface SettingsContextValue extends SettingsState {
  loaded: boolean;
  colors: ThemeColors;
  setTheme: (theme: ThemePreference) => void;
  setFontSize: (fontSize: FontSize) => void;
  setSpeed: (speed: number) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [loaded, setLoaded] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resolvedDark = useMemo(() => {
    if (settings.theme === 'system') return systemScheme === 'dark';
    return settings.theme === 'dark';
  }, [settings.theme, systemScheme]);

  const colors = useMemo(
    () => ({ ...(resolvedDark ? DARK_COLORS : LIGHT_COLORS), isDark: resolvedDark }),
    [resolvedDark]
  );

  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem(SETTINGS_KEY);
        if (value) {
          const parsed = JSON.parse(value) as Partial<SettingsState>;
          setSettings({ ...defaultSettings, ...parsed });
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
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)).catch(() => undefined);
      debounceRef.current = null;
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [loaded, settings]);

  const setTheme = useCallback((theme: ThemePreference) => {
    setSettings((s) => ({ ...s, theme }));
  }, []);

  const setFontSize = useCallback((fontSize: FontSize) => {
    setSettings((s) => ({ ...s, fontSize }));
  }, []);

  const setSpeed = useCallback((speed: number) => {
    setSettings((s) => ({ ...s, speed }));
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        loaded,
        colors,
        setTheme,
        setFontSize,
        setSpeed,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within a SettingsProvider');
  return ctx;
}
