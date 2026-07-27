export type Exercise = {
  id: string;
  name: string;
  prescription: string;
  restSeconds?: number;
  cue: string;
  optional?: boolean;
  demoUrl?: string;
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

export const workoutDays: WorkoutDay[] = [
  {
    day: 1,
    title: "Strength A",
    eyebrow: "Pull · push · legs",
    duration: "45–55 min",
    intensity: "Leave 2 reps in reserve",
    summary:
      "Full-body work with clean assisted pull-up volume and enough recovery to improve.",
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
        cue: "Use enough assistance for smooth full-range reps. Stop with about 2 good reps left.",
        demoUrl: "https://www.youtube.com/watch?v=aNUSgyWRJYA",
      },
      {
        id: "a-pushup",
        name: "Push-up",
        prescription: "3 × 8–15",
        restSeconds: 90,
        cue: "Keep ribs controlled and move chest and hips together. Elevate hands if needed.",
      },
      {
        id: "a-split-squat",
        name: "Bulgarian split squat",
        prescription: "3 × 8–12 / side",
        restSeconds: 90,
        cue: "Use a stable rear-foot support. Keep the front foot fully planted.",
        demoUrl: "https://www.youtube.com/watch?v=-4LVK1crLSw",
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
        cue: "Choose the variation you can hold without losing trunk position.",
      },
      {
        id: "a-walk",
        name: "Brisk cooldown walk",
        prescription: "10 min",
        cue: "Moderate pace: breathing faster, but still able to speak in short sentences.",
      },
    ],
  },
  {
    day: 2,
    title: "Aerobic base",
    eyebrow: "Walk / jog · mobility",
    duration: "45–50 min",
    intensity: "Easy to moderate",
    summary:
      "Build the weekly aerobic target without compromising the next strength session.",
    strengthDay: false,
    exercises: [
      {
        id: "b-cardio",
        name: "Brisk walk or easy jog/walk",
        prescription: "40 min",
        cue: "Use a conversational pace. Slow down before the session becomes hard.",
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
        id: "b-hang",
        name: "Relaxed dead hang",
        prescription: "2 × 15–30 sec",
        cue: "Optional. Skip it if the shoulder, elbow, or grip feels irritated.",
        optional: true,
        demoUrl: "https://www.youtube.com/watch?v=dOCQjaasbGs",
      },
    ],
  },
  {
    day: 3,
    title: "Strength B",
    eyebrow: "Pull · shoulders · posterior chain",
    duration: "45–55 min",
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
        cue: "Match Day 1 technique. Do not reduce assistance mid-session to chase reps.",
        demoUrl: "https://www.youtube.com/watch?v=aNUSgyWRJYA",
      },
      {
        id: "c-pike",
        name: "Pike push-up",
        prescription: "3 × 5–10",
        restSeconds: 90,
        cue: "Elevate the hands or reduce the pike angle if head-and-shoulder control is poor.",
      },
      {
        id: "c-squat",
        name: "Squat or backpack squat",
        prescription: "3 × 12–20",
        restSeconds: 90,
        cue: "Use a load that keeps the last reps controlled and repeatable.",
      },
      {
        id: "c-bridge",
        name: "Glute bridge",
        prescription: "3 × 12–20",
        restSeconds: 75,
        cue: "Finish with the hips, not by arching the lower back.",
      },
      {
        id: "c-face-pull",
        name: "Band face pull",
        prescription: "2 × 12–20",
        restSeconds: 60,
        cue: "Use light tension and finish with hands near eye level.",
        demoUrl:
          "https://support.runna.com/en/articles/7978879-banded-face-pulls-exercise-tutorial",
      },
      {
        id: "c-side-plank",
        name: "Side plank",
        prescription: "2 × 20–40 sec / side",
        restSeconds: 60,
        cue: "Shorten the lever from the knees if the hips cannot stay stacked.",
      },
      {
        id: "c-walk",
        name: "Brisk cooldown walk",
        prescription: "10 min",
        cue: "Keep it moderate; this is not an interval workout.",
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
        cue: "Keep the pace comfortable enough to feel better afterward.",
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
    duration: "45–60 min",
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
        cue: "Keep two reps in reserve. Use the same band for all working sets.",
        demoUrl: "https://www.youtube.com/watch?v=aNUSgyWRJYA",
      },
      {
        id: "e-negative",
        name: "Controlled negative pull-up",
        prescription: "2 × 2 at 3–5 sec",
        restSeconds: 120,
        cue: "Optional and gated: only if you can control the full descent without shoulder, elbow, or forearm pain.",
        optional: true,
      },
      {
        id: "e-pushup",
        name: "Push-up",
        prescription: "3 × 8–15",
        restSeconds: 90,
        cue: "Use a repeatable variation. No need to train to failure.",
      },
      {
        id: "e-split-squat",
        name: "Bulgarian split squat",
        prescription: "3 × 8–12 / side",
        restSeconds: 90,
        cue: "Add backpack load only after reaching the top of the range cleanly.",
        demoUrl: "https://www.youtube.com/watch?v=-4LVK1crLSw",
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
        cue: "Moderate, steady pace.",
      },
    ],
  },
  {
    day: 6,
    title: "Long easy cardio",
    eyebrow: "Aerobic base · balance",
    duration: "55–65 min",
    intensity: "Easy to moderate",
    summary:
      "Complete the aerobic target with low-skill work that should not leave you depleted.",
    strengthDay: false,
    exercises: [
      {
        id: "f-cardio",
        name: "Brisk walk",
        prescription: "50 min",
        cue: "A 35–45 minute jog/walk is an alternative if you are already adapted to running.",
      },
      {
        id: "f-balance",
        name: "Single-leg balance",
        prescription: "2 × 30 sec / side",
        cue: "Keep a wall or stable support within reach.",
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
    guidance: "If you reached the top of a range twice, change one variable: slightly less band help or a harder variation.",
  },
  {
    week: 4,
    label: "Consolidate",
    guidance: "Remove one working set from each main exercise. Finish fresh; do not max out.",
  },
];
