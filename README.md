# StorySound

**StorySound** is a cross-platform audiobook companion built with Expo. Import any PDF, EPUB, or TXT file — or pick from free public domain classics — and listen with 12 curated narrator styles. Runs on iOS, Android, and the web from a single TypeScript codebase.

## Tech Stack

- **Expo SDK 55** (TypeScript)
- **React 19** + **React Native 0.83** + **React Native Web**
- **expo-router** for file-based navigation
- **expo-speech** and **Web Speech API** for text-to-speech
- **expo-document-picker** for file import
- **pdfjs-dist** (web) and **epub.js** for document parsing
- **@react-native-async-storage/async-storage** for persistent library/settings
- **NativeWind** (Tailwind) for styling
- **@expo-google-fonts/lora** for reader typography
- **react-native-reanimated** for animations

## Getting Started

```bash
npm install
npx expo start           # native (scan QR with Expo Go)
npx expo start --web     # web
```

### NPM Scripts

| Script | Command |
|--------|---------|
| `npm start` | Start Expo dev server |
| `npm run web` | Start web dev server |
| `npm run ios` | Start with iOS simulator |
| `npm run android` | Start with Android emulator |
| `npm run lint` | Run ESLint |

## Features

- **Library** — Imported books with motivational reading quotes
- **Free Classics** — 10 curated Project Gutenberg titles, tap to listen
- **12 Narrator Profiles** — Storyteller, Classic Narrator, Dramatic Reader, Bedtime Reader, and more
- **Word-level highlighting** as each word is spoken
- **Adjustable speed** (0.5x–3.0x) and **pitch** control
- **Multi-format import** — PDF, EPUB, TXT (Kindle via Calibre conversion)
- **Dark, Audible-inspired UI** with onboarding flow
- **Settings** — Default voice, speed, theme, and font size

> **Note:** PDF text extraction works fully on web. On native (iOS/Android), PDF import shows a placeholder — use EPUB or TXT for best results on devices.

---

## Deploy to iPhone

Two paths to get StorySound on your physical iPhone:

### Option A: Quick Test with Expo Go (no Apple Developer account)

1. **Install Expo Go** on your iPhone from the App Store
2. Start the dev server: `npx expo start`
3. Ensure **iPhone and PC are on the same Wi‑Fi**
4. Open the Camera app and **scan the QR code** from the terminal
5. The app opens in Expo Go

> **Limitation:** Expo Go is a sandbox. Some native modules may behave differently than a standalone build.

### Option B: Standalone App with EAS Build (recommended)

Creates an `.ipa` that installs directly on your iPhone.

#### Prerequisites

- **Apple Developer Account** — Free Apple ID (device-only, 7-day expiry) or Paid ($99/year for App Store/TestFlight)
- **Expo account** — [expo.dev](https://expo.dev) (free)
- **EAS CLI** — `npx eas-cli --version` (18.x+)

#### Step-by-step

```bash
npx eas login
npx eas init
npx eas device:create    # Register your iPhone (one-time)
npx eas build --platform ios --profile development
```

Open the build link on your iPhone to install.

#### For App Store / TestFlight

```bash
npx eas build --platform ios --profile production
npx eas submit --platform ios
```

#### Troubleshooting

- **"No registered devices"** — Run `npx eas device:create` and register your iPhone's UDID
- **"Missing provisioning profile"** — EAS handles this; use the same Apple ID
- **Build fails** — Check `npx eas build:list` for logs
- **App doesn't open after install** — Settings → General → VPN & Device Management → trust the developer certificate

---

## Project Structure

```
app/
  _layout.tsx           # Root layout, fonts, BookProvider, onboarding check
  onboarding.tsx        # First-launch onboarding (3 slides)
  (tabs)/
    _layout.tsx        # Tab navigator (Library, Listen, Settings)
    index.tsx          # Library screen
    reader.tsx         # Reader with word highlighting
    settings.tsx       # Settings screen
components/
  BookCard.tsx         # Library book card
  NarratorPicker.tsx   # Narrator profile dropdown
  OnboardingSlide.tsx  # Reusable onboarding slide
  PlaybackBar.tsx      # Transport controls
  SpeedControl.tsx     # Speed presets
  VoiceSelector.tsx    # Raw voice picker
  WordHighlighter.tsx  # Word-level highlighting
contexts/
  BookContext.tsx      # Global book state, loadFromFile, loadFromText
data/
  freeBooks.ts         # 10 free classics + reading quotes
  narratorProfiles.ts  # 12 narrator presets
hooks/
  useBook.ts           # Book context re-export
  useLibrary.ts        # AsyncStorage library persistence
  useTTS.ts            # TTS with pitch/speed (expo-speech + Web Speech API)
utils/
  pdfParser.ts         # PDF extraction (web: pdfjs-dist)
  epubParser.ts        # EPUB extraction (epub.js)
  textChunker.ts       # Sentence splitting for highlighting
```
