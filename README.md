# Atlas | C1 Support & Navigation System

A calm, clinical, dark-mode PWA dashboard built with **React + Vite + Tailwind CSS v3 + lucide-react** for Alex — a teacher living with ALS. Atlas is supportive daily-living technology, not a medical device.

**Live concept:** A single-page dashboard with three tabs — **Overview / Safety**, **Voice**, and **Dinner** — that adapts its colour, urgency, and guidance to the time of day.

---

## Clinical Grounding

Atlas is designed around patterns in Alex's case, translated respectfully into software:

### ALS — limb-onset
Alex's ALS presented with limb onset. In this build the most concrete marker is **reduced right-hand grip, graded 3/5**: the right hand can guide and stabilise, but should not be relied on for carrying, heavy lifting, or sustained grip. Throughout Atlas this becomes practical design:

- Large touch targets (minimum ~56px checklist rows, large phrase buttons) usable one-handed.
- Dinner steps that default to **left-hand stabilising, right-hand guiding**, pre-cut / pre-peeled ingredients, lightweight and wide-handled utensils, electric carving options, and "slide, don't lift" tray handling.
- Safety rules that keep both hands free — because a hand used to carry cannot be used for a handrail.

### Bulbar fatigue — late afternoon
Bulbar muscles affect speech and swallowing, and fatigue accumulates through the day. By late afternoon, speech can become slurred or quieter and projecting across a classroom costs disproportionate energy, with slower recovery.

The **Classroom Voice Bridge** addresses this directly: high-contrast preset phrases ("Please open your textbooks", "Let's review", …) spoken via `window.speechSynthesis` at adjustable rate / pitch / volume, plus a custom text box. Tapping replaces projecting — conserving voice for the moments that need Alex's real voice.

### The 6 PM fall pattern — dusk + stairs + fatigue
Falls risk is not evenly spread across the day. Around **6 PM three factors converge**:

1. **Dusk / low light** — visual contrast drops, especially on stairs.
2. **End-of-day fatigue** — leg and core strength are at their daily lowest after a full day of compensating.
3. **Transition behaviour** — arriving home, carrying bags, cooking, moving between floors.

Atlas makes **post-6 PM an explicit hazard window**: the phase engine switches to *Evening Fall Risk* (rose), a prominent alert banner appears, the day timeline highlights the 6–10 PM zone in rose, and the safety checklist is foregrounded:

- Do not carry items on stairs
- Use handrail both ways
- Turn on stair lights **before** dusk
- Sit to rest if fatigued
- Keep phone in pocket, hands free

The point is timing: the safe behaviour is cued *before* the risky trip, not after.

### Time-of-day pacing
- **Morning Peak (emerald, ~5 AM–12 PM):** highest strength and clarity — schedule demanding tasks.
- **Afternoon Pacing (amber, 12–6 PM):** energy tapering, bulbar fatigue rising — lighter tasks, frequent breaks, use the Voice Bridge.
- **Evening Fall Risk (rose, 6 PM–5 AM):** hazard window — essential movement only, lights first, hands free.

A *Simulate time* selector (Auto / Morning / Afternoon / Evening) in the header lets Alex, family, or clinicians preview each state at any hour.

### The C1 Atlas metaphor — two meanings, one name

1. **Anatomical — the C1 vertebra ("Atlas"):** The first cervical vertebra, named for the Titan Atlas who bore the heavens. C1 bears the weight of the head and enables nodding — quiet, constant, load-bearing support at the very top of the spine. Atlas (this app) aims for the same role: structural support that is always there, so Alex doesn't have to carry everything himself.
2. **Cartographic — an atlas of maps:** A book of maps for navigation. Atlas maps the day (6 AM–10 PM timeline), maps risk (the rose hazard zone), and maps a recipe into paced steps — navigation to prevent falls and conserve energy, not just information display.

---

## Features

| Tab | What it does |
|---|---|
| **Overview / Safety** | Phase-aware header with live clock, cartographic day timeline with current marker, pacing cards (energy, movement, grip 3/5), interactive safety checklist with progress |
| **Voice** | 8 preset classroom phrases via Speech Synthesis, custom TTS input, rate / pitch / volume sliders, Stop, speaking indicator |
| **Dinner** | Traditional Sunday Roast — servings scaler (ingredients rescale), large-print step cards with Previous/Next + progress dots, per-step pacing tip & grip adaptation, mock Gemini generator (loading state → adaptive tips) and a Real-API toggle (key input + placeholder note, **no network call**) |

Design: **Calm Clinical Dark Mode** — `slate-950` background, frosted-glass cards (`bg-slate-900/80 backdrop-blur border-slate-800`), emerald / amber / rose phase accents, mobile-first, smooth transitions.

---

## Run It

```bash
npm install
npm run dev       # local dev (Vite prints the URL, usually http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build
```

Requires Node 18+ (Node 20+ recommended).

## PWA Install

Atlas is installable as a Progressive Web App:

- `public/manifest.webmanifest` — name, theme (`#020617`), standalone display, icon.
- `public/sw.js` — simple cache-first service worker for core assets; registered manually in `src/main.jsx` (no extra plugin).
- `public/icon.svg` — app icon.

**Install:** Serve the built app over HTTPS (or localhost) → open in Chrome / Edge / Safari → "Install Atlas" / "Add to Home Screen". It then launches standalone, full-screen, and works from cache offline for core pages. Speech synthesis availability varies by browser/OS and voice pack.

> Note: service workers do not run in some in-browser preview iframes — install behaviour should be checked from a real `npm run preview` / deployed URL.

---

## File Structure

```
atlas/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js
│   └── icon.svg
└── src/
    ├── main.jsx                  # entry + service-worker registration
    ├── App.jsx                   # phase state, tab wiring
    ├── index.css                 # Tailwind directives + glass utilities
    ├── utils/
    │   └── timeEngine.js         # getPhase(hour), phase override, time formatting
    ├── data/
    │   └── content.js            # safety checklist, classroom phrases, recipe, mock Gemini tips
    └── components/
        ├── Header.jsx            # title, live clock, phase badge, simulate-time selector
        ├── Timeline.jsx          # 6 AM–10 PM visual day map, hazard zone, current marker
        ├── SafetyMonitor.jsx     # evening alert banner, pacing cards, checklist
        ├── VoiceBridge.jsx       # speech soundboard + custom TTS + sliders
        ├── DinnerCompanion.jsx   # servings scaler, step cards, Gemini mock/real toggle
        └── TabNav.jsx            # top tabs (desktop) / bottom nav (mobile)
```

## Privacy & Safety Notes

- No data leaves the device in this build. The "Real API" toggle makes **no network call**; a production Gemini integration should proxy through your own server so API keys are never shipped in browser code.
- Atlas supports daily pacing and communication — it does not diagnose, predict falls, or replace clinical, physiotherapy, or occupational-therapy guidance.

---

Built for Alex — with the aim that good support, like C1, is felt mostly in how much lighter everything else becomes.
