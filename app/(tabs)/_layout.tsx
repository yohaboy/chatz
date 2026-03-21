import { Tabs } from 'expo-router';
import { Home, MessageCircle, Settings as SettingsIcon, User, Users } from 'lucide-react-native';
import React from 'react';
import Colors from '../../constants/Colors';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const theme = colorScheme ?? 'light';
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        tabBarInactiveTintColor: Colors[theme].tabIconDefault,
        headerShown: true,
        headerStyle: {
          backgroundColor: isDark ? Colors[theme].background : Colors[theme].tint,
          elevation: isDark ? 0 : 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.1,
          shadowRadius: 4,
          borderBottomWidth: 0,
        },
        headerTintColor: '#FFF',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 22,
          color: '#FFF',
          letterSpacing: 0.5,
        },
        tabBarStyle: {
          backgroundColor: isDark ? Colors[theme].background : '#FFF',
          borderTopWidth: 1,
          borderTopColor: isDark ? '#263238' : Colors[theme].border,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="chats/index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <MessageCircle color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="groups/index"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} />,
        }}
      />

    </Tabs>
  );
}
