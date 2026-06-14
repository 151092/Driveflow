import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";

// Four bouncing bars, echoing the `.df-eq` CSS animation on the now-playing art.
const DELAYS = [0, 200, 400, 100];

function Bar({ delay }) {
  const h = useRef(new Animated.Value(5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(h, { toValue: 18, duration: 400, useNativeDriver: false }),
        Animated.timing(h, { toValue: 5, duration: 400, useNativeDriver: false }),
      ])
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => { clearTimeout(t); loop.stop(); };
  }, [delay, h]);

  return <Animated.View style={[styles.bar, { height: h }]} />;
}

export default function Equalizer() {
  return (
    <View style={styles.wrap}>
      {DELAYS.map((d, i) => <Bar key={i} delay={d} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 14,
    right: 14,
    flexDirection: "row",
    alignItems: "flex-end",
    height: 20,
    gap: 3,
  },
  bar: { width: 3, backgroundColor: "#fff", borderRadius: 2 },
});
