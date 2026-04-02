import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  Provider,
  DefaultTheme,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { login } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";
const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "lightgreen",
    accent: "lightgreen",
    background: "#1a1a1a",
    text: "honeydew",
    placeholder: "gray",
    onSurface: "honeydew",
  },
  roundness: 8,
};

const LoginPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const emailInputRef = useRef(null);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleLogin = async () => {
    if (loading) return;

    // Validation
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: form.email.trim(),
        password: form.password,
      });

      if (response.success && response.data) {
        // Update auth context with user data
        setUser(response.data.user);
        // Navigate to dashboard on success
        router.replace("/dashboard");
      } else {
        Alert.alert("Login Failed", response.message || "Invalid credentials");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Provider theme={customTheme}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "#111" }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>ZYLO</Text>
            </View>
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <Text style={styles.title}>Login</Text>
              <View
                style={{
                  height: 1,
                  backgroundColor: "lightgreen",
                  width: "30%",
                }}
              />
            </View>
            <TextInput
              ref={emailInputRef}
              label="Email or Phone Number"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              style={styles.input}
              mode="outlined"
              autoFocus
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              value={form.password}
              onChangeText={(text) => setForm({ ...form, password: text })}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                  forceTextInputFocus={false}
                />
              }
              style={styles.input}
              mode="outlined"
            />

            <Button
              mode="outlined"
              onPress={handleLogin}
              style={styles.button}
              labelStyle={{ color: "lightgreen" }}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="lightgreen" /> : "Login"}
            </Button>

            <Text style={styles.linkText}>
              Don't have an account?{" "}
              <Text style={styles.linkHighlight}>Sign Up</Text>
            </Text>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
  },
  scrollViewContent: {
    padding: 24,
    minHeight: "100%",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    color: "white",
    marginBottom: 8,
    alignSelf: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1a1a1a",
  },
  button: {
    borderColor: "lightgreen",
    marginTop: 8,
  },
  linkText: {
    color: "honeydew",
    marginTop: 20,
    textAlign: "center",
  },
  linkHighlight: {
    color: "lightgreen",
    fontWeight: "bold",
  },
  logoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoText: {
    fontFamily: "Bodwars",
    fontSize: 36,
    color: "lightgreen",
    textAlign: "center",
  },
});

export default LoginPage;
