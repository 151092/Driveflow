# Driveflow

One sign-in. Every drive, scored.

Driveflow connects the audio services you already pay for (Spotify, Apple Music,
Audible — with Podcasts and Live Radio coming soon), reads across all of them,
and curates the road ahead. Hands on the wheel, voice in control.

This repo is the **React Native (Expo)** app, ported from the original web
prototype. It's currently a high-fidelity interactive demo: integrations use a
mock OAuth flow and the queue/voice assistant run on sample data.

## Stack

- **Expo** SDK 56 / React Native 0.85 / React 19
- `expo-linear-gradient` — brand gradients
- `lucide-react-native` + `react-native-svg` — icons
- `@expo-google-fonts/sora` + `@expo-google-fonts/space-mono` — type
- Core `Animated` API — equalizer bars, OAuth spinner, voice-orb pulse, fades

## Running

```bash
npm install
npm start        # then press i / a, or scan the QR with Expo Go
npm run ios      # iOS simulator (macOS)
npm run android  # Android emulator
```

## Structure

```
App.js                       # state machine: intro → link → drive, + sheets
src/
  data.js                    # services, queue, voice replies, helpers
  theme.js                   # colors, fonts, gradient + shadow tokens
  screens/
    IntroScreen.js           # value prop + "Connect my accounts"
    LinkScreen.js            # service list + connect state
    DriveScreen.js           # now-playing, progress, queue, voice FAB
  components/
    AuthSheet.js             # mock OAuth bottom sheet (ask → working → done)
    VoiceSheet.js            # hands-free assistant sheet
    Press.js                 # press-to-scale wrapper
    FadeIn.js                # mount fade-up
    Equalizer.js             # animated now-playing bars
    Spinner.js               # connecting spinner
```

## What's mocked (next up for real integrations)

- OAuth authorize flow per service (`AuthSheet`)
- The cross-service queue and "why this plays" reasoning
- The voice assistant intent matching (`voiceReply` in `src/data.js`)
