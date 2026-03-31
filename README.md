# 🎮 Journey Through Deekshith — 3D Interactive Portfolio

A 3D RPG-style portfolio game built with Three.js + Next.js.

## What's Fixed in This Version
- ✅ **Groq API** (Llama 3.3 70B) — fast & free, replaces Anthropic
- ✅ **Bright, vibrant world** — sky blue, green grass, colourful buildings
- ✅ **Realistic human characters** — WCC3-style proportions, proper faces, no zombie look
- ✅ **All TypeScript errors fixed** — duplicate const, broken light declaration, AudioGain type
- ✅ **Bright dialogue portraits** — warm skin tones, clear eyes with highlights

## Quick Start

### Frontend (Next.js)
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local → add your GROQ_API_KEY from https://console.groq.com
npm run dev
```
Open http://localhost:3000

## GROQ API Key
1. Go to https://console.groq.com
2. Sign up (free)
3. Create an API key
4. Add to `frontend/.env.local`:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

## Controls
- **WASD / Arrow Keys** — Move
- **Mouse Drag** — Rotate camera
- **Scroll** — Zoom
- **E / Space / Enter** — Talk to NPC
- **Click dialogue** — Advance text

## Zones
1. HOMETOWN — Where it all began
2. THE ACADEMY — University years
3. TECH FOREST — Skills & tools
4. PROJECT RUINS — NirveonX & projects
5. INNER SANCTUM — Philosophy & drives
6. FUTURE PEAK — Vision & goals
7. AI NEXUS — MINNIE (live AI, powered by Groq)

## Adding Your Photo to the Title Screen
Place your photo as `frontend/public/deekshith.jpg` (or `.png`).
The title screen loads `/deekshith.jpg` — if not found, a illustrated avatar shows automatically.

Recommended: 190×220px or any portrait crop, face centered.
