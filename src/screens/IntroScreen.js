import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Car, ChevronRight, ShieldCheck } from "lucide-react-native";
import { BRAND, ACCENT, COLORS, FONT, GRAD_135 } from "../theme";
import Press from "../components/Press";
import FadeIn from "../components/FadeIn";

export default function IntroScreen({ onConnect }) {
  return (
    <FadeIn style={styles.screen}>
      <View style={styles.body}>
        <View style={styles.logoRow}>
          <LinearGradient colors={BRAND} {...GRAD_135} style={styles.logoBadge}>
            <Car size={20} color="#fff" />
          </LinearGradient>
          <Text style={styles.wordmark}>driveflow</Text>
        </View>

        <Text style={styles.h1}>
          One sign-in.{"\n"}
          <Text style={styles.grad}>Every drive, scored.</Text>
        </Text>

        <Text style={styles.lede}>
          Connect the audio you already pay for. Driveflow reads across all of it and
          curates the road ahead — hands on the wheel, voice in control. We never see your passwords.
        </Text>

        <View style={styles.trustRow}>
          <ShieldCheck size={15} color={ACCENT} />
          <Text style={styles.trustText}>Bank-style secure sign-in · powered by each service's own login</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Press onPress={onConnect} scaleTo={0.97} fullWidth>
          <LinearGradient colors={BRAND} {...GRAD_135} style={styles.cta}>
            <Text style={styles.ctaText}>Connect my accounts</Text>
            <ChevronRight size={18} color="#fff" />
          </LinearGradient>
        </Press>
      </View>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  body: { paddingHorizontal: 28, paddingTop: 32 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 30 },
  logoBadge: { width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  wordmark: { fontFamily: FONT.extrabold, fontSize: 19, letterSpacing: -0.5, color: COLORS.text },
  h1: { fontFamily: FONT.extrabold, fontSize: 33, lineHeight: 36, marginBottom: 14, letterSpacing: -1, color: COLORS.text },
  grad: { color: "#8B5CF6", fontFamily: FONT.extrabold },
  lede: { color: COLORS.textDim, fontSize: 14, lineHeight: 22, marginBottom: 20, fontFamily: FONT.regular },
  trustRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 11, paddingHorizontal: 13, borderRadius: 12,
  },
  trustText: { flex: 1, fontSize: 11.5, color: COLORS.textMute, lineHeight: 15, fontFamily: FONT.regular },
  footer: { marginTop: "auto", padding: 22 },
  cta: {
    paddingVertical: 16, borderRadius: 18, flexDirection: "row",
    alignItems: "center", justifyContent: "center", gap: 4,
  },
  ctaText: { color: "#fff", fontFamily: FONT.extrabold, fontSize: 16 },
});
