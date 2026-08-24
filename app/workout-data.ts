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
  weekPrescriptions?: Record<number, string>;
  omitInWeeks?: number[];
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

export const scheduleVersion = 5;

export const planRules = {
  progression:
    "Keep assistance, band, leverage, ROM, and setup consistent. Progress only after reaching the listed trigger with clean technique in two comparable sessions. Change one variable, then return to the lower end of the range.",
  safety:
    "Stop when ROM or position deteriorates. Sharp, escalating, unstable, radiating, or joint-specific pain is a stop signal. Persistent symptoms, trauma, neurologic symptoms, chest pain, or fainting require qualified assessment.",
  moderateAerobic:
    "Zone 2 should feel about 3–4/10: steady breathing while still able to speak in complete sentences. Replace intervals with Zone 2 whenever leg fatigue compromises Friday or Monday strength performance.",
};

const strengthWarmup: Exercise = {
  id: "strength-warmup",
  name: "Standard strength warm-up",
  prescription: "6–8 min",
  cue: "Brisk walk/jog 2–3 min; wrist rocks ×8; scapular pulls ×6; scapular push-ups ×8; squats ×10; then one easy rehearsal set for the first push, pull, and leg movement.",
};

export const workoutDays: WorkoutDay[] = [
  {
    day: 1,
    title: "Strength A",
    eyebrow: "Pull-up strength · dips · posterior chain",
    duration: "65–75 min",
    intensity: "Mostly 1–2 reps in reserve",
    summary:
      "Priority pull-up and dip practice, balanced by horizontal pulling, unilateral legs, a hinge, and direct shoulder and arm work.",
    strengthDay: true,
    exercises: [
      { ...strengthWarmup, id: "a-warmup" },
      {
        id: "a-strict-pullup",
        name: "Strict pull-up",
        prescription: "4 × 1–2",
        restSeconds: 180,
        cue: "1–2 RIR · Complete 4×2 clean twice and confirm a 4–5 rep maximum in Week 6 before advancing. Use assistance if later sets lose full ROM.",
        weekPrescriptions: { 6: "2 × 1–2" },
      },
      {
        id: "a-assisted-dip",
        name: "Foot- or band-assisted dip",
        prescription: "3 × 5–8",
        restSeconds: 150,
        cue: "2 RIR · Complete 3×8 twice, then reduce assistance slightly. Stop for shoulder or sternum pain.",
        weekPrescriptions: { 6: "2 × 5–8" },
      },
      {
        id: "a-walking-lunge",
        name: "Walking lunge",
        prescription: "3 × 10–14 steps / leg",
        restSeconds: 120,
        cue: "2 RIR · Count steps per leg, not total. After 3×14 per leg twice, add band resistance rather than continually adding steps.",
        weekPrescriptions: { 6: "2 × 10–14 steps / leg" },
      },
      {
        id: "a-ring-row",
        name: "Ring row",
        prescription: "3 × 8–12",
        restSeconds: 90,
        cue: "2 RIR · Complete 3×12 twice, then lower the rings or move the feet forward while keeping the body rigid.",
        weekPrescriptions: { 6: "2 × 8–12" },
      },
      {
        id: "a-band-rdl",
        name: "Band Romanian deadlift",
        prescription: "3 × 8–15",
        restSeconds: 120,
        cue: "2 RIR · Complete 3×15, then increase band tension or use a staggered stance. Keep the hinge controlled.",
        weekPrescriptions: { 6: "2 × 8–15" },
      },
      {
        id: "a-lateral-raise",
        name: "Band lateral raise",
        prescription: "3 × 12–20",
        restSeconds: 60,
        cue: "1–2 RIR · Complete 3×20 without shrugging, then increase tension. Pair with the RDL.",
        weekPrescriptions: { 6: "2 × 12–20" },
      },
      {
        id: "a-hammer-curl",
        name: "Band hammer curl",
        prescription: "2 × 10–20",
        restSeconds: 60,
        cue: "1–2 RIR · Complete 2×20 with still upper arms, then increase tension. Pair with triceps extensions.",
        weekPrescriptions: { 6: "1 × 10–20" },
      },
      {
        id: "a-triceps-extension",
        name: "Band overhead triceps extension",
        prescription: "2 × 12–20",
        restSeconds: 60,
        cue: "BONUS · 1–2 RIR. Complete 2×20, then increase tension; use a band pressdown if the overhead position is uncomfortable.",
        weekPrescriptions: { 6: "1 × 12–20" },
      },
      {
        id: "a-pallof",
        name: "Pallof press",
        prescription: "2 × 10–15 / side",
        restSeconds: 60,
        cue: "2 RIR · Secure the band to a stall bar. Complete 2×15 without trunk rotation, then increase resistance.",
        weekPrescriptions: { 6: "1 × 10–15 / side" },
      },
    ],
  },
  {
    day: 2,
    title: "Zone 2 + mobility",
    eyebrow: "Aerobic base · mobility",
    duration: "45–55 min",
    intensity: "Easy · RPE 3–4/10",
    summary:
      "Build aerobic capacity without compromising Wednesday’s strength work, then complete a short whole-body mobility sequence.",
    strengthDay: false,
    exercises: [
      {
        id: "b-zone2",
        name: "Zone 2 walk or walk/jog",
        prescription: "35–45 min",
        cue: "Use a pace that lets you speak in complete sentences. Add about 5 minutes only when strength-session recovery remains normal.",
      },
      {
        id: "b-thoracic",
        name: "Thoracic rotation",
        prescription: "6 / side",
        cue: "Move slowly through a comfortable range without forcing the end position.",
      },
      {
        id: "b-chest",
        name: "Stall-bar chest stretch",
        prescription: "2 × 30 sec / side",
        cue: "Use a gentle stretch and keep the shoulder below a painful range.",
      },
      {
        id: "b-wall-slide",
        name: "Wall slide",
        prescription: "2 × 8–10",
        cue: "Keep ribs controlled and use only the range where the forearms remain comfortable.",
      },
      {
        id: "b-ankle",
        name: "Ankle dorsiflexion rock",
        prescription: "10 / side",
        cue: "Keep the heel down and guide the knee over the toes without collapsing the arch.",
      },
      {
        id: "b-hip-flexor",
        name: "Half-kneeling hip-flexor stretch",
        prescription: "30 sec / side",
        cue: "Gently tuck the pelvis and avoid arching the lower back.",
      },
    ],
  },
  {
    day: 3,
    title: "Strength B",
    eyebrow: "Pull-up volume · pike press · upper chest",
    duration: "65–75 min",
    intensity: "Mostly 2 reps in reserve",
    summary:
      "Assisted pulling volume and scalable vertical pressing lead a full-body session with upper-chest, hamstring, rear-shoulder, calf, and core work.",
    strengthDay: true,
    exercises: [
      { ...strengthWarmup, id: "c-warmup" },
      {
        id: "c-assisted-pullup",
        name: "Band-assisted pull-up",
        prescription: "3 × 6–10",
        restSeconds: 120,
        cue: "2 RIR · Use the same inspected band and setup for every set. Complete 3×10 twice, then use a lighter band.",
        weekPrescriptions: { 6: "2 × 6–10" },
      },
      {
        id: "c-pike",
        name: "Elevated-hand pike push-up",
        prescription: "3 × 6–10",
        restSeconds: 150,
        cue: "2 RIR · Choose a support height that permits full reps. Complete 3×10 twice, then lower the support slightly.",
        weekPrescriptions: { 6: "2 × 6–10" },
      },
      {
        id: "c-feet-elevated-pushup",
        name: "Feet-elevated push-up",
        prescription: "3 × 6–12",
        restSeconds: 120,
        cue: "2 RIR · Complete 3×12 twice, then elevate the feet slightly or add band resistance. Pair with lunges.",
        weekPrescriptions: { 6: "2 × 6–12" },
      },
      {
        id: "c-reverse-lunge",
        name: "Reverse lunge",
        prescription: "3 × 8–12 / leg",
        restSeconds: 90,
        cue: "2 RIR · Complete 3×12 per leg, then add band resistance or a deeper controlled ROM.",
        weekPrescriptions: { 6: "2 × 8–12 / leg" },
      },
      {
        id: "c-ring-hamstring-curl",
        name: "Ring hamstring curl",
        prescription: "3 × 6–12",
        restSeconds: 90,
        cue: "2 RIR · Complete 3×12, then move the feet farther away or elevate them. Regress to glute-bridge walkouts 3×6–10.",
        weekPrescriptions: { 6: "2 × 6–12" },
      },
      {
        id: "c-face-pull",
        name: "Band face pull to external rotation",
        prescription: "3 × 12–20",
        restSeconds: 60,
        cue: "2 RIR · Use a secure stall-bar anchor. Complete 3×20 with scapular control, then increase tension.",
        weekPrescriptions: { 6: "2 × 12–20" },
      },
      {
        id: "c-calf",
        name: "Single-leg calf raise",
        prescription: "4 × 10–20 / leg",
        restSeconds: 60,
        cue: "1–2 RIR · Complete 4×20, then add band resistance. Use support for balance.",
        weekPrescriptions: { 6: "2 × 10–20 / leg" },
      },
      {
        id: "c-tibialis",
        name: "Wall tibialis raise",
        prescription: "2 × 15–25",
        restSeconds: 60,
        cue: "BONUS · 1–2 RIR. Keep heels down and avoid rocking. Move the feet farther from the wall after 2×25.",
        weekPrescriptions: { 6: "1 × 15–25" },
      },
      {
        id: "c-hollow",
        name: "Hollow-body regression",
        prescription: "2 × 20–30 sec",
        restSeconds: 60,
        cue: "2 RIR · Reach 30 seconds twice with the lower back controlled, then lengthen the limb position.",
        weekPrescriptions: { 6: "1 × 20–30 sec" },
      },
    ],
  },
  {
    day: 4,
    title: "Recovery",
    eyebrow: "Rest · easy walking",
    duration: "20–40 min optional",
    intensity: "Very easy",
    summary:
      "Let the priority movements recover. Walking and gentle mobility are optional, not another training session.",
    strengthDay: false,
    exercises: [
      {
        id: "d-walk",
        name: "Easy walk",
        prescription: "20–40 min optional",
        cue: "Finish feeling better than you started. Do not turn this into a conditioning session.",
        optional: true,
      },
      {
        id: "d-mobility",
        name: "Gentle mobility",
        prescription: "5–10 min optional",
        cue: "Choose comfortable hip, ankle, chest, and shoulder movements. No additional pull-ups, pikes, dips, or leg training.",
        optional: true,
      },
    ],
  },
  {
    day: 5,
    title: "Strength C",
    eyebrow: "Technique · back · quads · core",
    duration: "60–70 min",
    intensity: "Technique work at 2–3 reps in reserve",
    summary:
      "Low-fatigue skill practice supports the main pull-up, dip, and pike sessions while rows, squats, shoulders, triceps, and core round out the week.",
    strengthDay: true,
    exercises: [
      { ...strengthWarmup, id: "e-warmup" },
      {
        id: "e-pullup-singles",
        name: "Strict pull-up technique singles",
        prescription: "5 × 1",
        restSeconds: 90,
        cue: "About 2 RIR · Progress to 5×2 only after the tested maximum reaches about five clean repetitions.",
        weekPrescriptions: { 6: "3 × 1" },
      },
      {
        id: "e-assisted-dip",
        name: "Assisted dip technique",
        prescription: "2 × 6–10",
        restSeconds: 120,
        cue: "3 RIR · Use more assistance than Monday. Complete 2×10 smoothly, then reduce assistance slightly on Friday only.",
        weekPrescriptions: { 6: "1 × 6–10" },
      },
      {
        id: "e-pike",
        name: "Elevated-hand pike push-up technique",
        prescription: "2 × 6–8",
        restSeconds: 120,
        cue: "3 RIR · Keep this easier than Wednesday. Progress the exercise level only through Wednesday’s primary sets.",
        weekPrescriptions: { 6: "1 × 6–8" },
      },
      {
        id: "e-ring-row",
        name: "Ring row",
        prescription: "3 × 10–15",
        restSeconds: 90,
        cue: "2 RIR · Complete 3×15 twice, then lower the rings or move the feet forward. Pair with front squats.",
        weekPrescriptions: { 6: "2 × 10–15" },
      },
      {
        id: "e-front-squat",
        name: "Band front squat",
        prescription: "3 × 10–15",
        restSeconds: 120,
        cue: "2 RIR · Complete 3×15, then increase tension while preserving depth and trunk position.",
        weekPrescriptions: { 6: "2 × 10–15" },
      },
      {
        id: "e-lateral-raise",
        name: "Band lateral raise",
        prescription: "2 × 12–20",
        restSeconds: 60,
        cue: "1–2 RIR · Complete 2×20 without shrugging, then increase tension. Pair with close-grip push-ups.",
        weekPrescriptions: { 6: "1 × 12–20" },
      },
      {
        id: "e-close-grip-pushup",
        name: "Elevated close-grip push-up",
        prescription: "2 × 6–10",
        restSeconds: 90,
        cue: "2–3 RIR · Hands just inside shoulder width. Complete 2×10 twice, then lower the support; a narrower diamond is optional after floor 2×10.",
        weekPrescriptions: { 6: "1 × 6–10" },
      },
      {
        id: "e-hanging-knee-raise",
        name: "Hanging knee raise",
        prescription: "3 × 6–12",
        restSeconds: 90,
        cue: "2 RIR · Avoid swinging. Complete 3×12, then raise the knees higher or gradually straighten the legs.",
        weekPrescriptions: { 6: "2 × 6–12" },
      },
      {
        id: "e-side-plank",
        name: "Side plank",
        prescription: "2 × 20–40 sec / side",
        restSeconds: 60,
        cue: "BONUS · About 2 RIR. Keep the hips stacked. After two controlled 40-second holds, lengthen the lever.",
        weekPrescriptions: { 6: "1 × 20–40 sec / side" },
      },
    ],
  },
  {
    day: 6,
    title: "Cardio",
    eyebrow: "Zone 2 · occasional intervals",
    duration: "35–50 min",
    intensity: "Easy most weeks",
    summary:
      "Most Saturdays extend the aerobic base; two controlled interval sessions add a small higher-intensity exposure.",
    strengthDay: false,
    exercises: [
      {
        id: "f-cardio",
        name: "Saturday conditioning",
        prescription: "Zone 2 · 35–50 min",
        cue: "Weeks 1, 2, 4: Zone 2. Weeks 3, 5: 8-min warm-up, 6×1 min at RPE 8/10 with 2 min easy, then 5-min cooldown. Week 6: easy Zone 2.",
        weekPrescriptions: {
          3: "8-min warm-up + 6 × 1 min hard / 2 min easy + 5-min cooldown",
          5: "8-min warm-up + 6 × 1 min hard / 2 min easy + 5-min cooldown",
          6: "Easy Zone 2 · 35–45 min",
        },
      },
      {
        id: "f-mobility",
        name: "Comfortable cooldown mobility",
        prescription: "5–8 min optional",
        cue: "Use calm, pain-free movements for whichever areas feel restricted after the week.",
        optional: true,
      },
    ],
  },
  {
    day: 7,
    title: "Complete rest",
    eyebrow: "Recover · review",
    duration: "No session required",
    intensity: "Rest",
    summary:
      "Sunday is not a missed-workout replacement day. Normal light movement is fine; begin the next week fresh.",
    strengthDay: false,
    exercises: [
      {
        id: "g-rest",
        name: "Rest from planned training",
        prescription: "All day",
        cue: "A casual walk is fine, but it is not required and does not need to be intense.",
      },
      {
        id: "g-review",
        name: "Two-minute weekly review",
        prescription: "Optional",
        cue: "Record pain, energy, completed reps, band setups, and any performance decline.",
        optional: true,
      },
    ],
  },
];

export const weekGuidance = [
  {
    week: 1,
    label: "Standardize",
    guidance: "Use about 3 RIR on compounds while learning the new exercise order, assistance, band setups, and geometry.",
  },
  {
    week: 2,
    label: "Build reps",
    guidance: "Use the listed RIR. Add reps inside the current ranges where technique and recovery remain stable.",
  },
  {
    week: 3,
    label: "Progress",
    guidance: "Keep building within the ranges. Saturday uses the first interval session unless leg fatigue calls for Zone 2.",
  },
  {
    week: 4,
    label: "Repeat well",
    guidance: "Do not change exercises for novelty. Confirm repeatable progress triggers and keep Saturday at Zone 2.",
  },
  {
    week: 5,
    label: "Confirm",
    guidance: "Complete the final normal week. Progress only where the full trigger is met; choose Zone 2 if recovery is reduced.",
  },
  {
    week: 6,
    label: "Reduce + retest",
    guidance: "Use the reduced prescriptions, stay near 3 RIR, and complete the standardized reassessment without extra max tests.",
  },
];
