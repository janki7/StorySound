# StorySound — Demo Script & Flow

A rough script and flow for showing the app in action and explaining what it does.

---

## Opening (30 sec)

> **"StorySound is a cross-platform audiobook companion. You can import your own books — PDF, EPUB, or TXT — or pick from free public domain classics, and listen with 12 curated narrator styles. It runs on iOS, Android, and the web from one codebase."**

**Start the app:**
```bash
npx expo start --web    # for web demo
# or
npx expo start          # for mobile (scan QR with Expo Go)
```

---

## Flow 1: First Launch — Onboarding (1 min)

**What to show:** First-time user experience.

1. If first launch, you’ll see the **3-slide onboarding**.
2. **Slide 1 — Import any book:** "You can listen to PDF, EPUB, or plain text. Kindle users can convert with Calibre."
3. **Slide 2 — Choose your voice:** "Pick from system voices, adjust speed, and customize the experience."
4. **Slide 3 — Press play:** "Relax while StorySound reads aloud and highlights each word."
5. Swipe or tap **Next** through all slides, then **Get Started**.

**Talking point:** "We keep onboarding short so users can start listening quickly."

---

## Flow 2: Library — Free Classics (2 min)

**What to show:** Instant listening with no import.

1. On the **Library** tab, scroll to **Free Classics**.
2. Point out: "10 curated Project Gutenberg titles — tap to listen instantly, no download."
3. Tap **Alice's Adventures in Wonderland** (or any classic).
4. App loads the book and opens the **Reader** screen.

**Talking point:** "We lower the barrier to entry — anyone can try the app without importing files."

---

## Flow 3: Reader — Playback & Word Highlighting (2–3 min)

**What to show:** Core listening experience.

1. On the Reader screen, tap **Play**.
2. **Word-level highlighting:** "Each word is highlighted as it’s spoken — great for following along."
3. **Narrator picker:** Open the narrator dropdown and show profiles:
   - "12 narrator styles — Storyteller, Classic Narrator, Dramatic Reader, Bedtime Reader, and more."
   - Switch to **Bedtime Reader** or **Dramatic Reader** to show the difference.
4. **Speed control:** Show 0.5x–3.0x presets; pick 1.25x or 1.5x.
5. **Pause / Resume** to show controls.
6. **Font size:** Tap the **A** button to cycle small / medium / large.

**Talking point:** "Audible-inspired UI with word-level sync and customizable voices."

---

## Flow 4: Import Your Own Book (1–2 min)

**What to show:** Multi-format import.

1. Go back to **Library** (back button or tab).
2. Tap the **+** button (or **Import a Book** if library is empty).
3. Pick a **PDF**, **EPUB**, or **TXT** file from your device.
4. Book loads and opens in the Reader.
5. Point out: "PDF works best on web. On native, EPUB and TXT are recommended."

**Talking point:** "Your books, your library — PDF, EPUB, TXT, and Kindle via Calibre conversion."

---

## Flow 5: Settings (1 min)

**What to show:** Personalization.

1. Open the **Settings** tab.
2. **Theme:** Light / Dark / System.
3. **Font size:** S / M / L.
4. **Default speed:** 0.5x–3.0x.
5. Mention: "Calibre link for Kindle users who want to convert to EPUB."

**Talking point:** "Settings persist across sessions so preferences stick."

---

## Flow 6: Cross-Platform (30 sec)

**What to show:** Same app, multiple platforms.

- **Web:** `npx expo start --web` — runs in the browser.
- **Mobile:** `npx expo start` — scan QR with Expo Go on iOS/Android.
- **Same codebase:** "One TypeScript codebase for web, iOS, and Android."

---

## Quick Reference — Key Features to Mention

| Feature | One-liner |
|--------|-----------|
| **Library** | Imported books + motivational reading quotes |
| **Free Classics** | 10 Project Gutenberg titles, tap to listen |
| **12 Narrators** | Storyteller, Classic, Dramatic, Bedtime, etc. |
| **Word highlighting** | Syncs with speech for follow-along |
| **Speed & pitch** | 0.5x–3.0x speed, adjustable pitch |
| **Formats** | PDF, EPUB, TXT (Kindle via Calibre) |
| **Themes** | Light, dark, system |
| **Onboarding** | 3-slide first-launch intro |

---

## Suggested Demo Order (5–7 min total)

1. **Onboarding** (if first launch) — 1 min  
2. **Free Classic** → Reader → Play → Narrator → Speed — 2–3 min  
3. **Import** (optional) — 1 min  
4. **Settings** — 1 min  
5. **Cross-platform** — 30 sec  

---

## Troubleshooting Notes

- **Web:** Use Chrome or Edge for best TTS support.
- **PDF on native:** Placeholder on iOS/Android; prefer EPUB or TXT.
- **Free books:** Requires network; uses a proxy for Project Gutenberg.
- **First run:** Clear AsyncStorage or reinstall to see onboarding again.
