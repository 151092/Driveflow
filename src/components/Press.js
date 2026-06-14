import React, { useRef } from "react";
import { Animated, Pressable } from "react-native";

// Mirrors the web `.df-press` affordance: scale down briefly on touch.
export default function Press({ children, style, onPress, disabled, scaleTo = 0.93, hitSlop, fullWidth }) {
  const scale = useRef(new Animated.Value(1)).current;

  const to = (v) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      style={fullWidth ? { width: "100%" } : undefined}
      onPressIn={() => to(scaleTo)}
      onPressOut={() => to(1)}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
