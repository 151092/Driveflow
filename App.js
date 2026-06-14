import React, { useState, useEffect, useRef } from "react";
import { View, SafeAreaView, StyleSheet, StatusBar, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import {
  Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold,
} from "@expo-google-fonts/sora";
import { SpaceMono_400Regular } from "@expo-google-fonts/space-mono";

import { SERVICES, QUEUE, voiceReply } from "./src/data";
import { COLORS } from "./src/theme";
import IntroScreen from "./src/screens/IntroScreen";
import LinkScreen from "./src/screens/LinkScreen";
import DriveScreen from "./src/screens/DriveScreen";
import AuthSheet from "./src/components/AuthSheet";
import VoiceSheet from "./src/components/VoiceSheet";

const liveServices = SERVICES.filter((s) => s.live);

export default function App() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold,
    SpaceMono_400Regular,
  });

  const [screen, setScreen] = useState("intro"); // intro | link | drive
  const [linked, setLinked] = useState({});       // { spotify: true, ... }
  const [authFor, setAuthFor] = useState(null);    // service obj being authorized
  const [authStep, setAuthStep] = useState("ask"); // ask | working | done

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  const [voiceOpen, setVoiceOpen] = useState(false);
  const [convo, setConvo] = useState([]);
  const [listening, setListening] = useState(false);
  const timer = useRef(null);

  const track = QUEUE[idx];
  const linkedCount = liveServices.filter((s) => linked[s.id]).length;

  // ---- playback ticker ----
  useEffect(() => {
    clearInterval(timer.current);
    if (playing) {
      timer.current = setInterval(() => {
        setPos((p) => {
          if (p >= QUEUE[idx].dur) { next(); return 0; }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx]);

  const next = () => { setIdx((i) => (i + 1) % QUEUE.length); setPos(0); setPlaying(true); };
  const prev = () => { setIdx((i) => (i - 1 + QUEUE.length) % QUEUE.length); setPos(0); setPlaying(true); };
  const goto = (i) => { setIdx(i); setPos(0); setPlaying(true); };

  // ---- secure authorize flow (mock OAuth) ----
  const openAuth = (svc) => { setAuthFor(svc); setAuthStep("ask"); };
  const authorize = () => {
    setAuthStep("working");
    setTimeout(() => setAuthStep("done"), 1100);
    setTimeout(() => {
      setLinked((l) => ({ ...l, [authFor.id]: true }));
      setAuthFor(null);
    }, 2000);
  };

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

  if (!fontsLoaded) {
    return <View style={[styles.root, { backgroundColor: COLORS.bg }]} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={[COLORS.bgTop, COLORS.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe}>
        {screen === "intro" && <IntroScreen onConnect={() => setScreen("link")} />}

        {screen === "link" && (
          <LinkScreen
            linked={linked}
            linkedCount={linkedCount}
            liveCount={liveServices.length}
            onBack={() => setScreen("intro")}
            onOpenAuth={openAuth}
            onStart={() => { setScreen("drive"); setPlaying(true); }}
          />
        )}

        {screen === "drive" && (
          <DriveScreen
            track={track}
            idx={idx}
            playing={playing}
            pos={pos}
            linkedCount={linkedCount}
            onPrev={prev}
            onNext={next}
            onTogglePlay={() => setPlaying((p) => !p)}
            onGoto={goto}
            onOpenVoice={() => setVoiceOpen(true)}
          />
        )}
      </SafeAreaView>

      <AuthSheet
        service={authFor}
        step={authStep}
        onAuthorize={authorize}
        onCancel={() => setAuthFor(null)}
      />

      <VoiceSheet
        visible={voiceOpen}
        listening={listening}
        convo={convo}
        onRun={runVoice}
        onClose={() => setVoiceOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  safe: { flex: 1, paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0 },
});
