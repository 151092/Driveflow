import React from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Check, Lock, ChevronRight } from "lucide-react-native";
import { SERVICES } from "../data";
import { BRAND, ACCENT, COLORS, FONT, GRAD_135 } from "../theme";
import { useAuth } from "../auth/AuthContext";
import { usePlayer } from "../player/PlayerContext";
import Press from "../components/Press";
import FadeIn from "../components/FadeIn";
import AuthSheet from "../components/AuthSheet";

const LIVE_COUNT = SERVICES.filter((s) => s.live).length;

export default function LinkScreen({ navigation }) {
  const {
    isLinked, linkedCount, openAuth, disconnect,
    authFor, authStep, authError, authorize, cancelAuth,
  } = useAuth();
  const { startDrive } = usePlayer();

  const canStart = linkedCount > 0;

  const onRowPress = (s) => {
    if (!s.live) return;
    if (isLinked(s.id)) {
      Alert.alert("Disconnect " + s.name + "?", "Driveflow will stop reading from " + s.name + ".", [
        { text: "Cancel", style: "cancel" },
        { text: "Disconnect", style: "destructive", onPress: () => disconnect(s.id) },
      ]);
    } else {
      openAuth(s);
    }
  };

  const start = () => { startDrive(); navigation.navigate("Drive"); };

  return (
    <FadeIn style={styles.screen}>
      <View style={styles.head}>
        <Press onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={20} color="#fff" />
        </Press>
        <View>
          <Text style={styles.title}>Link your audio</Text>
          <Text style={styles.sub}>{linkedCount} of {LIVE_COUNT} connected</Text>
        </View>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listInner}>
        {SERVICES.map((s) => {
          const on = isLinked(s.id);
          const Icon = s.icon;
          return (
            <Press
              key={s.id}
              fullWidth
              scaleTo={0.985}
              disabled={!s.live}
              onPress={() => onRowPress(s)}
              style={[
                styles.svc,
                on && { borderColor: s.hue, backgroundColor: `${s.hue}12` },
                !s.live && { opacity: 0.45 },
              ]}
            >
              <View style={[styles.svcIcon, { backgroundColor: `${s.hue}22` }]}>
                <Icon size={19} color={s.hue} />
              </View>
              <View style={styles.svcMeta}>
                <Text style={styles.svcName}>{s.name}</Text>
                <Text style={styles.svcTag}>{on ? "Connected · tap to disconnect" : s.tag}</Text>
              </View>
              {on ? (
                <View style={[styles.dot, { backgroundColor: s.hue }]}>
                  <Check size={13} color="#fff" strokeWidth={3} />
                </View>
              ) : s.live ? (
                <Text style={styles.connect}>Connect</Text>
              ) : (
                <Lock size={15} color="#555" />
              )}
            </Press>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <Press onPress={start} disabled={!canStart} scaleTo={0.97} fullWidth>
          <LinearGradient colors={BRAND} {...GRAD_135} style={[styles.cta, !canStart && { opacity: 0.35 }]}>
            <Text style={styles.ctaText}>{canStart ? "Start my drive" : "Connect at least one to start"}</Text>
            {canStart && <ChevronRight size={18} color="#fff" />}
          </LinearGradient>
        </Press>
      </View>

      <AuthSheet
        service={authFor}
        step={authStep}
        error={authError}
        onAuthorize={authorize}
        onCancel={cancelAuth}
      />
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  head: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontFamily: FONT.extrabold, letterSpacing: -0.5, color: COLORS.text },
  sub: { fontSize: 12.5, color: COLORS.textMute, marginTop: 1, fontFamily: FONT.regular },

  list: { flex: 1 },
  listInner: { paddingHorizontal: 22, paddingVertical: 6, gap: 11 },
  svc: {
    flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 13, paddingHorizontal: 15,
    borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
  },
  svcIcon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  svcMeta: { flex: 1 },
  svcName: { fontSize: 15, fontFamily: FONT.bold, color: COLORS.text },
  svcTag: { fontSize: 11.5, color: COLORS.textFaint, marginTop: 1, fontFamily: FONT.regular },
  connect: { fontSize: 12.5, fontFamily: FONT.bold, color: ACCENT, backgroundColor: `${ACCENT}1c`, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, overflow: "hidden" },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  footer: { padding: 22 },
  cta: { paddingVertical: 16, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 },
  ctaText: { color: "#fff", fontFamily: FONT.extrabold, fontSize: 16 },
});
