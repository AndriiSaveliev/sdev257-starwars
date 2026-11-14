// Module 03 Assignment 2: Star Wars API
// Three screens: Planets, Films, Spaceships.
// Each screen fetches a list from the Star Wars API (SWAPI) and shows it in a FlatList.
// iOS uses bottom tab navigation, Android uses drawer navigation.

import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// ---------- API ----------

// Main SWAPI address and a mirror (used if the main one does not answer)
const API_URLS = ["https://swapi.dev/api/", "https://swapi.py4e.com/api/"];

// Fetch one resource (planets, starships or films).
// Tries the main API first, then the mirror.
async function fetchResource(resource) {
  for (const base of API_URLS) {
    try {
      const response = await fetch(base + resource + "/");
      if (!response.ok) {
        throw new Error("Bad response: " + response.status);
      }
      const json = await response.json();
      return json.results; // the list is inside "results"
    } catch (error) {
      console.log("Fetch failed for " + base + ":", error.message);
    }
  }
  throw new Error("Could not load data from the Star Wars API.");
}

// Custom hook: loads a list and keeps loading and error state
function useSwapiList(resource) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResource(resource)
      .then((results) => setData(results))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [resource]);

  return { data, loading, error };
}

// ---------- Reusable list screen ----------

// Shows a loading spinner, an error, or the list of items.
// renderDetails returns the second line of text for each item.
function SwapiListScreen({ resource, titleKey, renderDetails }) {
  const { data, loading, error } = useSwapiList(resource);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFE81F" />
        <Text style={styles.info}>Loading {resource}...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.list}
      data={data}
      keyExtractor={(item) => item.url} // every SWAPI item has a unique url
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{item[titleKey]}</Text>
          <Text style={styles.itemDetails}>{renderDetails(item)}</Text>
        </View>
      )}
    />
  );
}

// ---------- Screens ----------

// Planets screen: data from SWAPI Planets
function PlanetsScreen() {
  return (
    <SwapiListScreen
      resource="planets"
      titleKey="name"
      renderDetails={(p) => `Climate: ${p.climate} | Population: ${p.population}`}
    />
  );
}

// Films screen: data from SWAPI Films
function FilmsScreen() {
  return (
    <SwapiListScreen
      resource="films"
      titleKey="title"
      renderDetails={(f) =>
        `Episode ${f.episode_id} | Director: ${f.director} | Released: ${f.release_date}`
      }
    />
  );
}

// Spaceships screen: data from SWAPI Starships
function SpaceshipsScreen() {
  return (
    <SwapiListScreen
      resource="starships"
      titleKey="name"
      renderDetails={(s) => `Model: ${s.model} | Class: ${s.starship_class}`}
    />
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
  // Centered container for loading and error states
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 20,
  },
  // The list fills the screen
  list: {
    flex: 1,
    backgroundColor: "#111",
  },
  // One row in the list
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFE81F",
  },
  itemDetails: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 4,
  },
  info: {
    color: "#ccc",
    marginTop: 10,
  },
  error: {
    color: "#ff6b6b",
    fontSize: 16,
    textAlign: "center",
  },
});
