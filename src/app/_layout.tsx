import ItemsIcon from "@/assets/icons/items.png";
import PokemonIcon from "@/assets/icons/pokemon.png";
import { Image } from "expo-image";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Pokémons",
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <Image source={PokemonIcon} style={{ width: size, height: size }} />
          ),
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: "Items",
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <Image source={ItemsIcon} style={{ width: size, height: size }} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          headerShown: false,
          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size - 2 }}>⭐</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="pokemon"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}


