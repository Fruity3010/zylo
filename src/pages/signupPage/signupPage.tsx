import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Checkbox, Text } from "react-native-paper";

const SignUpPage = () => {
  const [checked, setChecked] = useState(false);
  const [form, setForm] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  return (
    <ScrollView
      style={{ backgroundColor: "#111" }}
      contentContainerStyle={styles.container}
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
        onPress={() => {}}
        disabled={!checked}
        style={styles.button}
        labelStyle={{ color: "lightgreen" }}
      >
        Sign Up
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    flexGrow: 1,
    padding: 24,
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
