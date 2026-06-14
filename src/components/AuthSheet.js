import React from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Lock, Check } from "lucide-react-native";
import { COLORS, FONT } from "../theme";
import Press from "./Press";
import Spinner from "./Spinner";

// Secure authorize sheet (mock OAuth). `step` is one of: ask | working | done.
export default function AuthSheet({ service, step, onAuthorize, onCancel }) {
  if (!service) return null;
  const Icon = service.icon;

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.scrim} onPress={() => step === "ask" && onCancel()}>
        <Pressable style={styles.card} onPress={() => {}}>
          {step !== "done" && (
            <>
              <View style={[styles.icon, { backgroundColor: `${service.hue}22` }]}>
                <Icon size={26} color={service.hue} />
              </View>
              <Text style={styles.title}>Sign in to {service.name}</Text>
              <View style={styles.hostRow}>
                <Lock size={11} color={COLORS.textFaint} />
                <Text style={styles.host}>auth.{service.id}.com</Text>
              </View>

              {step === "ask" && (
                <>
                  <View style={styles.scopeBox}>
                    <Text style={styles.scopeLabel}>Driveflow will be able to</Text>
                    {service.scopes.map((sc) => (
                      <View key={sc} style={styles.scopeItem}>
                        <Check size={14} color={service.hue} />
                        <Text style={styles.scopeText}>{sc}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.note}>
                    Driveflow never sees your {service.name} password. You can disconnect anytime.
                  </Text>
                  <Press onPress={onAuthorize} scaleTo={0.97} fullWidth>
                    <View style={[styles.authBtn, { backgroundColor: service.hue }]}>
                      <Text style={styles.authBtnText}>Authorize {service.name}</Text>
                    </View>
                  </Press>
                  <Pressable onPress={onCancel} style={styles.cancel}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </Pressable>
                </>
              )}

              {step === "working" && (
                <View style={styles.working}>
                  <Spinner color={service.hue} />
                  <Text style={styles.workingTxt}>Securely connecting…</Text>
                </View>
              )}
            </>
          )}

          {step === "done" && (
            <View style={styles.working}>
              <View style={[styles.doneTick, { backgroundColor: service.hue }]}>
                <Check size={30} color="#fff" strokeWidth={3} />
              </View>
              <Text style={styles.workingTxt}>{service.name} connected</Text>
            </View>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: "rgba(5,5,10,.7)", justifyContent: "flex-end" },
  card: {
    width: "100%", backgroundColor: COLORS.card, borderTopLeftRadius: 26, borderTopRightRadius: 26,
    borderWidth: 1, borderColor: "#25252f", paddingHorizontal: 24, paddingTop: 26, paddingBottom: 30,
    alignItems: "center",
  },
  icon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  title: { fontSize: 19, fontFamily: FONT.extrabold, color: COLORS.text },
  hostRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5, marginBottom: 18 },
  host: { fontSize: 11.5, color: COLORS.textFaint, fontFamily: FONT.mono },
  scopeBox: {
    width: "100%", backgroundColor: "#0e0e16", borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 14, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 14,
  },
  scopeLabel: { fontSize: 11, color: COLORS.textFaint, textTransform: "uppercase", letterSpacing: 0.6, fontFamily: FONT.semibold, marginBottom: 10 },
  scopeItem: { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 5 },
  scopeText: { fontSize: 13.5, color: "#d4d4dc", fontFamily: FONT.regular },
  note: { fontSize: 12, color: COLORS.textMute, lineHeight: 18, textAlign: "center", marginBottom: 18, paddingHorizontal: 4, fontFamily: FONT.regular },
  authBtn: { width: "100%", paddingVertical: 15, borderRadius: 14, alignItems: "center", marginBottom: 8 },
  authBtnText: { color: "#fff", fontFamily: FONT.extrabold, fontSize: 15 },
  cancel: { width: "100%", paddingVertical: 12, alignItems: "center" },
  cancelText: { color: COLORS.textMute, fontFamily: FONT.semibold, fontSize: 14 },
  working: { alignItems: "center", gap: 16, paddingTop: 20, paddingBottom: 14 },
  workingTxt: { fontSize: 15, fontFamily: FONT.bold, color: "#fff" },
  doneTick: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
});
