import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import {
  Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";

import { COLORS } from "./src/theme";
import { AuthProvider } from "./src/auth/AuthContext";
import AuthSheetHost from "./src/auth/AuthSheetHost";
import { PlayerProvider } from "./src/player/PlayerContext";
import RootNavigator from "./src/navigation/RootNavigator";

// Keep navigation surfaces transparent so the app-wide gradient shows through.
const NavTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "transparent" },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold,
    SpaceMono_400Regular,
  });

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <LinearGradient colors={[COLORS.bgTop, COLORS.bg]} style={StyleSheet.absoluteFill} />
        {fontsLoaded && (
          <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            <AuthProvider>
              <PlayerProvider>
                <NavigationContainer theme={NavTheme}>
                  <RootNavigator />
                </NavigationContainer>
                <AuthSheetHost />
              </PlayerProvider>
            </AuthProvider>
          </SafeAreaView>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1 },
});
