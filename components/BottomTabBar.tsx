import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import type { ComponentProps } from 'react';
type IconName = ComponentProps<typeof Ionicons>['name'];

export default function BottomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { colors } = useTheme();

  const tabs = [
    { name: 'Home', path: '/dashboard', icon: 'home' as IconName, iconOutline: 'home-outline' as IconName },
    { name: 'History', path: '/dashboard/history', icon: 'time' as IconName, iconOutline: 'time-outline' as IconName },
    { name: 'Account', path: '/dashboard/account', icon: 'person' as IconName, iconOutline: 'person-outline' as IconName },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <TouchableOpacity
            key={tab.path}
            style={styles.tab}
            onPress={() => router.push(tab.path as any)}
          >
            <Ionicons
              name={isActive ? tab.icon : tab.iconOutline}
              size={24}
              color={isActive ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.label, { color: isActive ? colors.primary : colors.textSecondary }]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
