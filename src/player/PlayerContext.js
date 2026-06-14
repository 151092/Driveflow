import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { QUEUE } from "../data";
import { useAuth } from "../auth/AuthContext";
import { fetchSpotifyQueue } from "../api/spotify";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const { linked, getAccessToken } = useAuth();

  const [queue, setQueue] = useState(QUEUE);
  const [source, setSource] = useState("sample"); // sample | spotify
  const [loadingQueue, setLoadingQueue] = useState(false);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const timer = useRef(null);

  // Always read the live queue inside the ticker to avoid stale closures.
  const queueRef = useRef(queue);
  queueRef.current = queue;

  const track = queue[idx] || queue[0];

  // Replace the sample queue with real recently-played once Spotify is connected
  // with a real (non-simulated) token.
  const loadSpotifyQueue = async () => {
    const token = await getAccessToken("spotify");
    if (!token) return false;
    setLoadingQueue(true);
    try {
      const real = await fetchSpotifyQueue(token);
      if (real.length) { setQueue(real); setSource("spotify"); setIdx(0); setPos(0); return true; }
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

  // 1s playback ticker; advances to the next track at the end.
  useEffect(() => {
    clearInterval(timer.current);
    if (playing) {
      timer.current = setInterval(() => {
        setPos((p) => {
          if (p >= (queueRef.current[idx]?.dur ?? 0)) { next(); return 0; }
          return p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, idx, queue]);

  const len = () => queueRef.current.length;
  const next = () => { setIdx((i) => (i + 1) % len()); setPos(0); setPlaying(true); };
  const prev = () => { setIdx((i) => (i - 1 + len()) % len()); setPos(0); setPlaying(true); };
  const goto = (i) => { setIdx(i); setPos(0); setPlaying(true); };
  const togglePlay = () => setPlaying((p) => !p);
  const startDrive = () => setPlaying(true);

  const value = {
    queue, source, loadingQueue, refreshQueue: loadSpotifyQueue,
    idx, playing, pos, track,
    next, prev, goto, togglePlay, startDrive,
  };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
