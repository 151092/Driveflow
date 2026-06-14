# Driveflow

One sign-in. Every drive, scored.

Driveflow connects the audio services you already pay for (Spotify, Apple Music,
Audible — with Podcasts and Live Radio coming soon), reads across all of them,
and curates the road ahead. Hands on the wheel, voice in control.

This repo is the **React Native (Expo)** app, ported from the original web
prototype. **Spotify** uses a real OAuth (Authorization Code + PKCE) flow when a
client id is configured; **Apple Music** (MusicKit) and **Audible** (no public
OAuth) run on a simulated flow behind the same interface. The queue and voice
assistant still run on sample data.

## Stack

- **Expo** SDK 56 / React Native 0.85 / React 19
- `@react-navigation/native` + native-stack — navigation
- `expo-auth-session` + `expo-crypto` + `expo-web-browser` — OAuth (PKCE)
- `expo-secure-store` — token persistence in the device keychain/keystore
- `expo-linear-gradient` — brand gradients
- `lucide-react-native` + `react-native-svg` — icons
- `@expo-google-fonts/sora` + `@expo-google-fonts/space-mono` — type
- Core `Animated` API — equalizer bars, OAuth spinner, voice-orb pulse, fades

## Real Spotify OAuth

Out of the box the app runs end-to-end with a simulated connect flow. To make
Spotify real:

1. `cp .env.example .env`
2. Register an app at https://developer.spotify.com/dashboard and add the
   redirect URI the app logs on launch (scheme `driveflow`).
3. Set `EXPO_PUBLIC_SPOTIFY_CLIENT_ID` in `.env` and restart the dev server.

PKCE is used, so no client secret is required. Tokens are refreshed
automatically when expired. Once Spotify is connected for real, the drive queue
is built from your **recently-played** tracks (and can be refreshed from the
Account screen); otherwise a sample mix is used. Apple Music and Audible stay
simulated — neither offers a public user-facing OAuth.

## Running

```bash
npm install
npm start        # then press i / a, or scan the QR with Expo Go
npm run ios      # iOS simulator (macOS)
npm run android  # Android emulator
```

## Structure

```
App.js                       # providers + NavigationContainer + app gradient
src/
  data.js                    # services, queue, voice replies, helpers
  theme.js                   # colors, fonts, gradient + shadow tokens
  navigation/
    RootNavigator.js         # native stack: Intro → Link → Drive
  api/
    spotify.js               # recently-played → queue items
  auth/
    config.js                # per-service OAuth config (Spotify real, rest simulated)
    AuthContext.js           # OAuth flow, linked state, connect/disconnect, token refresh
    AuthSheetHost.js         # single app-level consent sheet
    storage.js               # secure token persistence
  player/
    PlayerContext.js         # shared playback state; loads the real Spotify queue
  screens/
    IntroScreen.js           # value prop + "Connect my accounts"
    LinkScreen.js            # service list, connect/disconnect
    DriveScreen.js           # now-playing, progress, queue, voice FAB
    SettingsScreen.js        # manage connections + queue source/refresh
  components/
    AuthSheet.js             # OAuth consent sheet (ask → working → done)
    VoiceSheet.js            # hands-free assistant sheet
    Press.js                 # press-to-scale wrapper
    FadeIn.js                # mount fade-up
    Equalizer.js             # animated now-playing bars
    Spinner.js               # connecting spinner
```

## Still simulated (next up for real integrations)

- Apple Music (MusicKit) and Audible connect flows — no public user OAuth
- Reading real listening history / library to build the cross-service queue
- The "why this plays" reasoning and the voice assistant intent matching
  (`voiceReply` in `src/data.js`)
