export type Exercise = {
  id: string;
  name: string;
  prescription: string;
  restSeconds?: number;
  cue: string;
  optional?: boolean;
  demoUrl?: string;
  startsAfter?: string;
  endsOn?: string;
  week4Prescription?: string;
  omitInWeek4?: boolean;
};

export type WorkoutDay = {
  day: number;
  title: string;
  eyebrow: string;
  duration: string;
  intensity: string;
  summary: string;
  strengthDay: boolean;
  exercises: Exercise[];
};

export const scheduleVersion = 4;

export const planRules = {
  progression:
    "Keep the variation, band, load, attachment, and setup consistent. Progress only when every working set reaches the top of its range with stable technique and the target effort in two comparable sessions. Both sides must qualify; change one variable, then return to the lower end of the range.",
  safety:
    "Stop or regress an exercise for sharp, escalating, radiating, unstable, or joint-specific pain, or when you cannot maintain the prescribed position. Omit it rather than adding replacement sets. Persistent symptoms, trauma, neurologic symptoms, chest pain, or fainting require qualified assessment.",
  moderateAerobic:
    "Count a segment as moderate when effort is about 5–6/10 and you can talk but not sing. A genuinely light recovery walk is useful but does not count toward the moderate-minute total.",
};

export const workoutDays: WorkoutDay[] = [
  {
    day: 1,
    title: "Strength A",
    eyebrow: "Pull · push · legs",
    duration: "55–65 min",
    intensity: "Leave 2 reps in reserve",
    summary:
      "Every major movement pattern, with clean assisted pull-up volume and enough recovery to improve.",
    strengthDay: true,
    exercises: [
      {
        id: "a-warmup",
        name: "Movement warm-up",
        prescription: "6 min",
        cue: "Walk, shoulder circles, 6 scapular pulls, 8 scapular push-ups, 10 squats.",
      },
      {
        id: "a-pullup",
        name: "Band-assisted pull-up",
        prescription: "3 × 4–8",
        restSeconds: 120,
        cue: "Use one inspected band and the same setup for every set. Log the band, reps, and final-set RIR; stop with about 2 good reps left.",
        demoUrl: "https://www.youtube.com/watch?v=aNUSgyWRJYA",
        week4Prescription: "2 × 4–8",
      },
      {
        id: "a-pushup",
        name: "Push-up",
        prescription: "3 × 8–15",
        restSeconds: 90,
        cue: "Keep ribs controlled and move chest and hips together. Elevate hands if needed.",
        week4Prescription: "2 × 8–15",
      },
      {
        id: "a-split-squat",
        name: "Bulgarian split squat",
        prescription: "3 × 8–12 / side",
        restSeconds: 90,
        cue: "Left plus right equals one set; rest 90 seconds after both sides and alternate the starting side. Use stable support.",
        demoUrl: "https://www.youtube.com/watch?v=-4LVK1crLSw",
        week4Prescription: "2 × 8–12 / side",
      },
      {
        id: "a-hinge",
        name: "Band Romanian deadlift",
        prescription: "3 × 10–15",
        restSeconds: 90,
        cue: "Added after your first-session review to cover the missing hip hinge. Start on your next Day 1; push the hips back with a neutral trunk and keep about 2 reps in reserve.",
        startsAfter: "2026-07-27",
        week4Prescription: "2 × 10–15",
      },
      {
        id: "a-row",
        name: "Resistance-band row",
        prescription: "2 × 10–15",
        restSeconds: 75,
        cue: "Anchor the band securely. Pause briefly with shoulder blades drawn back.",
        demoUrl: "https://www.youtube.com/watch?v=LSkyinhmA8k",
      },
      {
        id: "a-core",
        name: "Plank or hollow hold",
        prescription: "2 × 20–40 sec",
        restSeconds: 60,
        cue: "Choose plank or hollow hold once and keep that variation for the block. End before trunk position changes.",
        endsOn: "2026-07-29",
      },
      {
        id: "a-reverse-crunch",
        name: "Reverse crunch",
        prescription: "2 × 10–15",
        restSeconds: 60,
        cue: "Curl the pelvis toward the ribs without swinging. Stop before the lower back loses control.",
        startsAfter: "2026-07-29",
      },
      {
        id: "a-lateral-raise",
        name: "Band lateral raise",
        prescription: "2 × 12–20",
        restSeconds: 60,
        cue: "Use light tension, raise with control to about shoulder height, and keep 2–3 reps in reserve.",
        startsAfter: "2026-07-29",
      },
      {
        id: "a-walk",
        name: "Brisk cooldown walk",
        prescription: "10 min",
        cue: "If counting it as moderate: about 5–6/10 effort, able to talk but not sing. Otherwise keep it light for recovery.",
      },
    ],
  },
  {
    day: 2,
    title: "Aerobic base",
    eyebrow: "Walk / jog · mobility",
    duration: "50–55 min",
    intensity: "Easy to moderate",
    summary:
      "Build the weekly aerobic target without compromising the next strength session.",
    strengthDay: false,
    exercises: [
      {
        id: "b-cardio",
        name: "Brisk walk or easy jog/walk",
        prescription: "40 min",
        cue: "Aim for about 5–6/10 effort: able to talk but not sing. Log time, distance or pace, and the talk test.",
      },
      {
        id: "b-hip",
        name: "Hip-flexor mobility",
        prescription: "2 × 45 sec / side",
        cue: "Use a gentle stretch, not a forced end range.",
      },
      {
        id: "b-chest",
        name: "Chest and shoulder mobility",
        prescription: "2 × 45 sec",
        cue: "Move slowly and stay below painful range.",
      },
      {
        id: "b-external-rotation",
        name: "No-anchor band external rotation",
        prescription: "2 × 12–20",
        restSeconds: 60,
        cue: "Keep elbows near your sides and use a small pain-free range with light tension. This is controlled shoulder work, not a max effort.",
        startsAfter: "2026-07-29",
      },
      {
        id: "b-hang",
        name: "Relaxed dead hang",
        prescription: "2 × 15–30 sec",
        restSeconds: 90,
        cue: "Optional. Finish with clear grip reserve; skip if Monday recovery is incomplete or it may compromise Wednesday.",
        optional: true,
        demoUrl: "https://www.youtube.com/watch?v=dOCQjaasbGs",
        omitInWeek4: true,
      },
    ],
  },
  {
    day: 3,
    title: "Strength B",
    eyebrow: "Pull · shoulders · posterior chain",
    duration: "50–60 min",
    intensity: "Leave 2 reps in reserve",
    summary:
      "A second balanced strength exposure with a different push and leg emphasis.",
    strengthDay: true,
    exercises: [
      {
        id: "c-warmup",
        name: "Movement warm-up",
        prescription: "6 min",
        cue: "Walk, shoulder circles, 6 scapular pulls, 8 scapular push-ups, 10 squats.",
      },
      {
        id: "c-pullup",
        name: "Band-assisted pull-up",
        prescription: "3 × 4–8",
        restSeconds: 120,
        cue: "Match Day 1 band and setup. Log every set and final-set RIR; do not reduce assistance mid-session to chase reps.",
        demoUrl: "https://www.youtube.com/watch?v=aNUSgyWRJYA",
        week4Prescription: "2 × 4–8",
      },
      {
        id: "c-pike",
        name: "Pike push-up",
        prescription: "3 × 5–10",
        restSeconds: 90,
        cue: "Elevate the hands or reduce the pike angle if head-and-shoulder control is poor.",
        week4Prescription: "2 × 5–10",
      },
      {
        id: "c-squat",
        name: "Squat or backpack squat",
        prescription: "3 × 12–20",
        restSeconds: 90,
        cue: "Choose one repeatable variation. Use bodyweight unless a securely loadable backpack is confirmed.",
        week4Prescription: "2 × 12–20",
      },
      {
        id: "c-bridge",
        name: "Glute bridge",
        prescription: "3 × 12–20",
        restSeconds: 75,
        cue: "Finish with the hips, not by arching the lower back.",
        week4Prescription: "2 × 12–20",
        endsOn: "2026-07-29",
      },
      {
        id: "c-hamstring-curl",
        name: "Standing band hamstring curl",
        prescription: "2 × 10–15 / side",
        restSeconds: 60,
        cue: "Use an inspected band and secure low anchor. Left plus right equals one set; keep the hips still and stop if the band or anchor can slip.",
        startsAfter: "2026-07-29",
      },
      {
        id: "c-face-pull",
        name: "Band pull-apart",
        prescription: "2 × 12–20",
        restSeconds: 60,
        cue: "Use an inspected band below face level at 2–3 RIR. Use a wider grip or less stretch to regress; omit it if tension cannot be scaled safely.",
      },
      {
        id: "c-side-plank",
        name: "Side plank",
        prescription: "2 × 20–40 sec / side",
        restSeconds: 60,
        cue: "Left plus right equals one set; rest 60 seconds after both sides. Shorten the lever if the hips cannot stay stacked.",
      },
      {
        id: "c-curl",
        name: "Band curl",
        prescription: "2 × 8–15",
        restSeconds: 60,
        cue: "Keep the upper arms still and use the same band and setup. Finish with about 2 reps in reserve.",
        startsAfter: "2026-07-29",
      },
      {
        id: "c-walk",
        name: "Brisk cooldown walk",
        prescription: "10 min",
        cue: "If counting it as moderate: about 5–6/10 effort, able to talk but not sing. This is not an interval workout.",
      },
    ],
  },
  {
    day: 4,
    title: "Recovery",
    eyebrow: "Walk · reset",
    duration: "35–40 min",
    intensity: "Easy",
    summary:
      "A genuine low-load day between strength sessions. Recovery is part of the program.",
    strengthDay: false,
    exercises: [
      {
        id: "d-walk",
        name: "Brisk walk",
        prescription: "30 min",
        cue: "Keep this genuinely light and comfortable enough to feel better afterward; do not count it as moderate minutes.",
      },
      {
        id: "d-mobility",
        name: "Easy mobility flow",
        prescription: "5–8 min",
        cue: "Choose hips, ankles, chest, and shoulders. No aggressive stretching.",
      },
      {
        id: "d-breath",
        name: "Slow breathing reset",
        prescription: "2 min",
        cue: "Long, relaxed exhales. Finish the session calmer than you started.",
      },
    ],
  },
  {
    day: 5,
    title: "Strength C",
    eyebrow: "Full body · pull-up skill",
    duration: "50–65 min",
    intensity: "Clean practice, not a test",
    summary:
      "The third strength exposure keeps weekly volume productive without turning Friday into a max-out.",
    strengthDay: true,
    exercises: [
      {
        id: "e-warmup",
        name: "Movement warm-up",
        prescription: "6 min",
        cue: "Walk, shoulder circles, 6 scapular pulls, 8 scapular push-ups, 10 squats.",
      },
      {
        id: "e-pullup",
        name: "Band-assisted pull-up",
        prescription: "3 × 4–8",
        restSeconds: 120,
        cue: "Keep two reps in reserve. Use the same band and setup for all sets; log every set and final-set RIR.",
        demoUrl: "https://www.youtube.com/watch?v=aNUSgyWRJYA",
        week4Prescription: "2 × 4–8",
      },
      {
        id: "e-negative",
        name: "Controlled negative pull-up",
        prescription: "2 × 2 at 3–5 sec",
        restSeconds: 120,
        cue: "Optional and gated: only if you can control the full descent without shoulder, elbow, or forearm pain.",
        optional: true,
        omitInWeek4: true,
      },
      {
        id: "e-pushup",
        name: "Push-up",
        prescription: "3 × 8–15",
        restSeconds: 90,
        cue: "Use a repeatable variation. No need to train to failure.",
        week4Prescription: "2 × 8–15",
        endsOn: "2026-07-29",
      },
      {
        id: "e-dip",
        name: "Assisted parallel-bar dip",
        prescription: "3 × 5–10",
        restSeconds: 120,
        cue: "Use band or foot assistance as needed to keep 2–3 reps in reserve. Use stable bars, controlled depth, and stop for shoulder or sternum pain.",
        startsAfter: "2026-07-29",
        week4Prescription: "2 × 5–10",
      },
      {
        id: "e-split-squat",
        name: "Bulgarian split squat",
        prescription: "3 × 8–12 / side",
        restSeconds: 90,
        cue: "Left plus right equals one set; rest 90 seconds after both sides and alternate the starting side. Add only verified secure load.",
        demoUrl: "https://www.youtube.com/watch?v=-4LVK1crLSw",
        week4Prescription: "2 × 8–12 / side",
      },
      {
        id: "e-row",
        name: "Resistance-band row",
        prescription: "2 × 10–15",
        restSeconds: 75,
        cue: "Use a secure anchor and a controlled return.",
        demoUrl: "https://www.youtube.com/watch?v=LSkyinhmA8k",
      },
      {
        id: "e-calf",
        name: "Calf raise",
        prescription: "2 × 15–25",
        restSeconds: 60,
        cue: "Use support for balance and pause briefly at the top.",
      },
      {
        id: "e-tibialis",
        name: "Wall tibialis raise",
        prescription: "2 × 15–25",
        restSeconds: 60,
        cue: "Keep heels down, lift the forefoot under control, and avoid rocking.",
        startsAfter: "2026-07-29",
      },
      {
        id: "e-core",
        name: "Hollow hold",
        prescription: "2 × 20–40 sec",
        restSeconds: 60,
        cue: "Bend the knees or keep the arms by your sides to preserve position.",
      },
      {
        id: "e-walk",
        name: "Brisk cooldown walk",
        prescription: "10 min",
        cue: "If counting it as moderate: about 5–6/10 effort, able to talk but not sing. Otherwise keep it light.",
      },
    ],
  },
  {
    day: 6,
    title: "Long easy cardio",
    eyebrow: "Aerobic base · balance",
    duration: "60–70 min",
    intensity: "Easy to moderate",
    summary:
      "Complete the aerobic target with low-skill work that should not leave you depleted.",
    strengthDay: false,
    exercises: [
      {
        id: "f-cardio",
        name: "Brisk walk",
        prescription: "50 min",
        cue: "Aim for about 5–6/10 effort, able to talk but not sing, and log pace or distance. Jog/walk only if already adapted.",
      },
      {
        id: "f-balance",
        name: "Single-leg balance",
        prescription: "2 × 30 sec / side",
        cue: "Keep a wall or stable support within reach.",
      },
      {
        id: "f-lateral-walk",
        name: "Band lateral walk",
        prescription: "2 × 10–15 steps / side",
        restSeconds: 60,
        cue: "Use light tension and controlled steps with knees tracking over the feet. Stop well before fatigue changes your gait.",
        startsAfter: "2026-07-29",
      },
      {
        id: "f-mobility",
        name: "Comfortable mobility",
        prescription: "5–8 min",
        cue: "Focus on whatever feels restricted after the week.",
      },
    ],
  },
  {
    day: 7,
    title: "Full rest",
    eyebrow: "Recover · review",
    duration: "No session required",
    intensity: "Rest",
    summary:
      "No catch-up workout. Normal daily movement is enough; review the week and begin fresh tomorrow.",
    strengthDay: false,
    exercises: [
      {
        id: "g-rest",
        name: "Rest from planned training",
        prescription: "All day",
        cue: "A casual walk is fine, but it is not a requirement and does not need to be intense.",
      },
      {
        id: "g-review",
        name: "Two-minute weekly review",
        prescription: "Optional",
        cue: "Note pain, energy, and which band you used before the next week begins.",
        optional: true,
      },
    ],
  },
];

export const weekGuidance = [
  {
    week: 1,
    label: "Baseline",
    guidance: "Learn the movements, choose the right band, and finish most sets with 2–3 reps in reserve.",
  },
  {
    week: 2,
    label: "Add reps",
    guidance: "Add one rep to a set where form and recovery allow. Keep the same assistance.",
  },
  {
    week: 3,
    label: "Progress",
    guidance: "Progress only after every set reaches the top of its range at the target effort in two comparable sessions; both sides must qualify.",
  },
  {
    week: 4,
    label: "Consolidate",
    guidance: "The listed 3-set main exercises become 2 sets, optional hangs and negatives are omitted, and strength work finishes near 3 RIR. Keep 2-set accessories unchanged and do not max out.",
  },
];
