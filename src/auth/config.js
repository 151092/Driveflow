// OAuth provider configuration.
//
// Only Spotify exposes a public, mobile-friendly OAuth (Authorization Code + PKCE).
// Apple Music uses MusicKit (a developer JWT, not user OAuth) and Audible has no
// public OAuth API — so those are flagged `simulated` and fall back to the demo flow.
//
// To make Spotify real, register an app at https://developer.spotify.com, add the
// redirect URI printed by `makeRedirectUri` (scheme `driveflow`), and set:
//   EXPO_PUBLIC_SPOTIFY_CLIENT_ID=...    (e.g. in a .env file)
// With no client id set, Spotify also falls back to the simulated flow so the app
// still runs end-to-end as a demo.

const SPOTIFY_CLIENT_ID = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID || "";

export const AUTH_CONFIG = {
  spotify: {
    clientId: SPOTIFY_CLIENT_ID,
    simulated: !SPOTIFY_CLIENT_ID,
    scopes: [
      "user-read-private",
      "user-read-recently-played",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-library-read",
      "playlist-read-private",
      "user-top-read",
    ],
    discovery: {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint: "https://accounts.spotify.com/api/token",
    },
  },
  // No public user-OAuth — kept on the shared interface as simulated.
  apple: { simulated: true, scopes: [], discovery: null },
  audible: { simulated: true, scopes: [], discovery: null },
};

export const isSimulated = (id) => !AUTH_CONFIG[id] || AUTH_CONFIG[id].simulated;
