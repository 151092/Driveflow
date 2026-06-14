import { Music2 } from "lucide-react-native";

const SPOTIFY_GREEN = "#1DB954";
const API = "https://api.spotify.com/v1";

// Map a Spotify track object into Driveflow's queue-item shape.
function mapTrack(track, i) {
  const artists = (track.artists || []).map((a) => a.name).join(", ");
  return {
    id: track.id || `sp-${i}`,
    uri: track.uri || null,
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

const auth = (token) => ({ Authorization: `Bearer ${token}` });
const ok = (res) => res.ok || res.status === 204;

// ---- Remote playback control (Web API drives the user's active Spotify device) ----

// Returns { active:false } when no device is playing, otherwise the live state.
export async function getPlaybackState(token) {
  const res = await fetch(`${API}/me/player`, { headers: auth(token) });
  if (res.status === 204) return { active: false };
  if (!res.ok) throw new Error(`player ${res.status}`);
  const d = await res.json();
  return {
    active: true,
    isPlaying: !!d.is_playing,
    progressMs: d.progress_ms || 0,
    trackId: d.item?.id || null,
    durationMs: d.item?.duration_ms || 0,
    device: d.device || null,
  };
}

export async function play(token, { uris, positionMs } = {}) {
  const body = uris ? JSON.stringify({ uris, position_ms: positionMs || 0 }) : undefined;
  const res = await fetch(`${API}/me/player/play`, {
    method: "PUT",
    headers: { ...auth(token), ...(body ? { "Content-Type": "application/json" } : {}) },
    body,
  });
  return ok(res);
}

export async function pause(token) {
  return ok(await fetch(`${API}/me/player/pause`, { method: "PUT", headers: auth(token) }));
}

export async function skipNext(token) {
  return ok(await fetch(`${API}/me/player/next`, { method: "POST", headers: auth(token) }));
}

export async function skipPrevious(token) {
  return ok(await fetch(`${API}/me/player/previous`, { method: "POST", headers: auth(token) }));
}

export async function seek(token, positionMs) {
  return ok(
    await fetch(`${API}/me/player/seek?position_ms=${Math.round(positionMs)}`, {
      method: "PUT",
      headers: auth(token),
    })
  );
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
