import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds a deployable worker and completed workout product shell", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  await access(new URL("../dist/server/index.js", import.meta.url));
  assert.match(layout, /Workin — Four-week pull-up training block/);
  assert.match(page, /Plan guide/);
  assert.match(page, /src="\/workin-logo\.svg"/);
  assert.match(page, /src="\/workin-logo-footer\.svg"/);
  assert.equal((page.match(/\bunoptimized\b/g) ?? []).length, 4);
  assert.match(page, /Complete this session/);
  assert.match(page, /Download today’s workout/);
  assert.match(page, /Download complete workout/);
  assert.match(page, /workout-export-card/);
  assert.match(page, /weekly-pdf-page/);
  assert.match(page, /REST/);
  assert.doesNotMatch(`${page}\n${layout}`, /codex-preview|react-loading-skeleton/i);
});

test("removes starter-only product artifacts", async () => {
  const [page, layout, packageJson, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Week \{cycleWeek\}/);
  assert.match(page, /Training place/);
  assert.match(page, /Start \{exercise\.restSeconds\}s rest/);
  assert.match(page, /timer-orbit/);
  assert.match(page, /DEFAULT_PROGRAM_START = "2026-07-27"/);
  assert.match(
    await readFile(new URL("../app/workout-data.ts", import.meta.url), "utf8"),
    /Band Romanian deadlift/,
  );
  const workoutData = await readFile(
    new URL("../app/workout-data.ts", import.meta.url),
    "utf8",
  );
  assert.match(workoutData, /name: "Band pull-apart"/);
  assert.match(workoutData, /name: "Assisted parallel-bar dip"/);
  assert.match(workoutData, /name: "Reverse crunch"/);
  assert.match(workoutData, /name: "Standing band hamstring curl"/);
  assert.match(workoutData, /name: "Band lateral raise"/);
  assert.match(workoutData, /name: "Band curl"/);
  assert.match(workoutData, /name: "No-anchor band external rotation"/);
  assert.match(workoutData, /name: "Wall tibialis raise"/);
  assert.match(workoutData, /name: "Band lateral walk"/);
  assert.match(workoutData, /endsOn: "2026-07-29"/);
  assert.match(workoutData, /restSeconds: 90,[\s\S]*?omitInWeek4: true/);
  assert.match(workoutData, /able to talk but not sing/);
  assert.match(workoutData, /week4Prescription: "2 × 4–8"/);
  assert.match(workoutData, /every working set reaches the top/);
  assert.match(page, /getExercisesForWeek/);
  assert.match(page, /final-set RIR/);
  assert.match(page, /radiating, unstable/);
  assert.match(layout, /Workin — Four-week pull-up training block/);
  assert.match(layout, /\/favicon\.svg/);
  await access(new URL("../public/workin-logo.svg", import.meta.url));
  assert.match(
    await readFile(new URL("../public/workin-logo-footer.svg", import.meta.url), "utf8"),
    /fill="#141513"/,
  );
  await access(new URL("../public/favicon.svg", import.meta.url));
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(packageJson, /"html-to-image": "1\.11\.13"/);
  assert.match(packageJson, /"jspdf": "4\.2\.1"/);
  assert.match(page, /toBlob\(exportCardRef\.current/);
  assert.match(page, /pdf\.addImage\(pageImage, "JPEG", 0, 0, 210, 297/);
  assert.match(page, /pages\.length !== 7/);
  assert.match(page, /workin-day-\$\{day\.day\}-\$\{selectedDate\}\.png/);
  assert.match(page, /workin-week-\$\{weekStart\}\.pdf/);
  assert.match(css, /\.weekly-pdf-meta span \{[\s\S]*?flex: 0 0 auto;/);
  assert.match(css, /\.weekly-pdf-meta span \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.session-meta span \{[\s\S]*?flex: 0 0 auto;/);
  assert.match(css, /\.session-meta span \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.export-meta span \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.download-workout-button \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.download-complete-button \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.download-arrow::before \{[\s\S]*?rotate\(45deg\)/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../app/_sites-preview/preview.css", import.meta.url)));
});

test("declares persistent D1 storage and the Monday-first schedule", async () => {
  const [hostingText, scheduleMigration] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(
      new URL("../drizzle/0002_monday_schedule.sql", import.meta.url),
      "utf8",
    ),
  ]);
  const hosting = JSON.parse(hostingText);
  assert.equal(hosting.d1, "DB");
  assert.equal(hosting.r2, null);
  assert.match(scheduleMigration, /`start_date` = '2026-07-27'/);
  assert.match(scheduleMigration, /'2026-07-27',\s*1,\s*true/);
  assert.match(scheduleMigration, /'2026-07-28',\s*2,\s*true/);
  await access(new URL("../db/schema.ts", import.meta.url));
  await access(new URL("../drizzle/0000_brief_shen.sql", import.meta.url));
});

test("exports the current plan as review-ready JSON", async () => {
  const plan = JSON.parse(
    await readFile(new URL("../exports/workin-plan.json", import.meta.url), "utf8"),
  );
  const exerciseCount = plan.days.reduce(
    (total, day) => total + day.exercises.length,
    0,
  );

  assert.equal(plan.schemaVersion, 2);
  assert.equal(plan.plan.programStartDate, "2026-07-27");
  assert.equal(plan.plan.weekStartsOn, "Monday");
  assert.equal(plan.plan.scheduleVersion, 4);
  assert.equal(plan.plan.coverageRevisionEffectiveAfter, "2026-07-29");
  assert.equal(plan.plan.exerciseRecordCount, 45);
  assert.equal(plan.plan.currentExerciseCount, 42);
  assert.equal(plan.traineeProfile.demographics.sex, "male");
  assert.equal(plan.traineeProfile.demographics.ageYears, 25);
  assert.equal(plan.traineeProfile.demographics.heightCm, 190);
  assert.equal(plan.traineeProfile.demographics.bodyWeightKg, 88);
  assert.equal(plan.calculations.proteinGramsPerKgPerDay.value, 1.76);
  assert.match(plan.planRules.progression, /every working set/);
  assert.match(plan.planRules.moderateAerobic, /talk but not sing/);
  assert.equal(
    plan.traineeProfile.currentBlock.completedSessions.length,
    2,
  );
  assert.ok(plan.validationReadiness.auditChecklist.length >= 10);
  assert.ok(plan.validationReadiness.openQuestions.length >= 8);
  assert.equal(plan.days.length, 7);
  assert.equal(exerciseCount, 45);
  assert.equal(plan.days[0].weekday, "Monday");
  assert.equal(plan.days[0].title, "Strength A");
  assert.equal(plan.days[0].exercises[1].week4Prescription, "2 × 4–8");
  assert.equal(
    plan.days[2].exercises.find((exercise) => exercise.id === "c-face-pull").name,
    "Band pull-apart",
  );
  assert.equal(
    plan.days[0].exercises.find((exercise) => exercise.id === "a-core").endsOn,
    "2026-07-29",
  );
  assert.equal(
    plan.days[0].exercises.find((exercise) => exercise.id === "a-reverse-crunch")
      .startsAfter,
    "2026-07-29",
  );
  assert.equal(
    plan.days[4].exercises.find((exercise) => exercise.id === "e-dip")
      .week4Prescription,
    "2 × 5–10",
  );
  assert.equal(
    plan.days[1].exercises.find((exercise) => exercise.id === "b-hang").omitInWeek4,
    true,
  );
  assert.equal(plan.days[6].weekday, "Sunday");
  assert.equal(plan.days[6].title, "Full rest");
  assert.equal(plan.days[6].exercises.length, 2);
  assert.equal(
    plan.days[6].exercises.some(
      (exercise) => exercise.startsAfter === "2026-07-29",
    ),
    false,
  );
  assert.equal(plan.weekGuidance.length, 4);
});
