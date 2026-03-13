import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { TTSProvider } from '../../contexts/TTSContext';
import { useSettings } from '../../contexts/SettingsContext';

function TabIcon({ label, icon, focused }: { label: string; icon: string; focused: boolean }) {
  const { colors } = useSettings();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 6 }}>
      <Text style={{ fontSize: 20, marginBottom: 2, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? '600' : '400',
          color: focused ? colors.accent : colors.tabBarInactive,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { colors } = useSettings();
  return (
    <TTSProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'web' ? 68 : 78,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'web' ? 8 : 16,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.tabBarInactive,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Library',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon label="Library" icon="📚" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="reader"
        options={{
          title: 'Reader',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon label="Listen" icon="🎧" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => <TabIcon label="Settings" icon="⚙️" focused={focused} />,
        }}
      />
    </Tabs>
    </TTSProvider>
  );
}
