import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { theme, setTheme, colors } = useTheme();

  const handleRoleToggle = (newRole: 'sender' | 'errander' | 'both') => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <DrawerContentScrollView {...props} style={[styles.drawerContainer, { backgroundColor: colors.background }]}>
      {/* User Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.surfaceSecondary }]}>
          <Ionicons name="person" size={32} color={colors.primary} />
        </View>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.full_name || "User"}</Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      {/* Role Toggle (For Testing) */}
      <View style={styles.drawerSection}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ROLE (DEV MODE)</Text>
        <TouchableOpacity
          style={[styles.roleOption, user?.role === 'sender' && { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => handleRoleToggle('sender')}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          <Text style={[styles.roleOptionText, { color: colors.text }]}>Sender (Post Errands)</Text>
          {user?.role === 'sender' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleOption, user?.role === 'errander' && { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => handleRoleToggle('errander')}
        >
          <Ionicons name="bicycle-outline" size={20} color={colors.primary} />
          <Text style={[styles.roleOptionText, { color: colors.text }]}>Errander (Do Errands)</Text>
          {user?.role === 'errander' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleOption, user?.role === 'both' && { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => handleRoleToggle('both')}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color={colors.primary} />
          <Text style={[styles.roleOptionText, { color: colors.text }]}>Both Roles</Text>
          {user?.role === 'both' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* Theme Selection */}
      <View style={styles.drawerSection}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>THEME</Text>
        <TouchableOpacity
          style={[styles.themeOption, theme === 'light' && { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => setTheme('light')}
        >
          <Ionicons name="sunny-outline" size={20} color={colors.primary} />
          <Text style={[styles.themeText, { color: colors.text }]}>Light Mode</Text>
          {theme === 'light' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.themeOption, theme === 'dark' && { backgroundColor: colors.surfaceSecondary }]}
          onPress={() => setTheme('dark')}
        >
          <Ionicons name="moon-outline" size={20} color={colors.primary} />
          <Text style={[styles.themeText, { color: colors.text }]}>Dark Mode</Text>
          {theme === 'dark' && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* Additional Menu Items */}
      <View style={styles.drawerSection}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>MORE</Text>
        <DrawerItem
          label="Payment"
          icon={({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} />}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
          onPress={() => router.push("/dashboard/payment")}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
        <DrawerItem
          label="Safety"
          icon={({ color, size }) => <Ionicons name="shield-checkmark-outline" size={size} color={color} />}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
          onPress={() => router.push("/dashboard/safety")}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
        <DrawerItem
          label="Support"
          icon={({ color, size }) => <Ionicons name="help-circle-outline" size={size} color={color} />}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
          onPress={() => router.push("/dashboard/support")}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
        <DrawerItem
          label="About"
          icon={({ color, size }) => <Ionicons name="information-circle-outline" size={size} color={color} />}
          labelStyle={[styles.drawerLabel, { color: colors.text }]}
          onPress={() => router.push("/dashboard/about")}
          activeTintColor={colors.primary}
          inactiveTintColor={colors.textSecondary}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DashboardLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        drawerStyle: { backgroundColor: colors.background, width: 280 },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerType: "front",
        overlayColor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Tabs group - contains Home, History, Account with bottom tabs */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "",
          drawerItemStyle: { display: "none" }, // Hide from drawer menu
        }}
      />

      {/* Secondary pages - accessible via drawer */}
      <Drawer.Screen
        name="payment"
        options={{
          title: "Payment",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="safety"
        options={{
          title: "Safety",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="support"
        options={{
          title: "Support",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: "About",
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  roleText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  drawerSection: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    paddingLeft: 10,
    marginBottom: 10,
  },
  drawerLabel: {
    fontSize: 16,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
  },
  roleOptionText: {
    flex: 1,
    fontSize: 14,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 8,
    gap: 12,
  },
  themeText: {
    flex: 1,
    fontSize: 16,
  },
});
