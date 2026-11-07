// Module 02 Assignment 2: Star Wars app
// Three screens: Planets, Films, Spaceships.
// iOS uses bottom tab navigation, Android uses drawer navigation.

import "react-native-gesture-handler";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// ---------- Screens ----------

// Planets screen: for now it only shows its name
function PlanetsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planets</Text>
    </View>
  );
}

// Films screen: for now it only shows its name
function FilmsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Films</Text>
    </View>
  );
}

// Spaceships screen: for now it only shows its name
function SpaceshipsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spaceships</Text>
    </View>
  );
}

// ---------- Navigation ----------

// Icon name for each screen, used by both navigators
const icons = {
  Planets: "planet-outline",
  Films: "film-outline",
  Spaceships: "rocket-outline",
};

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Bottom tab navigation (used on iOS)
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: "#FFE81F", // Star Wars yellow
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#000" },
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#FFE81F",
      })}
    >
      <Tab.Screen name="Planets" component={PlanetsScreen} />
      <Tab.Screen name="Films" component={FilmsScreen} />
      <Tab.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Tab.Navigator>
  );
}

// Drawer navigation (used on Android)
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        drawerIcon: ({ color, size }) => (
          <Ionicons name={icons[route.name]} size={size} color={color} />
        ),
        drawerActiveTintColor: "#FFE81F",
        drawerInactiveTintColor: "gray",
        drawerStyle: { backgroundColor: "#000" },
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#FFE81F",
      })}
    >
      <Drawer.Screen name="Planets" component={PlanetsScreen} />
      <Drawer.Screen name="Films" component={FilmsScreen} />
      <Drawer.Screen name="Spaceships" component={SpaceshipsScreen} />
    </Drawer.Navigator>
  );
}

// ---------- App ----------

export default function App() {
  return (
    <NavigationContainer>
      {/* Pick the navigator based on the platform */}
      {Platform.OS === "android" ? <DrawerNavigator /> : <TabNavigator />}
      <StatusBar style="light" />
    </NavigationContainer>
  );
}

// ---------- Styles ----------

const styles = StyleSheet.create({
  // Screen container: fills the screen and centers content with Flexbox
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  // Screen name text
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFE81F",
  },
});
