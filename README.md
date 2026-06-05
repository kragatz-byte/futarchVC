# FutarchyVC

**CS 153 submission** — A mobile campus venture platform where **AI produces structured diligence**, **students forecast and decide**, and **reputation accumulates on a leaderboard**. Humans always make the final invest/pass call.

---

## What the app does

| Capability | Where to see it in the app |
|------------|----------------------------|
| **AI diligence** | Feed cards (AI score) → **View diligence** → startup detail accordion (memo, bull/bear, risks, score) |
| **Startup forecasting** | **Forecast** on feed or detail → probability sliders + optional reasoning per question |
| **Investment decisions** | **Invest** / **Pass** → conviction slider + optional reasoning (watchlist on detail) |
| **Leaderboards / reputation** | **Leaderboard** tab — forecasters, activity, campus rankings, badges |
| **Founder submission** | **Submit** tab → form → “Generating AI diligence…” → new startup in feed with full memo |

**Problem & insight:** Student investors see many campus startups but lack time for consistent diligence. FutarchyVC compresses research into an AI memo and forces explicit forecasts and decisions so judgment is recorded and comparable over time.

**Futarchy-style loop:** AI informs → users forecast outcomes → users invest or pass → aggregate signals and reputation update (local demo or Supabase when configured).

---

## How to run

### Recommended for grading / demo (no API keys)

```bash
npm install
cp .env.demo .env
npm run start:demo
```

Open in **Expo Go** (scan QR) or press `i` / `a` for iOS/Android simulators. The app skips auth and loads six sample startups with full diligence.

### With optional backend

```bash
cp .env.example .env
# Set EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY, OPENAI_API_KEY as needed
# Set EXPO_PUBLIC_DEMO_MODE=false for real auth/sync
npx expo start -c
```

Run database DDL from [`supabase/schema.sql`](supabase/schema.sql) if using Supabase.

| Variable | Purpose |
|----------|---------|
| `EXPO_PUBLIC_DEMO_MODE` | `true` = mock data + local storage only (reliable demo) |
| `EXPO_PUBLIC_SUPABASE_URL` | Optional cloud sync + auth |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (never service role in client) |
| `OPENAI_API_KEY` | Optional live diligence on founder submit |

---

## How AI is used

1. **Trigger:** Founder submits startup (Submit tab) or mock path in demo mode.
2. **Prompts:** `lib/diligencePrompts.ts` — system role is *analyst, not decider*; user template requests JSON fields + `ai_score` (0–100).
3. **Generation:** `services/generateDiligence.ts` calls OpenAI (`gpt-4o-mini`, JSON mode) when `OPENAI_API_KEY` is set; otherwise `generateDiligenceMock.ts`.
4. **Parsing:** `lib/parseDiligenceJson.ts` normalizes model output with fallbacks (no crash on malformed JSON).
5. **Display:** Diligence stored and shown on startup detail; score on feed cards via `AiScoreBadge`.

**Not automated:** Invest/pass, forecast probabilities, and leaderboard rank are **human-entered** (or seeded mock data); AI does not place investments.

---

## How Cursor and ChatGPT were used (process & disclosure)

| Tool | Role |
|------|------|
| **Cursor (Agent)** | Scaffolded Expo app, navigation, Supabase layer, UI components, demo mode, stability pass, README |
| **ChatGPT** | Early product framing, sample startup narratives, diligence prompt wording, copy edits |

**Author ownership:** Core product decisions (futarchy loop, screen map, data model), manual testing on device, and final review of all generated code. AI-assisted files were edited for consistency and correctness before submission.

**Integrity:** No fabricated user studies or live deployment metrics in this repo. Mock diligence is used when API keys are absent (`EXPO_PUBLIC_DEMO_MODE`).

---

## CS153 rubric mapping

| Criterion | Evidence in this project |
|-----------|---------------------------|
| **1. Problem & Insight** | README + feed mission line + `constants/copy.ts`; targets campus deal-flow + judgment gap |
| **2. Execution & Technical Work** | Expo/RN/TS app, optional Supabase, OpenAI pipeline, contexts for decisions/forecasts, `EXPO_PUBLIC_DEMO_MODE` |
| **3. Evaluation & Evidence** | Leaderboard + profile stats/activity; community % on cards updates after your actions in demo |
| **4. Communication & Presentation** | In-app capability pills, section headers, this README, demo script below |
| **5. Process, Integrity & Disclosure** | Profile disclosure line; AI/tooling section above; demo vs live behavior documented |

### ~3 minute demo script

1. **Feed** — capability pills, AI scores, community signals.  
2. **QuadLink (or any card)** — scroll **AI diligence** sections and score.  
3. **Invest** or **Pass** — conviction + toast; note feed stats can update.  
4. **Forecast** — select questions, set probabilities, submit.  
5. **Leaderboard** — forecasters + campus tabs.  
6. **Profile** — reputation, badges, merged activity.  
7. **Submit** — short founder form → loading → new startup detail with generated memo.

---

## Limitations

- **Demo mode** uses six seeded startups and mock diligence; no live market or outcome resolution yet.  
- **Forecasts** are stored but not scored against real outcomes (accuracy is placeholder on leaderboard).  
- **OpenAI key in client** is for prototyping only; production should proxy via a backend.  
- **Pitch deck / logo upload** UI is placeholder only.  
- **Supabase RLS** must be hardened before any public deployment.  
- **Single-campus mock** leaderboard data; not validated with a user study in this submission.

---

## Future work

- Resolve forecasts against real startup outcomes and update reputation algorithmically.  
- Backend proxy for OpenAI + file storage for decks/logos.  
- Admin review queue for founder submissions (`pending` → `analyzed` in schema).  
- Cross-campus leaderboards with verified `.edu` auth.  
- Export diligence PDF and investor discussion threads per startup.

---

## Project structure

| Path | Purpose |
|------|---------|
| `app/` | Expo Router: Feed, Submit, Leaderboard, Profile, startup detail, auth |
| `components/` | UI, modals (`ForecastModal`, `InvestmentDecisionModal`), `ProductCapabilities` |
| `constants/copy.ts` | Product + CS153-facing copy |
| `lib/diligencePrompts.ts` | Exact OpenAI prompts |
| `services/generateDiligence.ts` | AI + mock diligence pipeline |
| `services/startupRegistry.ts` | Merge mock, local submissions, optional Supabase |
| `contexts/` | Auth, investment decisions, forecasts |
| `services/mock/` | Demo startups, diligence, leaderboard, profile |
| `supabase/schema.sql` | Optional Postgres schema |

---

## Scripts & troubleshooting

| Command | Description |
|---------|-------------|
| `npm run start:demo` | Demo mode + clear Metro cache |
| `npm start` | Standard Expo dev server |

| Issue | Fix |
|-------|-----|
| Stuck on auth | `EXPO_PUBLIC_DEMO_MODE=true` in `.env`, restart with `-c` |
| Blank feed | `npm install` + `npm run start:demo` or `npx expo start -c` |

---

## Tech stack

Expo ~56 · React Native 0.85 · TypeScript (strict) · Expo Router · AsyncStorage · optional Supabase JS · optional OpenAI API
