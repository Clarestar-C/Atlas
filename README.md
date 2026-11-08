# Project Atlas — C1 Support & Navigation System

A calm, dark-mode PWA dashboard built with **React, Vite, Tailwind CSS v3, and lucide-react**. We built this for Alex—a 47-year-old high school biology teacher in Hamilton living with ALS. Atlas is designed to be practical, supportive daily-living tech rather than a heavy, overly complex medical device.

---

## Why "Atlas"?
We went with **Atlas** for two reasons:
1. **The C1 Vertebra (Anatomical):** The first cervical vertebra bears the weight of the head and allows nodding. It’s quiet, constant, load-bearing support. Atlas is meant to act the same way—carrying some of the cognitive and physical load so Alex doesn't have to do it all himself.
2. **A Cartographic Atlas (Navigation):** A book of maps. Atlas maps out Alex's day (from morning peak energy down to evening risk windows), maps safety hazards, and breaks down recipes into manageable, paced steps.

---

## How It Solves the Case
We based the app directly on the clinical realities of Alex’s daily life:

### 1. Limb-Onset ALS & 3/5 Right-Hand Grip Strength
Alex’s right hand has a 3/5 grip rating and tires quickly (he drops things like whiteboard markers or his phone). We designed around this constraint:
* Large touch targets (minimum ~56px) so things are easy to tap even with one hand or fatigued fingers.
* The Sunday dinner cooking companion defaults to clear physical positioning (*"left-hand stabilizing, right-hand guiding"*), pre-peeled ingredient logic, and slide-don't-lift tray handling.
* Safety rules that keep both hands free, because you can't hold items and use a handrail at the same time.

### 2. Late-Afternoon Bulbar Fatigue
By late afternoon, speech projection gets exhausting and difficult for students at the back of the classroom to hear. 
* We built the **Classroom Voice Bridge** tab. Alex can tap pre-set classroom phrases or type custom text, and the app speaks it out loud at classroom volume. 
* Under the hood, it hooks into the **ElevenLabs API** for natural-sounding neural voices, but we also wrote a local device-voice fallback (`window.speechSynthesis`) so nothing breaks if the Wi-Fi drops or API limits act up.

### 3. The 6 PM Fall Risk Window
Data from Alex's case shows that his falls happen after 6 PM due to a mix of fading dusk light, stair transitions, and cumulative physical fatigue.
* Atlas uses a time-of-day state engine. Once it hits 6 PM, the app automatically switches into an **Evening Fall Risk** mode (highlighted in rose).
* It pulls up safety reminders *before* he starts moving around: turning on stair lights early, using handrails, and keeping his phone secured so he doesn't drop it.

---

## Features & Tech Stack

| Tab / Section | What it does |
|---|---|
| **Overview / Safety** | Live clock, time-of-day phase badge, a visual timeline from 6 AM to 10 PM, pacing cards, and an interactive safety checklist. Includes a time simulator so you can test morning, afternoon, or evening modes manually. |
| **Voice** | Classroom Voice Bridge soundboard. Uses **ElevenLabs API** (with custom voice ID support and rate/pitch/volume sliders) or switches to the offline browser voice as a reliable backup. |
| **Dinner** | Traditional Sunday Roast recipe scaled for servings. Breaks cooking down into step-by-step cards with pacing tips, grip adaptations, and a mock/real Gemini API toggle for on-the-fly recipe guidance. |
| **Hardware Concept** | A lightweight, minimalist 3D-printed exoskeleton phone case designed with a lanyard/tether mount to completely eliminate drop risks without adding heavy weight to weakened fingers. |

---

## Hardware & 3D Print Concept
Since Alex deals with hand wasting and drops things easily, we designed a concept for a **lightweight 3D-printed bumper case** (<35g) featuring an integrated loop for a retractable lanyard or tether. 
* Kept low-infill (around 15-20%) so it adds zero bulk or wrist fatigue.
* Keeps his phone physically secured to his body, solving a major hazard point during school hours.

---

## Running It Locally

Make sure you have Node.js installed (Node 18+ recommended), then run these commands in your terminal:

```bash
npm install
npm run dev        # Starts the local dev server (usually http://localhost:5173)
npm run build      # Generates the production build in /dist
npm run preview    # Local preview of the production build
