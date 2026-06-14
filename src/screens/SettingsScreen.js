import React from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { ArrowLeft, Check, Plus, RefreshCw, Lock } from "lucide-react-native";
import { SERVICES } from "../data";
import { ACCENT, COLORS, FONT } from "../theme";
import { useAuth } from "../auth/AuthContext";
import { usePlayer } from "../player/PlayerContext";
import Press from "../components/Press";
import FadeIn from "../components/FadeIn";

export default function SettingsScreen({ navigation }) {
  const { linked, isLinked, openAuth, disconnect } = useAuth();
  const { source, refreshQueue, loadingQueue } = usePlayer();

  const confirmDisconnect = (s) =>
    Alert.alert(`Disconnect ${s.name}?`, `Driveflow will stop reading from ${s.name}.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Disconnect", style: "destructive", onPress: () => disconnect(s.id) },
    ]);

  const statusFor = (s) => {
    const tok = linked[s.id];
    if (!tok) return s.live ? "Not connected" : "Coming soon";
    return tok.simulated ? "Connected · demo" : "Connected · live";
  };

  return (
    <FadeIn style={styles.screen}>
      <View style={styles.head}>
        <Press onPress={() => navigation.goBack()} style={styles.backBtn} hitSlop={8}>
          <ArrowLeft size={20} color="#fff" />
        </Press>
        <View>
          <Text style={styles.title}>Account</Text>
          <Text style={styles.sub}>Manage your connected audio</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Sources</Text>
        {SERVICES.map((s) => {
          const on = isLinked(s.id);
          const Icon = s.icon;
          return (
            <View key={s.id} style={[styles.row, !s.live && { opacity: 0.5 }]}>
              <View style={[styles.icon, { backgroundColor: `${s.hue}22` }]}>
                <Icon size={19} color={s.hue} />
              </View>
              <View style={styles.meta}>
                <Text style={styles.name}>{s.name}</Text>
                <Text style={[styles.status, on && { color: s.hue }]}>{statusFor(s)}</Text>
              </View>
              {on ? (
                <Press onPress={() => confirmDisconnect(s)} style={styles.disconnect} hitSlop={6}>
                  <Text style={styles.disconnectText}>Disconnect</Text>
                </Press>
              ) : s.live ? (
                <Press onPress={() => openAuth(s)} style={styles.connect} hitSlop={6}>
                  <Plus size={14} color={ACCENT} />
                  <Text style={styles.connectText}>Connect</Text>
                </Press>
              ) : (
                <Lock size={15} color="#555" />
              )}
            </View>
          );
        })}

        <Text style={styles.section}>Queue</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View>
              <Text style={styles.cardTitle}>Source</Text>
              <Text style={styles.cardSub}>
                {source === "spotify" ? "Live from your Spotify history" : "Sample drive mix"}
              </Text>
            </View>
            <Press
              onPress={refreshQueue}
              disabled={loadingQueue}
              style={[styles.refresh, loadingQueue && { opacity: 0.5 }]}
              hitSlop={6}
            >
              <RefreshCw size={14} color="#fff" />
              <Text style={styles.refreshText}>{loadingQueue ? "Refreshing…" : "Refresh"}</Text>
            </Press>
          </View>
        </View>

        <View style={styles.note}>
          <Check size={13} color={ACCENT} />
          <Text style={styles.noteText}>
            Connections use each service's own secure sign-in. Tokens are stored only on
            this device and never leave it.
          </Text>
        </View>
      </ScrollView>
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  head: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 22, paddingTop: 8, paddingBottom: 14 },
  backBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontFamily: FONT.extrabold, letterSpacing: -0.5, color: COLORS.text },
  sub: { fontSize: 12.5, color: COLORS.textMute, marginTop: 1, fontFamily: FONT.regular },

  body: { paddingHorizontal: 22, paddingBottom: 30 },
  section: { fontSize: 12, color: COLORS.textGhost, fontFamily: FONT.semibold, textTransform: "uppercase", letterSpacing: 0.6, marginTop: 16, marginBottom: 10 },

  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, marginBottom: 10 },
  icon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  meta: { flex: 1 },
  name: { fontSize: 15, fontFamily: FONT.bold, color: COLORS.text },
  status: { fontSize: 11.5, color: COLORS.textFaint, marginTop: 1, fontFamily: FONT.regular },
  connect: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: `${ACCENT}1c`, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20 },
  connectText: { fontSize: 12.5, fontFamily: FONT.bold, color: ACCENT },
  disconnect: { backgroundColor: "#2a2a36", paddingVertical: 7, paddingHorizontal: 12, borderRadius: 20 },
  disconnectText: { fontSize: 12.5, fontFamily: FONT.semibold, color: "#cfcfda" },

  card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 16, padding: 14 },
  cardRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardTitle: { fontSize: 14, fontFamily: FONT.bold, color: COLORS.text },
  cardSub: { fontSize: 12, color: COLORS.textMute, marginTop: 2, fontFamily: FONT.regular },
  refresh: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#2a2a36", paddingVertical: 8, paddingHorizontal: 13, borderRadius: 20 },
  refreshText: { fontSize: 12.5, fontFamily: FONT.semibold, color: "#fff" },

  note: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 20, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 13 },
  noteText: { flex: 1, fontSize: 11.5, color: COLORS.textMute, lineHeight: 16, fontFamily: FONT.regular },
});
