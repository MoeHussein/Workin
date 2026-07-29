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

const rulesStart = workoutDataSource.indexOf("export const planRules");
const workoutStart = workoutDataSource.indexOf("export const workoutDays");
const guidanceStart = workoutDataSource.indexOf("export const weekGuidance");

if (rulesStart < 0 || workoutStart < 0 || guidanceStart < 0) {
  throw new Error("Could not locate the workout plan exports.");
}

const rulesLiteral = workoutDataSource
  .slice(rulesStart, workoutStart)
  .replace(/^export const planRules =\s*/, "")
  .trim()
  .replace(/;$/, "");

const workoutLiteral = workoutDataSource
  .slice(workoutStart, guidanceStart)
  .replace(/^export const workoutDays: WorkoutDay\[\] =\s*/, "")
  .trim()
  .replace(/;$/, "");

const guidanceLiteral = workoutDataSource
  .slice(guidanceStart)
  .replace(/^export const weekGuidance =\s*/, "")
  .trim()
  .replace(/;$/, "");

const workoutDays = runInNewContext(`(${workoutLiteral})`, Object.create(null), {
  timeout: 1_000,
});
const planRules = runInNewContext(`(${rulesLiteral})`, Object.create(null), {
  timeout: 1_000,
});
const weekGuidance = runInNewContext(`(${guidanceLiteral})`, Object.create(null), {
  timeout: 1_000,
});

const programStartDate =
  pageSource.match(/DEFAULT_PROGRAM_START = "(\d{4}-\d{2}-\d{2})"/)?.[1];
const scheduleVersion =
  workoutDataSource.match(/export const scheduleVersion =\s*(\d+)/)?.[1];

if (!programStartDate || !scheduleVersion) {
  throw new Error("Could not locate the current program schedule metadata.");
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
const coverageRevisionEffectiveAfter = "2026-07-29";
const currentPlanDate = "2026-07-30";
const exerciseRecordCount = workoutDays.reduce(
  (total, day) => total + day.exercises.length,
  0,
);
const currentExerciseCount = workoutDays.reduce(
  (total, day) =>
    total +
    day.exercises.filter(
      (exercise) =>
        (!exercise.startsAfter || currentPlanDate > exercise.startsAfter) &&
        (!exercise.endsOn || currentPlanDate <= exercise.endsOn),
    ).length,
  0,
);

const traineeProfile = {
  provenance: {
    classification: "user-reported",
    recordedOn: "2026-07-29",
    verification:
      "Not independently verified and not a medical or clinical assessment.",
  },
  demographics: {
    sex: "male",
    ageYears: 25,
    heightCm: 190,
    bodyWeightKg: 88,
  },
  trainingBackground: {
    programmingLevel: "beginner-plus",
    history:
      "Intermittent training for a couple of years, usually for one or two months followed by a long break.",
    currentConsistency:
      "Approximately one month of recent consistent training.",
  },
  goals: {
    summary:
      "Develop a strong, athletic frame with strength, cardiovascular fitness, general flexibility, power, a wider back, and broad calisthenics ability.",
    bodyComposition: {
      maintainBodyWeight: true,
      reduceBodyFatSlightly: true,
      increaseMuscle: true,
    },
    performance: [
      "Improve general strength.",
      "Improve cardiovascular fitness.",
      "Improve general flexibility.",
      "Develop power and explosiveness.",
      "Build a wider back.",
      "Become broadly capable at calisthenics.",
    ],
    flexibility: "General flexibility; no specific limitation identified yet.",
    prioritiesRanked: false,
  },
  health: {
    injuries: "None reported.",
    medicalConditions: null,
    medicationsAffectingExercise: null,
    medicalClearance: null,
    note:
      "No reported injury is not equivalent to medical screening or clearance.",
  },
  equipmentAndSetting: {
    gymAccess: false,
    setting: "Outdoor park or calisthenics area.",
    equipment: [
      "Dip or parallel bars",
      "Pull-up bar",
      "Resistance bands",
      "Ladders",
      "Handholds",
      "Parallel bars",
      "Equipment described by the user as gymnastic wheels",
    ],
    resistanceBands: {
      labeledResistanceKg: [10, 25, 35],
      brand: "Unknown or off-brand",
      actualResistanceVerified: false,
      bandLengthAndSetup: null,
    },
    clarificationNeeded: [
      "Confirm whether 'gymnastic wheels' means gymnastic rings.",
      "Record band length, anchor setup, and the band used for each assisted exercise.",
      "Treat the printed band resistance as a label until its actual loading is verified.",
    ],
  },
  schedulePreference: {
    acceptableTrainingDaysPerWeek: [4, 5, 6],
    condition:
      "The user is open to four, five, or six days depending on the exercise mix and what the evidence supports.",
    interpretation:
      "This availability should not be interpreted as a request for four to six hard strength sessions.",
  },
  currentPerformance: {
    unassistedPullUpsMax: {
      minimumRepetitions: 2,
      maximumRepetitions: 3,
      status: "approximate",
    },
    workingSetRepetitionsInReserve: {
      pushUps: {
        minimum: 2,
        maximum: 3,
        status: "approximate",
      },
      pullUps: {
        minimum: 1,
        maximum: 2,
        status: "approximate",
      },
    },
    plankMaxSeconds: {
      minimum: 50,
      maximum: 60,
      status: "approximate",
    },
    exactSetBySetRepetitions: null,
    maximumCleanPushUps: null,
    deadHangMaxSeconds: null,
  },
  lifestyleAndRecovery: {
    sleepHoursPerNight: 7.5,
    otherSportsOrCardio: "None reported.",
    workdayActivity: "Mostly seated.",
    perceivedRecovery: null,
  },
  nutrition: {
    goal:
      "Maintain body weight, reduce body fat slightly, and increase muscle.",
    proteinTargetGramsPerDay: 155,
    currentProteinDuration:
      "Approximately two weeks at the time this profile was recorded.",
    priorProteinIntake: "User reported it was much lower.",
    totalCalorieIntake: null,
    bodyWeightTrend: null,
    waistMeasurement: null,
  },
  currentBlock: {
    startDate: programStartDate,
    weekStartsOn: "Monday",
    completedSessions: [
      {
        date: "2026-07-27",
        weekday: "Monday",
        planDay: 1,
        session: "Strength A",
        completed: true,
        report:
          "Completed every originally prescribed exercise with no issues. The session felt easy and smooth, but the user felt that something might be missing.",
      },
      {
        date: "2026-07-28",
        weekday: "Tuesday",
        planDay: 2,
        session: "Aerobic base",
        completed: true,
        report: null,
      },
    ],
    planHistory: [
      {
        effectiveAfter: "2026-07-27",
        change:
          "A hinge movement was added after review of the first Strength A session.",
        reason:
          "Preserve the record of what the user actually completed versus the current plan.",
      },
      {
        effectiveAfter: coverageRevisionEffectiveAfter,
        change:
          "A whole-body coverage revision replaced redundant exercises with dips, reverse crunches, and knee-flexion hamstring work, then added a small accessory layer for lateral deltoids, biceps, shoulder external rotation, tibialis anterior, and hip abductors.",
        reason:
          "Address meaningful coverage and calisthenics-skill gaps while preserving three primary strength days, low-fatigue aerobic or recovery days, and Sunday as full rest.",
      },
    ],
  },
};

const calculations = {
  proteinGramsPerKgPerDay: {
    value: Number(
      (
        traineeProfile.nutrition.proteinTargetGramsPerDay /
        traineeProfile.demographics.bodyWeightKg
      ).toFixed(2),
    ),
    formula: "155 g/day divided by 88 kg",
    classification: "calculated from user-reported values",
    interpretation:
      "This calculation documents the current target and does not by itself justify a program change.",
  },
};

const coachInterpretation = {
  classification: "working interpretation for review, not established fact",
  items: [
    "The reported training history and current ability are more consistent with beginner-plus programming than a zero-beginner plan.",
    "Three hard strength days remain the current recoverable anchor; additional active days are currently aerobic, mobility, recovery, or rest days.",
    "The reported working sets were approximately one to three repetitions in reserve. A session feeling easy does not by itself establish that more volume is required.",
    "Band-assisted pull-ups remain the current volume progression while maximum unassisted pull-up capacity is approximately two to three repetitions.",
    "Power work should be evaluated as a progression pathway after the reviewer checks foundational strength, landing or deceleration control, and recovery.",
    "Targeted accessories were introduced through substitutions and minimal additions; their value should now be judged from performance, technique, and recovery logs rather than by adding more exercises immediately.",
  ],
};

const validationReadiness = {
  status: "Ready for initial review; several measurements remain open.",
  reviewerInstructions: [
    "Treat traineeProfile values as user-reported unless explicitly marked as calculated.",
    "Separate recommendations into retain, change now, measure first, and reconsider after the four-week block.",
    "Do not describe the plan as optimal without comparing it with the trainee's goals, current performance, equipment, schedule, and recovery.",
    "Prefer the smallest effective change and identify its intended start date.",
    "Flag medical, pain, or technique questions instead of inventing an answer.",
  ],
  auditChecklist: [
    "Check coverage of the major movement patterns and major muscle groups.",
    "Calculate direct and indirect weekly set volume, especially pulling, grip, elbow-flexor, and forearm work.",
    "Check strength-day frequency, spacing, and likely recovery demand.",
    "Check whether each exercise is feasible with the listed park equipment.",
    "Check band calibration and how assistance changes across band setups.",
    "Check repetitions in reserve, rest periods, progression criteria, and regression criteria.",
    "Check aerobic dose and progression against a mostly seated baseline with no other reported cardio.",
    "Check whether the mobility work adequately serves a general flexibility goal and identify any missing assessment.",
    "Define prerequisites and a conservative pathway for future power or explosive work.",
    "Check whether the body-composition goals are mutually workable without inventing calorie intake or body-fat measurements.",
    "Check the week-four deload or consolidation logic and the post-block reassessment plan.",
    "Check pain, symptom, and stop criteria, including how the next session should be modified.",
    "Provide substitutions for exercises that cannot be performed safely or consistently at the park.",
    "Distinguish changes needed now from changes that should wait until the current four-week block is evaluated.",
    "Do not convert availability for four to six days into four to six hard strength days without a specific recovery-based rationale.",
    "Evaluate the current three-strength-day structure together with its aerobic and recovery days, not in isolation.",
  ],
  openQuestions: [
    {
      id: "goal-priority",
      priority: "high",
      neededForInitialReview: true,
      question:
        "Which two goals should have the highest priority during the next three to six months?",
      whyItMatters:
        "The listed goals are broad and may require different programming emphasis.",
    },
    {
      id: "set-log",
      priority: "high",
      neededForInitialReview: true,
      question:
        "What repetitions were completed in every working set, and which band was used for each assisted pull-up set?",
      whyItMatters:
        "Progression and fatigue cannot be judged accurately from prescriptions alone.",
    },
    {
      id: "push-up-max",
      priority: "high",
      neededForInitialReview: true,
      question:
        "What is the current maximum number of clean push-ups using a consistent technique standard?",
      whyItMatters:
        "It helps calibrate push-up variations and working-set targets.",
    },
    {
      id: "dip-baseline",
      priority: "high",
      neededForInitialReview: true,
      question:
        "How many clean, pain-free parallel-bar dips can be performed, and what band or foot assistance is required to stay within the prescribed range?",
      whyItMatters:
        "Dip assistance and range of motion need calibration before progression.",
    },
    {
      id: "health-screen",
      priority: "high",
      neededForInitialReview: true,
      question:
        "Are there any medical conditions, symptoms, or medications relevant to exercise, even though no injuries were reported?",
      whyItMatters:
        "No reported injury does not complete a basic exercise-readiness screen.",
    },
    {
      id: "ring-clarification",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "Does 'gymnastic wheels' mean gymnastic rings, and are they adjustable?",
      whyItMatters:
        "Rings would materially expand scalable pulling, pushing, and stability options.",
    },
    {
      id: "band-setup",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "What are the bands' lengths and anchor configurations, and what do their kilogram labels represent?",
      whyItMatters:
        "A printed resistance label does not uniquely determine assistance through a movement.",
    },
    {
      id: "dead-hang",
      priority: "medium",
      neededForInitialReview: false,
      question: "What is the maximum controlled dead-hang time?",
      whyItMatters:
        "It provides a simple baseline for grip and hanging tolerance.",
    },
    {
      id: "lower-body-baseline",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "What lower-body movements and repetition ranges can currently be performed with stable technique?",
      whyItMatters:
        "The current profile contains more upper-body performance detail than lower-body detail.",
    },
    {
      id: "session-availability",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "How many minutes are reliably available on weekdays and weekends?",
      whyItMatters:
        "Session duration affects exercise selection, density, and adherence.",
    },
    {
      id: "cardio-baseline",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "What pace, distance, heart-rate response, or talk-test result was observed during the aerobic-base session?",
      whyItMatters:
        "The current cardio baseline is described only by the completed session.",
    },
    {
      id: "flexibility-specifics",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "Which positions or movements currently feel restricted?",
      whyItMatters:
        "A general flexibility goal needs specific baselines before targeted work can be evaluated.",
    },
    {
      id: "body-composition-trend",
      priority: "low",
      neededForInitialReview: false,
      question:
        "If nutrition is reviewed, what are the recent body-weight and waist trends and approximate calorie intake?",
      whyItMatters:
        "The current data cannot establish energy balance or body-composition change.",
    },
    {
      id: "recovery-and-pain-log",
      priority: "medium",
      neededForInitialReview: false,
      question:
        "How do soreness, joint discomfort, energy, and performance change during the 24 to 48 hours after each session?",
      whyItMatters:
        "Repeated recovery observations are more useful than one easy session for adjusting workload.",
    },
  ],
};

const exportData = {
  schemaVersion: 2,
  plan: {
    id: "workin-four-week-pull-up-block",
    name: "Workin",
    title: "Four-week pull-up training block",
    scheduleVersion: Number(scheduleVersion),
    programStartDate,
    weekStartsOn: "Monday",
    cycleLengthWeeks: 4,
    dayCount: workoutDays.length,
    coverageRevisionEffectiveAfter,
    exerciseRecordCount,
    currentExerciseCount,
    focus:
      "Pull-up development and general full-body fitness with strength, aerobic, recovery, and rest days.",
  },
  dataProvenance: {
    generatedFrom:
      "The current Workin workout data and the trainee details supplied in this conversation.",
    generatedOn: "2026-07-29",
    truthLayers: {
      userReported:
        "Personal details, history, goals, equipment, performance estimates, lifestyle, nutrition, and session feedback.",
      calculated:
        "Values explicitly listed under calculations and derived only from the named inputs.",
      coachInterpretation:
        "Working programming interpretations listed separately for critical review.",
      unknown:
        "Values represented as null or listed under validationReadiness.openQuestions.",
    },
    sensitiveDataNotice:
      "This file contains personal health, body, training, lifestyle, and nutrition information. Share it only with reviewers or systems you trust.",
  },
  traineeProfile,
  calculations,
  coachInterpretation,
  validationReadiness,
  reviewScope: {
    intendedUse:
      "Shareable plan snapshot for review by qualified fitness professionals or AI systems.",
    includes:
      "Trainee profile, explicit calculations, current-block feedback, validation questions, program structure, weekday schedule, exercise dosage, rest periods, coaching cues, optional status, demonstration links, activation and end dates, and four-week progression guidance.",
    excludes:
      "Medical diagnosis, clinical clearance, independently verified performance, video-based technique assessment, measured body-fat percentage, and verified calorie intake.",
    disclaimer:
      "This file describes a training plan. It is not medical care or individualized clinical advice.",
  },
  planRules,
  weekGuidance,
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
      startsAfter: exercise.startsAfter ?? null,
      endsOn: exercise.endsOn ?? null,
      week4Prescription: exercise.week4Prescription ?? null,
      omitInWeek4: exercise.omitInWeek4 ?? false,
    })),
  })),
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(exportData, null, 2)}\n`, "utf8");

console.log(outputPath);
