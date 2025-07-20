import React from "react";
import 'react-native-reanimated';
import { StatusBar, StyleSheet } from "react-native";
import { PaperProvider } from "react-native-paper";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import LoginPage from "./src/pages/LoginPage/loginSignup";
import Signup from "./src/pages/signupPage/signupPage";
import Dashboard from "./src/pages/DashboardPage/Dashboard"
import "react-native-gesture-handler";
import { enableScreens } from "react-native-screens";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
enableScreens();

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Signup: undefined;
   Dashboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  const AppDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: "#111",
      card: "#111",
    },
  };

  return (
    <PaperProvider>
       <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#111" barStyle="light-content" />
      <NavigationContainer theme={AppDarkTheme}>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: "#111",
              borderBottomWidth: 0,
              elevation: 0,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            // ✅ Smooth slide animation (cross-platform)
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            cardStyle: {
              backgroundColor: "#111",
            },
            gestureEnabled: true,
            
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{
              headerShown: false, // No header for Login
            }}
          />
          <Stack.Screen
            name="Home"
            component={LoginPage}
            options={{
              title: "Home",
            }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{
              title: "Sign Up",
            }}
          />
           <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{
              title: "Dashboard",
               headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer></GestureHandlerRootView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
});
