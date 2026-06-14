import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { QUEUE } from "../data";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0);
  const timer = useRef(null);

  const track = QUEUE[idx];

  // 1s playback ticker; advances to the next track at the end.
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
  const togglePlay = () => setPlaying((p) => !p);
  const startDrive = () => setPlaying(true);

  const value = { idx, playing, pos, track, next, prev, goto, togglePlay, startDrive };
  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
