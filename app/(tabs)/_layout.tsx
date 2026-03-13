import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';

function TabIcon({ label, icon, focused }: { label: string; icon: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 6 }}>
      <Text style={{ fontSize: 20, marginBottom: 2, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: focused ? '600' : '400',
          color: focused ? '#F5A623' : '#9E9B93',
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: Platform.OS === 'web' ? 68 : 78,
          backgroundColor: '#1A1B20',
          borderTopColor: '#2A2B30',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'web' ? 8 : 16,
        },
        tabBarActiveTintColor: '#F5A623',
        tabBarInactiveTintColor: '#9E9B93',
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
  );
}
