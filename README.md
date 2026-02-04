# Bend MVP (Expo + React Native + TypeScript)

A runnable MVP mobile app inspired by Bend for stretching/posture/mobility/stability/balance.

## What is implemented

- Onboarding with first-launch safety disclaimer and goal selection
- Local persistence via Zustand + AsyncStorage
- Seeded exercise library (~50 exercises) with categories:
  - Mobility, Posture, Stability, Balance, Warmup, Cooldown
- Library search, category filter, favorites toggle
- Workout builder:
  - Create/edit workout
  - Add exercises from library
  - Custom duration and rest per exercise
  - Drag-and-drop reorder
  - Save, duplicate, delete
- Workout player:
  - Full-screen focused mode
  - Exercise media (Lottie/video), current + upcoming exercise
  - Accurate timer using absolute end timestamps (`Date.now`) to avoid drift
  - Handles app background/foreground state
  - Cues at start, 3-2-1, segment end, and transitions (sound + haptics)
  - Controls: previous, pause/resume, skip, +10s
- Premium flow:
  - Paywall stub
  - Premium gate for "Type Any Name -> Cartoon Animation"
- AI/media generation MVP behavior via `ExerciseMediaGenerator`:
  - Fuzzy match against existing exercises first
  - Fallback "LLM stub" returns structured exercise data + pose sequence
  - Template cartoon media (Lottie URL chosen by inferred category)
  - Saves generated result as a custom exercise in local DB/store

## Architecture

```
/src
  /screens
  /components
  /data
  /storage
  /services
  /utils
  /navigation
  /types
```

- State: `src/storage/appStore.ts` (single source of truth + persistence)
- Domain models: `src/types/models.ts`
- Seed data: `src/data/seedExercises.ts`
- Media generation service: `src/services/exerciseMediaGenerator.ts`
- Monetization stub: `src/services/purchaseService.ts`
- Cue service (sound/haptics): `src/services/cueService.ts`

## Install and run

1. Install dependencies:

```bash
npm install
```

2. Start Expo:

```bash
npm run start
```

3. Run on iOS:

```bash
npm run ios
```

4. Run on Android:

```bash
npm run android
```

## RevenueCat integration point (optional)

Current app includes a working premium stub.

- Add your key as env var:
  - `EXPO_PUBLIC_REVENUECAT_API_KEY=...`
- File to implement real setup/purchase flow:
  - `src/services/purchaseService.ts`

Current code keeps MVP runnable with no paid APIs.

## Real AI media generation integration point

Current app uses a local LLM/media stub by design.

- File to replace with real generation pipeline:
  - `src/services/exerciseMediaGenerator.ts`
- TODOs already marked in code for:
  - Replacing `llmStub` with actual LLM/API function call
  - Replacing template Lottie selection with real text-to-video or text-to-lottie output

## Notes

- Premium can be toggled in Settings for development.
- Seed data auto-loads on first hydrated launch.
- Generated custom exercises are persisted and appear in the library.
