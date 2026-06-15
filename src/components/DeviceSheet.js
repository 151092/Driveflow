import React from "react";
import { Modal, View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { Smartphone, Speaker, Monitor, Check, RefreshCw } from "lucide-react-native";
import { COLORS, FONT, ACCENT } from "../theme";
import Press from "./Press";

const iconFor = (type) => {
  const t = (type || "").toLowerCase();
  if (t.includes("speaker") || t.includes("cast") || t.includes("tv")) return Speaker;
  if (t.includes("computer")) return Monitor;
  return Smartphone;
};

// Lets the user pick which Spotify device Driveflow should control.
export default function DeviceSheet({ visible, devices, loading, onSelect, onRefresh, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.grip} />
          <View style={styles.head}>
            <Text style={styles.title}>Play on a device</Text>
            <Press onPress={onRefresh} style={styles.refresh} hitSlop={8}>
              <RefreshCw size={15} color={COLORS.textMute} />
            </Press>
          </View>
          <Text style={styles.sub}>Open Spotify on a phone, speaker, or desktop to see it here.</Text>

          <ScrollView style={styles.list} contentContainerStyle={styles.listInner}>
            {loading && devices.length === 0 && (
              <View style={styles.empty}><ActivityIndicator color={ACCENT} /></View>
            )}
            {!loading && devices.length === 0 && (
              <Text style={styles.emptyText}>No active devices found. Start playing something in Spotify, then refresh.</Text>
            )}
            {devices.map((d) => {
              const Icon = iconFor(d.type);
              return (
                <Press key={d.id} fullWidth style={styles.row} onPress={() => onSelect(d)}>
                  <View style={styles.rowIcon}><Icon size={18} color="#fff" /></View>
                  <View style={styles.rowMeta}>
                    <Text style={styles.rowName}>{d.name}</Text>
                    <Text style={styles.rowType}>{d.type}{d.is_active ? " · active" : ""}</Text>
                  </View>
                  {d.is_active && (
                    <View style={styles.dot}><Check size={12} color="#fff" strokeWidth={3} /></View>
                  )}
                </Press>
              );
            })}
          </ScrollView>

          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,.45)" },
  sheet: { backgroundColor: "#12121a", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 22, paddingTop: 12, paddingBottom: 28, borderWidth: 1, borderColor: COLORS.border },
  grip: { width: 44, height: 5, borderRadius: 3, backgroundColor: "#33333e", alignSelf: "center", marginBottom: 16 },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontFamily: FONT.extrabold, fontSize: 17, color: COLORS.text },
  refresh: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border },
  sub: { fontSize: 12, color: COLORS.textMute, marginTop: 3, marginBottom: 14, fontFamily: FONT.regular },

  list: { maxHeight: 280 },
  listInner: { gap: 9, paddingBottom: 4 },
  empty: { paddingVertical: 24, alignItems: "center" },
  emptyText: { fontSize: 13, color: COLORS.textFaint, textAlign: "center", lineHeight: 19, paddingVertical: 16, fontFamily: FONT.regular },
  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 14, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  rowIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#1DB95422", alignItems: "center", justifyContent: "center" },
  rowMeta: { flex: 1 },
  rowName: { fontSize: 14.5, fontFamily: FONT.bold, color: COLORS.text },
  rowType: { fontSize: 11.5, color: COLORS.textFaint, marginTop: 1, fontFamily: FONT.regular },
  dot: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#1DB954", alignItems: "center", justifyContent: "center" },

  close: { marginTop: 16, paddingVertical: 13, borderRadius: 14, backgroundColor: COLORS.border, alignItems: "center" },
  closeText: { color: "#fff", fontFamily: FONT.bold, fontSize: 14 },
});
