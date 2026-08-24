import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const workoutDataPath = resolve(projectRoot, "app/workout-data.ts");
const pagePath = resolve(projectRoot, "app/page.tsx");
const outputPath = resolve(projectRoot, "exports/workin-plan.json");

const [workoutDataSource, pageSource] = await Promise.all([
  readFile(workoutDataPath, "utf8"),
  readFile(pagePath, "utf8"),
]);

function readExport(startMarker, endMarker, prefixPattern, context = Object.create(null)) {
  const start = workoutDataSource.indexOf(startMarker);
  const end = endMarker ? workoutDataSource.indexOf(endMarker) : workoutDataSource.length;
  if (start < 0 || end < 0) throw new Error(`Could not locate ${startMarker}.`);
  const literal = workoutDataSource
    .slice(start, end)
    .replace(prefixPattern, "")
    .trim()
    .replace(/;$/, "");
  return runInNewContext(`(${literal})`, context, { timeout: 1_000 });
}

const planRules = readExport(
  "export const planRules",
  "const strengthWarmup",
  /^export const planRules =\s*/,
);
const strengthWarmup = readExport(
  "const strengthWarmup",
  "export const workoutDays",
  /^const strengthWarmup: Exercise =\s*/,
);
const workoutDays = readExport(
  "export const workoutDays",
  "export const weekGuidance",
  /^export const workoutDays: WorkoutDay\[\] =\s*/,
  { strengthWarmup },
);
const weekGuidance = readExport(
  "export const weekGuidance",
  null,
  /^export const weekGuidance =\s*/,
);

const programStartDate =
  pageSource.match(/DEFAULT_PROGRAM_START = "(\d{4}-\d{2}-\d{2})"/)?.[1];
const scheduleVersion =
  workoutDataSource.match(/export const scheduleVersion =\s*(\d+)/)?.[1];
if (!programStartDate || !scheduleVersion) {
  throw new Error("Could not locate current schedule metadata.");
}

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const exerciseRecordCount = workoutDays.reduce(
  (total, day) => total + day.exercises.length,
  0,
);

const exportData = {
  schemaVersion: 3,
  plan: {
    id: "workin-v2-six-week-calisthenics-block",
    name: "Workin",
    title: "Six-week calisthenics and resistance-band block",
    scheduleVersion: Number(scheduleVersion),
    programStartDate,
    weekStartsOn: "Monday",
    cycleLengthWeeks: 6,
    trainingWeeks: 5,
    reassessmentWeek: 6,
    dayCount: workoutDays.length,
    exerciseRecordCount,
    focus:
      "Balanced strength and muscle development with pull-up specialization, scalable dip and pike practice, complete back and leg work, cardio, mobility, and recovery.",
    reviewBasis:
      "Derived from the consensus-approved Workin V2 plan, then modified at the user's request by replacing Bulgarian split squats with walking lunges and adding one bonus movement to each strength day.",
  },
  dataProvenance: {
    generatedOn: "2026-08-24",
    generatedFrom:
      "The authoritative Workin workout data and the trainee details supplied by the user.",
    verification:
      "Personal details and performance are user-reported; this is not a medical assessment or independently verified technique review.",
    sensitiveDataNotice:
      "This file contains personal health, body, training, lifestyle, and nutrition information. Share it only with reviewers or systems you trust.",
  },
  traineeProfile: {
    demographics: {
      sex: "male",
      ageYears: 25,
      heightCm: 190,
      bodyWeightKg: 88,
    },
    trainingBackground: {
      level: "beginner-plus",
      history:
        "Intermittent training for several years, commonly one or two months of training followed by long breaks.",
      recentConsistency:
        "Completed the previous four-week Workin block after approximately one month of consistent training beforehand.",
      previousBlockRecovery:
        "The previous workload was manageable and overall strength noticeably improved.",
    },
    currentPerformance: {
      strictPullUpsMax: 3,
      standardPushUps: "Approximately 3 sets of 15 clean repetitions",
      pikePushUps: "Difficult; requires an elevated-hand regression",
      parallelBarDips: "Difficult; requires foot or band assistance",
      closeGripPushUps: "Difficult; requires elevation",
      plankMaxSeconds: "Approximately 50–60",
    },
    goals: {
      primary: [
        "Increase strict pull-ups from approximately 3 toward a long-term target of 20 or more",
        "Build strength and muscle while developing a wider, more complete back",
        "Improve shoulders, upper chest, triceps, dips, and pike pressing",
      ],
      wholeBody: [
        "Balanced physique and athletic frame",
        "Leg, hamstring, glute, calf, and core development",
        "Scapular control and proportionate posture-related training",
        "Cardiovascular fitness and general mobility",
        "Long-term progression into advanced calisthenics",
      ],
      bodyComposition:
        "Maintain roughly the same body weight, reduce fat slightly, and gain muscle.",
    },
    health: {
      injuries: "None reported",
      medicalConditions: null,
      medicationsAffectingExercise: null,
      note: "No reported injury is not equivalent to medical screening or clearance.",
    },
    equipment: {
      setting: "Outdoor park or calisthenics area",
      park: [
        "Pull-up bars at multiple heights",
        "Monkey bars",
        "Parallel/dip bars",
        "Gymnastic rings",
        "Stall bars or Swedish ladder",
        "Low push-up bars or parallettes",
        "Open floor space",
      ],
      portable: ["10 kg labeled resistance band", "25 kg labeled resistance band", "35 kg labeled resistance band"],
      homeOnly: ["Two 5 kg dumbbells"],
      gymAccess: false,
      bandCalibration:
        "Brand and actual resistance are unverified; log the specific band, length, anchor, and setup.",
    },
    recoveryAndLifestyle: {
      sleepHoursPerNight: 7.5,
      workdayActivity: "Mostly seated",
      otherSportsOrCardio: "None reported outside the program",
      acceptableTrainingDaysPerWeek: [4, 5, 6],
    },
    nutrition: {
      proteinTargetGramsPerDay: 155,
      proteinTargetGramsPerKgPerDay: 1.76,
      recentTargetDuration: "Approximately two weeks when first reported",
      priorProteinIntake: "Much lower according to the user",
      calorieIntake: null,
      weightTrend: null,
    },
  },
  planRules,
  weekGuidance,
  progressionLadders: {
    pullUp: [
      { level: "P1", testedMax: "1–3", work: "Monday 4×1–2; Wednesday assisted 3×6–10; Friday 5×1" },
      { level: "P2", testedMax: "4–5", work: "Monday 4×2–3; lighter Wednesday assistance; Friday 5×1–2" },
      { level: "P3", testedMax: "6–8", work: "Monday 4×3–4; assisted volume; Friday 5×2" },
      { level: "P4", testedMax: "9–12", work: "Strength sets plus submaximal endurance work" },
      { level: "P5", testedMax: "13–15", work: "Harder strength work plus controlled density work" },
      { level: "P6", testedMax: "16–20+", work: "Strength maintenance plus endurance specialization" },
    ],
    pike: [
      "Choose a high-hand position permitting 3×6 at 2 RIR.",
      "Lower the support after 3×10 twice.",
      "Progress floor pikes after 3×8–10 twice.",
      "Progress feet-elevated pikes after 3×8 with controlled deep ROM.",
      "Add wall-supported partial-ROM work only with pain-free wrist and shoulder tolerance.",
    ],
    dip: [
      "Use support holds 3×15–30 sec if a stable support cannot be held.",
      "Build foot-assisted dips to 3×8–10 at 2 RIR.",
      "Build band-assisted dips to 3×8, then use a lighter band.",
      "Accumulate 5–8 clean strict singles before building strict sets from 3×3 toward 3×8–10.",
    ],
  },
  fatigueAndAdjustmentRules: [
    "Week 1 uses about 3 RIR on compounds while setup is standardized.",
    "Weeks 2–5 use the listed RIR and progression triggers.",
    "Week 6 reduces working sets by about 40%, stays near 3 RIR, and includes reassessment.",
    "Missed sessions are skipped; sessions are never combined.",
    "If performance declines across two sessions, joint irritation increases, or soreness persists beyond about 72 hours, reduce working sets by 30–40% for one week.",
    "Do not progress pull-up, dip, and pike difficulty simultaneously.",
  ],
  retestProtocol: {
    timing: "Baseline before Week 1 and repeat during Week 6 with identical assistance, equipment, and geometry.",
    sessionA: [
      "One maximum clean strict-pull-up set",
      "One clean set of the current pike progression, capped at 12",
      "One clean set of the current dip progression, capped at 10; record assistance",
      "One clean ring-row set, capped at 20; record ring and foot position",
    ],
    sessionBAtLeast48HoursLater: [
      "One maximum clean standard-push-up set",
      "One standardized walking-lunge set per leg, capped at 20 steps per leg",
      "One clean hanging-knee-raise set, capped at 15",
    ],
    separateDay: "Twelve-minute walk/run test; record distance using the same location and similar conditions.",
    stopRule: "End every test when ROM or body position deteriorates.",
  },
  days: workoutDays.map((day, dayIndex) => ({
    day: day.day,
    weekday: weekdays[dayIndex],
    title: day.title,
    eyebrow: day.eyebrow,
    duration: day.duration,
    intensity: day.intensity,
    summary: day.summary,
    strengthDay: day.strengthDay,
    exercises: day.exercises.map((exercise, exerciseIndex) => ({
      order: exerciseIndex + 1,
      id: exercise.id,
      name: exercise.name,
      prescription: exercise.prescription,
      restSeconds: exercise.restSeconds ?? null,
      cue: exercise.cue,
      optional: exercise.optional ?? false,
      demoUrl: exercise.demoUrl ?? null,
      weekPrescriptions: exercise.weekPrescriptions ?? {},
      omitInWeeks: exercise.omitInWeeks ?? [],
    })),
  })),
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(exportData, null, 2)}\n`, "utf8");
console.log(outputPath);
