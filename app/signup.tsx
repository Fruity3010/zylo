import React, { useState } from "react";
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
import { TextInput, Button, Checkbox, Text, Provider, DefaultTheme, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { signup } from "../services/auth";
import { useAuth } from "../contexts/AuthContext";


const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'lightgreen', 
    accent: 'lightgreen', 
    background: '#1a1a1a', 
    text: 'honeydew', 
    placeholder: 'gray', 
    onSurface: 'honeydew', 
    

  },
  roundness: 8, 
};

const SignUpPage = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "sender" as "sender" | "errander" | "both",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSignUp = async () => {
    if (loading) return;

    // Validation
    if (!form.name || !form.surname || !form.email || !form.password || !form.confirmPassword) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    if (!checked) {
      Alert.alert("Error", "Please accept the Terms and Conditions");
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting signup with:', {
        email: form.email.trim(),
        full_name: `${form.name} ${form.surname}`.trim(),
        role: form.role,
      });

      const response = await signup({
        email: form.email.trim(),
        password: form.password,
        full_name: `${form.name} ${form.surname}`.trim(),
        role: form.role,
      });

      console.log('Signup response:', response);

      if (response.success && response.data) {
        // Update auth context with user data
        setUser(response.data.user);
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => router.replace("/dashboard") }
        ]);
      } else {
        console.error('Signup failed:', response);
        Alert.alert("Sign Up Failed", response.message || "Could not create account", [
          { text: "OK" }
        ]);
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert("Error", error.message || "An error occurred during sign up");
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
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.nameRow}>
              <TextInput
                label="First Name"
                value={form.name}
                onChangeText={(text) => handleChange("name", text)}
                style={styles.inputHalf}
                mode="outlined"
              />
              <TextInput
                label="Last Name"
                value={form.surname}
                onChangeText={(text) => handleChange("surname", text)}
                style={styles.inputHalf}
                mode="outlined"
              />
            </View>

            <TextInput
              label="Email"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
            />

            <TextInput
              label="Phone Number"
              value={form.phone}
              onChangeText={(text) => handleChange("phone", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
            />

            <TextInput
              label="Password"
              value={form.password}
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />

            <TextInput
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={checked ? "checked" : "unchecked"}
                onPress={() => setChecked(!checked)}
                color="lightgreen"
              />
              <Text style={styles.checkboxText}>
                I agree to the Terms and Conditions
              </Text>
            </View>

            <Button
              mode="outlined"
              onPress={handleSignUp}
              disabled={!checked || loading}
              style={styles.button}
              labelStyle={{ color: "lightgreen" }}
            >
              {loading ? <ActivityIndicator color="lightgreen" /> : "Sign Up"}
            </Button>
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
    color: "lightgreen",
    marginBottom: 24,
    alignSelf: "center",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  inputHalf: {
    flex: 0.48,
    backgroundColor: "#1a1a1a",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#1a1a1a",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxText: {
    color: "honeydew",
    marginLeft: 8,
  },
  button: {
    borderColor: "lightgreen",
  },
});

export default SignUpPage;