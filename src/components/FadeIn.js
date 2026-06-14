import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";

// Mirrors `.df-fade`: fade up on mount.
export default function FadeIn({ children, style }) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [v]);

  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <Animated.View style={[style, { opacity: v, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
