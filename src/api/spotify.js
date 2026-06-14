import { Music2 } from "lucide-react-native";

const SPOTIFY_GREEN = "#1DB954";
const API = "https://api.spotify.com/v1";

// Map a Spotify track object into Driveflow's queue-item shape.
function mapTrack(track, i) {
  const artists = (track.artists || []).map((a) => a.name).join(", ");
  return {
    id: track.id || `sp-${i}`,
    type: "Music",
    src: "Spotify",
    title: track.name,
    sub: artists || "Spotify",
    reason: "From your recent Spotify listening",
    dur: Math.round((track.duration_ms || 0) / 1000),
    hue: SPOTIFY_GREEN,
    icon: Music2,
  };
}

// Build a queue from the user's recently-played tracks. De-duplicates repeats
// (recently-played is chronological and often contains the same track twice).
export async function fetchSpotifyQueue(accessToken, limit = 12) {
  const res = await fetch(`${API}/me/player/recently-played?limit=${limit}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`recently-played ${res.status}`);

  const data = await res.json();
  const seen = new Set();
  const queue = [];
  for (const item of data.items || []) {
    const t = item.track;
    if (!t || seen.has(t.id)) continue;
    seen.add(t.id);
    queue.push(mapTrack(t, queue.length));
  }
  return queue;
}
