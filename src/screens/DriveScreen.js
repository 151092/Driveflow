import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Play, Pause, SkipForward, SkipBack, Waves, Sparkles, Mic, Settings,
} from "lucide-react-native";
import { fmt, voiceReply } from "../data";
import { BRAND, ACCENT, COLORS, FONT, GRAD_135, shadow } from "../theme";
import { useAuth } from "../auth/AuthContext";
import { usePlayer } from "../player/PlayerContext";
import Press from "../components/Press";
import FadeIn from "../components/FadeIn";
import Equalizer from "../components/Equalizer";
import VoiceSheet from "../components/VoiceSheet";

export default function DriveScreen({ navigation }) {
  const { linkedCount } = useAuth();
  const { queue, source, track, idx, playing, pos, prev, next, togglePlay, goto } = usePlayer();

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [convo, setConvo] = useState([]);
  const [listening, setListening] = useState(false);

  const runVoice = (text) => {
    setListening(true);
    setConvo((c) => [...c, { who: "you", text }]);
    setTimeout(() => {
      const r = voiceReply(text);
      setConvo((c) => [...c, { who: "flow", text: r.say }]);
      setListening(false);
      if (typeof r.jump === "number") goto(r.jump);
      if (r.next) next();
    }, 850);
  };

  const TrackIcon = track.icon;
  const pct = Math.min(100, (pos / track.dur) * 100);

  return (
    <FadeIn style={styles.screen}>
      <View style={styles.head}>
        <View style={styles.headMeta}>
          <Text style={styles.greet}>Evening commute</Text>
          <Text style={styles.greetSub}>
            {source === "spotify"
              ? "From your recent Spotify listening"
              : `Mixed across ${linkedCount} connected source${linkedCount > 1 ? "s" : ""}`}
          </Text>
        </View>
        <View style={styles.headBtns}>
          <View style={styles.liveBadge}>
            <Waves size={16} color={ACCENT} />
          </View>
          <Press onPress={() => navigation.navigate("Settings")} style={styles.iconBtn} hitSlop={8}>
            <Settings size={18} color="#fff" />
          </Press>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.now}>
          <LinearGradient colors={[track.hue, `${track.hue}55`]} {...GRAD_135} style={styles.art}>
            <TrackIcon size={42} color="#fff" style={{ opacity: 0.92 }} />
            {playing && <Equalizer />}
          </LinearGradient>

          <View style={styles.reason}>
            <Sparkles size={12} color="#C7B8FF" />
            <Text style={styles.reasonText}>{track.reason}</Text>
          </View>
          <Text style={styles.nowTitle}>{track.title}</Text>
          <Text style={styles.nowSub}>{track.src} · {track.sub}</Text>

          <View style={styles.barWrap}>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: track.hue }]} />
            </View>
            <View style={styles.times}>
              <Text style={styles.timeText}>{fmt(pos)}</Text>
              <Text style={styles.timeText}>{fmt(track.dur)}</Text>
            </View>
          </View>

          <View style={styles.transport}>
            <Press onPress={prev} style={styles.tBtn} hitSlop={8}>
              <SkipBack size={22} color="#fff" />
            </Press>
            <Press onPress={togglePlay}>
              <View style={[styles.playBtn, { backgroundColor: track.hue }]}>
                {playing
                  ? <Pause size={26} color="#fff" />
                  : <Play size={26} color="#fff" style={{ marginLeft: 3 }} />}
              </View>
            </Press>
            <Press onPress={next} style={styles.tBtn} hitSlop={8}>
              <SkipForward size={22} color="#fff" />
            </Press>
          </View>
        </View>

        <Text style={styles.upNext}>Up next on your route</Text>
        <View style={styles.queue}>
          {queue.map((q, i) => {
            if (i === idx) return null;
            const QIcon = q.icon;
            return (
              <Press key={q.id} fullWidth style={styles.qItem} onPress={() => goto(i)}>
                <View style={[styles.qIcon, { backgroundColor: `${q.hue}22` }]}>
                  <QIcon size={16} color={q.hue} />
                </View>
                <View style={styles.qMeta}>
                  <Text style={styles.qTitle}>{q.title}</Text>
                  <Text style={styles.qType}>{q.src} · {fmt(q.dur)}</Text>
                </View>
                <Play size={14} color={COLORS.textGhost} />
              </Press>
            );
          })}
        </View>
      </ScrollView>

      <Press onPress={() => setVoiceOpen(true)} style={[styles.fab, shadow(30, 0.5)]} scaleTo={0.9}>
        <LinearGradient colors={BRAND} {...GRAD_135} style={styles.fabInner}>
          <Mic size={26} color="#fff" />
        </LinearGradient>
      </Press>

      <VoiceSheet
        visible={voiceOpen}
        listening={listening}
        convo={convo}
        onRun={runVoice}
        onClose={() => setVoiceOpen(false)}
      />
    </FadeIn>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 8, paddingBottom: 8 },
  headMeta: { flex: 1, paddingRight: 12 },
  headBtns: { flexDirection: "row", alignItems: "center", gap: 10 },
  greet: { fontSize: 20, fontFamily: FONT.extrabold, letterSpacing: -0.5, color: COLORS.text },
  greetSub: { fontSize: 12.5, color: COLORS.textMute, marginTop: 2, fontFamily: FONT.regular },
  liveBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: `${ACCENT}1c`, alignItems: "center", justifyContent: "center" },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surfaceAlt, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },

  scroll: { paddingBottom: 110 },
  now: { paddingHorizontal: 24, paddingTop: 14, alignItems: "center" },
  art: { width: 150, height: 150, borderRadius: 26, alignItems: "center", justifyContent: "center", marginBottom: 14, ...shadow(40, 0.45) },
  reason: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#8B5CF614", paddingVertical: 5, paddingHorizontal: 11, borderRadius: 20, marginBottom: 10 },
  reasonText: { fontSize: 11, color: "#C7B8FF", fontFamily: FONT.semibold },
  nowTitle: { fontSize: 19, fontFamily: FONT.extrabold, textAlign: "center", letterSpacing: -0.5, color: COLORS.text },
  nowSub: { fontSize: 12.5, color: COLORS.textMute, marginTop: 3, marginBottom: 14, textAlign: "center", fontFamily: FONT.regular },

  barWrap: { width: "100%", marginBottom: 14 },
  barTrack: { height: 5, borderRadius: 3, backgroundColor: COLORS.border, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  times: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  timeText: { fontSize: 10.5, color: COLORS.textGhost, fontFamily: FONT.mono },

  transport: { flexDirection: "row", alignItems: "center", gap: 26, marginBottom: 6 },
  tBtn: { padding: 4 },
  playBtn: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },

  upNext: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8, fontSize: 12, color: COLORS.textGhost, fontFamily: FONT.semibold, textTransform: "uppercase", letterSpacing: 0.6 },
  queue: { paddingHorizontal: 24, gap: 8 },
  qItem: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: COLORS.surface },
  qIcon: { width: 32, height: 32, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  qMeta: { flex: 1 },
  qTitle: { fontSize: 13.5, fontFamily: FONT.semibold, color: COLORS.text },
  qType: { fontSize: 11, color: COLORS.textFaint, marginTop: 1, fontFamily: FONT.regular },

  fab: { position: "absolute", bottom: 26, alignSelf: "center" },
  fabInner: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
});
