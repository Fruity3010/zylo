import { DarkTheme, ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";
import { FONT_ASSETS } from "../constants/fonts";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { Provider } from "react-redux";
import { store } from "../store";

export default function RootLayout() {
  const [fontsLoaded] = useFonts(FONT_ASSETS);

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="lightgreen" />
      </View>
    );
  }

  return (
    <Provider store={store}>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationThemeProvider value={DarkTheme}>
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: "#111" },
                  headerTitleStyle: { fontFamily: "Bodwars", color: "white" },
                  headerTintColor: "lightgreen",
                }}
              >
                <Stack.Screen
                  name="index"
                  options={{ headerShown: false, title: "" }}
                />
                <Stack.Screen
                  name="login"
                  options={{ headerShown: true, title: "" }}
                />
                <Stack.Screen
                  name="signup"
                  options={{ headerShown: true, title: "" }}
                />
                <Stack.Screen name="dashboard" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="auto" />
            </NavigationThemeProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
    </Provider>
  );
}
