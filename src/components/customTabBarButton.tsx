import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

  const tabs: { name: string; route: string; icon: IoniconName }[] = [
    {
      name: 'Home',
      route: '/',
      icon: 'map-outline',
    },
    {
      name: 'Profile',
      route: '/profile',
      icon: 'person-outline',
    },
    {
      name: 'Settings',
      route: '/settings',
      icon: 'settings-outline',
    },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.route;
        const isHome = tab.name === 'Home';
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(tab.route)}
            style={[
              styles.tabItem,
              isHome && styles.homeTabItem,
              isActive && styles.activeTab,
            ]}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? 'lightgreen' : 'gray'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#111',
    height: 80,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  homeTabItem: {
    marginTop: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
  },
});
