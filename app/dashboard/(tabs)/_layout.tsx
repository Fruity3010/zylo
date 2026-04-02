import { Tabs } from "expo-router/tabs";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../contexts/ThemeContext";
import { useAuth } from "../../../contexts/AuthContext";

export default function TabsLayout() {
  const { colors } = useTheme();
  const { user } = useAuth();

  // Determine if user is errander or sender
  const isErrander = user?.role === "errander" || user?.role === "both";
  const isSender = user?.role === "sender" || user?.role === "both";

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Drawer will provide headers
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      {/* Sender Home - Create Errands */}
      {isSender && (
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
      )}

      {/* Errander Browse - Find Errands */}
      {isErrander && (
        <Tabs.Screen
          name="browse"
          options={{
            title: "Browse",
            tabBarIcon: ({ color, size }) => <Ionicons name="search" size={size} color={color} />,
          }}
        />
      )}

      {/* Errander Active - Current Errands */}
      {isErrander && (
        <Tabs.Screen
          name="active"
          options={{
            title: "Active",
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
          }}
        />
      )}

      {/* History - For both roles */}
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => <Ionicons name="time" size={size} color={color} />,
        }}
      />

      {/* Account - For both roles */}
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
