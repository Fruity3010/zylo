import React, { useRef, useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import SafeAreaWrapper from "../safe-area-wrapper/safeAreaWrapper";
import { useAuth } from "../../../contexts/AuthContext";

const { width } = Dimensions.get("window");

interface SideDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideDrawer({ visible, onClose }: SideDrawerProps) {
  const { user, logout } = useAuth();
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const [isMounted, setIsMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMounted(false));
    }
  }, [visible]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            onClose();
            await logout();
          },
        },
      ]
    );
  };

  if (!isMounted) return null;

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <Animated.View
        style={[
          styles.drawer,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <SafeAreaWrapper style={{ flex: 1, backgroundColor: "#111" }}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ color: "white", fontSize: 16 }}>×</Text>
          </TouchableOpacity>

          <Text style={styles.drawerTitle}>Menu</Text>

          {user && (
            <View style={styles.userSection}>
              <Text style={styles.userName}>{user.full_name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.drawerItem}>
            <Text style={styles.drawerText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Text style={styles.drawerText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Text style={styles.drawerText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.drawerItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </SafeAreaWrapper>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: "#111",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
  },
  drawerTitle: {
    color: "lightgreen",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  drawerItem: {
    paddingVertical: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  drawerText: {
    color: "white",
    fontSize: 16,
  },
  userSection: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  userName: {
    color: "lightgreen",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  userEmail: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 4,
  },
  userRole: {
    color: "lightgreen",
    fontSize: 12,
    textTransform: "capitalize",
    backgroundColor: "#222",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  logoutItem: {
    marginTop: 20,
    borderBottomColor: "transparent",
  },
  logoutText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
  },
});
