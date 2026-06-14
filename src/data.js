import {
  Music2, Headphones, BookOpen, Radio,
} from "lucide-react-native";

// ---- Services. The three primary integrations are live in the demo;
//      the rest show as "Soon" so the wider-net vision still reads. ----
export const SERVICES = [
  { id: "spotify", name: "Spotify",     tag: "Music & podcasts", icon: Music2,    hue: "#1DB954", live: true,
    scopes: ["Read your listening history", "See your playlists & liked songs", "Control playback"] },
  { id: "apple",   name: "Apple Music", tag: "Music & radio",    icon: Music2,    hue: "#FA2D48", live: true,
    scopes: ["Read your recently played", "See your library & favorites", "Control playback"] },
  { id: "audible", name: "Audible",     tag: "Audiobooks",       icon: BookOpen,  hue: "#FF9910", live: true,
    scopes: ["See your library & progress", "Resume from your last position", "Control playback"] },
  { id: "podcasts", name: "Podcasts",   tag: "Coming soon",      icon: Headphones, hue: "#9B6DFF", live: false, scopes: [] },
  { id: "radio",    name: "Live Radio", tag: "Coming soon",      icon: Radio,      hue: "#4EA8FF", live: false, scopes: [] },
];

export const QUEUE = [
  { id: 1, type: "Music",     src: "Spotify",     title: "Midnight City Drive",      sub: "Synthwave mix",          reason: "You replay synthwave on evening commutes", dur: 214,  hue: "#1DB954", icon: Music2 },
  { id: 2, type: "Audiobook", src: "Audible",     title: "Project Hail Mary · Ch.14", sub: "Resumes at 03:41",       reason: "Picks up your last listening position",    dur: 1980, hue: "#FF9910", icon: BookOpen },
  { id: 3, type: "Music",     src: "Apple Music", title: "Focus Lo-Fi Beats",        sub: "Low-energy for traffic", reason: "Matched to a slow segment ahead",          dur: 188,  hue: "#FA2D48", icon: Music2 },
];

export const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function voiceReply(text) {
  const t = text.toLowerCase();
  if (t.includes("book") || t.includes("audio")) return { say: "Back to Project Hail Mary, chapter 14 — picking up at 3:41.", jump: 1 };
  if (t.includes("skip") || t.includes("next"))  return { say: "Skipping ahead. Here's something with more energy.", next: true };
  if (t.includes("focus") || t.includes("calm") || t.includes("traffic")) return { say: "Traffic's heavy ahead — switching you to low-energy lo-fi.", jump: 2 };
  if (t.includes("commute") || t.includes("drive") || t.includes("play")) return { say: "Building your mix from tonight's listening. Starting with Midnight City Drive.", jump: 0 };
  return { say: "I can play your music, resume your audiobook, or build a drive mix. Just say the word." };
}

export const SAMPLE_CMDS = ["Play something for my commute", "Skip this", "Resume my audiobook", "Traffic's bad — calm it down"];
