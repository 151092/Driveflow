import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { QUEUE } from "../data";
import { useAuth } from "../auth/AuthContext";
import {
  fetchSpotifyQueue, getPlaybackState, getDevices, transferPlayback,
  play, pause, skipNext, skipPrevious,
} from "../api/spotify";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

const NO_DEVICE_HINT = "Open Spotify on a phone, speaker, or desktop to control playback from here.";
const PREMIUM_HINT = "Live control needs Spotify Premium with an active device — using a local preview.";

export function PlayerProvider({ children }) {
  const { linked, getAccessToken } = useAuth();

  const [queue, setQueue] = useState(QUEUE);
  const [source, setSource] = useState("sample"); // sample | spotify
  const [loadingQueue, setLoadingQueue] = useState(false);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);

  // Remote = controlling a real Spotify device via the Web API (vs the local ticker).
  const [remote, setRemote] = useState(false);
  const [remoteHint, setRemoteHint] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null); // live track from the device
  const [device, setDevice] = useState(null);         // active device name/id

  const timer = useRef(null);
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const idxRef = useRef(idx);
  idxRef.current = idx;

  // When remotely controlling, show exactly what the device is playing.
  const track = (remote && nowPlaying) || queue[idx] || queue[0];
  const token = () => getAccessToken("spotify");

  // ---- queue + remote detection ----
  const detectRemote = async (t) => {
    try {
      const st = await getPlaybackState(t);
      if (st.active) { setRemote(true); setRemoteHint(null); applyState(st); }
      else { setRemote(false); setDevice(null); setNowPlaying(null); setRemoteHint(NO_DEVICE_HINT); }
    } catch (e) {
      setRemote(false);
    }
  };

  const loadSpotifyQueue = async () => {
    const t = await token();
    if (!t) return false;
    setLoadingQueue(true);
    try {
      const real = await fetchSpotifyQueue(t);
      if (real.length) { setQueue(real); setSource("spotify"); setIdx(0); setPos(0); }
      await detectRemote(t);
      return real.length > 0;
    } catch (e) {
      // Keep the sample queue on any API/network failure.
    } finally {
      setLoadingQueue(false);
    }
    return false;
  };

  useEffect(() => {
    loadSpotifyQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linked.spotify?.accessToken]);

  // Reconcile our UI with the live device state.
  const applyState = (st) => {
    setPlaying(st.isPlaying);
    setPos(Math.round((st.progressMs || 0) / 1000));
    setDevice(st.device || null);
    if (st.track) setNowPlaying(st.track);
    if (st.trackId) {
      const found = queueRef.current.findIndex((q) => q.id === st.trackId);
      if (found >= 0) setIdx(found);
    }
  };

  // ---- device selection (transfer playback) ----
  const listDevices = async () => {
    const t = await token();
    if (!t) return [];
    try { return await getDevices(t); } catch (e) { return []; }
  };

  const selectDevice = async (deviceId) => {
    const t = await token();
    if (!t) return false;
    const moved = await transferPlayback(t, deviceId, true);
    if (moved) {
      setRemote(true);
      setRemoteHint(null);
      // Give Spotify a moment to spin up the device, then sync.
      setTimeout(async () => {
        const tk = await token();
        if (tk) { try { const st = await getPlaybackState(tk); if (st.active) applyState(st); } catch (e) {} }
      }, 700);
    }
    return moved;
  };

  // ---- ticking: poll the device when remote, otherwise run the local clock ----
  useEffect(() => {
    clearInterval(timer.current);

    if (remote) {
      timer.current = setInterval(async () => {
        const t = await token();
        if (!t) return;
        try {
          const st = await getPlaybackState(t);
          if (st.active) applyState(st);
          else { setRemote(false); setRemoteHint(NO_DEVICE_HINT); }
        } catch (e) { /* transient; keep last known state */ }
      }, 1000);
    } else if (playing) {
      timer.current = setInterval(() => {
        setPos((p) => {
          if (p >= (queueRef.current[idxRef.current]?.dur ?? 0)) { localNext(); return 0; }
          return p + 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remote, playing, idx, queue]);

  // ---- local transport (sample / simulated / fallback) ----
  const len = () => queueRef.current.length;
  const localNext = () => { setIdx((i) => (i + 1) % len()); setPos(0); setPlaying(true); };
  const localPrev = () => { setIdx((i) => (i - 1 + len()) % len()); setPos(0); setPlaying(true); };

  // If a remote action fails, drop to local control and explain why once.
  const dropToLocal = () => { setRemote(false); setNowPlaying(null); setDevice(null); setRemoteHint(PREMIUM_HINT); };

  // ---- public transport (remote-aware) ----
  const togglePlay = async () => {
    if (remote) {
      const t = await token();
      if (t && (playing ? await pause(t) : await play(t))) { setPlaying((p) => !p); return; }
      dropToLocal();
    }
    setPlaying((p) => !p);
  };

  const next = async () => {
    if (remote) {
      const t = await token();
      if (t && (await skipNext(t))) { setPos(0); return; } // poll resolves the new track
      dropToLocal();
    }
    localNext();
  };

  const prev = async () => {
    if (remote) {
      const t = await token();
      if (t && (await skipPrevious(t))) { setPos(0); return; }
      dropToLocal();
    }
    localPrev();
  };

  const goto = async (i) => {
    if (remote) {
      const t = await token();
      const uri = queueRef.current[i]?.uri;
      if (t && uri && (await play(t, { uris: [uri] }))) { setIdx(i); setPos(0); setPlaying(true); return; }
      dropToLocal();
    }
    setIdx(i); setPos(0); setPlaying(true);
  };

  const startDrive = async () => {
    if (remote) {
      const t = await token();
      if (t && (await play(t))) { setPlaying(true); return; }
      dropToLocal();
    }
    setPlaying(true);
  };

  const value = {
    queue, source, loadingQueue, refreshQueue: loadSpotifyQueue,
    remote, remoteHint, device, listDevices, selectDevice,
    idx, playing, pos, track,
    next, prev, goto, togglePlay, startDrive,
  };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
