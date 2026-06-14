import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import IntroScreen from "../screens/IntroScreen";
import LinkScreen from "../screens/LinkScreen";
import DriveScreen from "../screens/DriveScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Intro"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Link" component={LinkScreen} />
      <Stack.Screen name="Drive" component={DriveScreen} />
    </Stack.Navigator>
  );
}
