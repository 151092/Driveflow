import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

// Spinning ring used during the mock OAuth "Securely connecting…" step.
export default function Spinner({ color = "#fff", size = 38 }) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 700, easing: Easing.linear, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <Animated.View
      style={[
        styles.ring,
        { width: size, height: size, borderRadius: size / 2, borderTopColor: color, transform: [{ rotate }] },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 3,
    borderColor: "rgba(255,255,255,.12)",
  },
});
