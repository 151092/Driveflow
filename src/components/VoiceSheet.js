import React, { useEffect, useRef } from "react";
import { Modal, View, Text, ScrollView, Pressable, Animated, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Mic } from "lucide-react-native";
import { SAMPLE_CMDS } from "../data";
import { BRAND, COLORS, FONT, GRAD_135 } from "../theme";
import Press from "./Press";

function Orb({ listening }) {
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!listening) { ring.setValue(0); return; }
    const loop = Animated.loop(
      Animated.timing(ring, { toValue: 1, duration: 1000, useNativeDriver: true })
    );
    loop.start();
    return () => loop.stop();
  }, [listening, ring]);

  const scale = ring.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const opacity = ring.interpolate({ inputRange: [0, 1], outputRange: [0.5, 0] });

  return (
    <View style={styles.orbWrap}>
      {listening && <Animated.View style={[styles.orbPulse, { transform: [{ scale }], opacity }]} />}
      <LinearGradient colors={BRAND} {...GRAD_135} style={styles.orb}>
        <Mic size={22} color="#fff" />
      </LinearGradient>
    </View>
  );
}

export default function VoiceSheet({ visible, listening, convo, onRun, onClose }) {
  const scrollRef = useRef(null);

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Pressable onPress={onClose} hitSlop={12}>
            <View style={styles.grip} />
          </Pressable>

          <View style={styles.head}>
            <Orb listening={listening} />
            <View>
              <Text style={styles.title}>{listening ? "Listening…" : "Talk to Driveflow"}</Text>
              <Text style={styles.sub}>Hands-free. Say what you're in the mood for.</Text>
            </View>
          </View>

          <ScrollView
            ref={scrollRef}
            style={styles.convo}
            contentContainerStyle={styles.convoInner}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {convo.length === 0 && <Text style={styles.empty}>Try one below ↓</Text>}
            {convo.map((m, i) => (
              <View key={i} style={[styles.bubble, m.who === "you" ? styles.bYou : styles.bFlow]}>
                <Text style={m.who === "you" ? styles.bYouText : styles.bFlowText}>{m.text}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.cmds}>
            {SAMPLE_CMDS.map((c) => (
              <Press key={c} style={styles.cmd} onPress={() => onRun(c)}>
                <Text style={styles.cmdText}>{c}</Text>
              </Press>
            ))}
          </View>

          <Pressable onPress={onClose} style={styles.done}>
            <Text style={styles.doneText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,.45)" },
  sheet: {
    backgroundColor: "#12121a", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22, paddingTop: 12, paddingBottom: 28,
    borderWidth: 1, borderColor: COLORS.border,
  },
  grip: { width: 44, height: 5, borderRadius: 3, backgroundColor: "#33333e", alignSelf: "center", marginBottom: 18 },

  head: { flexDirection: "row", alignItems: "center", gap: 13, marginBottom: 16 },
  orbWrap: { width: 46, height: 46, alignItems: "center", justifyContent: "center" },
  orbPulse: { position: "absolute", width: 46, height: 46, borderRadius: 23, backgroundColor: "#6366F1" },
  orb: { width: 46, height: 46, borderRadius: 23, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: FONT.extrabold, fontSize: 16, color: COLORS.text },
  sub: { fontSize: 12, color: COLORS.textMute, marginTop: 1, fontFamily: FONT.regular },

  convo: { minHeight: 90, maxHeight: 180, marginBottom: 14 },
  convoInner: { gap: 8, paddingVertical: 2 },
  empty: { color: "#5a5a66", fontSize: 13, textAlign: "center", marginTop: 24, fontFamily: FONT.regular },
  bubble: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16, maxWidth: "82%" },
  bYou: { alignSelf: "flex-end", backgroundColor: "#2a2a36", borderBottomRightRadius: 5 },
  bFlow: { alignSelf: "flex-start", backgroundColor: "#6366F11c", borderWidth: 1, borderColor: "#6366F133", borderBottomLeftRadius: 5 },
  bYouText: { color: "#fff", fontSize: 13.5, lineHeight: 19, fontFamily: FONT.regular },
  bFlowText: { color: "#d8d8ff", fontSize: 13.5, lineHeight: 19, fontFamily: FONT.regular },

  cmds: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 14 },
  cmd: { paddingVertical: 9, paddingHorizontal: 13, borderRadius: 20, backgroundColor: "#1c1c26", borderWidth: 1, borderColor: "#2c2c38" },
  cmdText: { color: "#c8c8d4", fontSize: 12.5, fontFamily: FONT.regular },

  done: { paddingVertical: 13, borderRadius: 14, backgroundColor: COLORS.border, alignItems: "center" },
  doneText: { color: "#fff", fontFamily: FONT.bold, fontSize: 14 },
});
