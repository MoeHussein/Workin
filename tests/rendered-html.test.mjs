import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("builds the complete Workin product shell", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  await access(new URL("../out/index.html", import.meta.url));
  assert.match(layout, /Workin — Six-week calisthenics training block/);
  assert.match(page, /Plan guide/);
  assert.match(page, /Download today’s workout/);
  assert.match(page, /Download complete workout/);
  assert.match(page, /weekly-pdf-page/);
  assert.match(page, /timer-orbit/);
  assert.match(page, /DEFAULT_PROGRAM_START = "2026-08-24"/);
  assert.match(page, /workin:progress:v5/);
  assert.match(page, /WEEK \{cycleWeek\} \/ 6/);
  assert.doesNotMatch(`${page}\n${layout}`, /codex-preview|react-loading-skeleton/i);
});

test("contains the V2 plan and the approved bonus movements", async () => {
  const workoutData = await readFile(
    new URL("../app/workout-data.ts", import.meta.url),
    "utf8",
  );
  for (const expected of [
    'name: "Walking lunge"',
    'name: "Band face pull to external rotation"',
    'name: "Band lateral raise"',
    'name: "Band hammer curl"',
    'name: "Elevated close-grip push-up"',
    'name: "Band overhead triceps extension"',
    'name: "Wall tibialis raise"',
    'name: "Side plank"',
  ]) {
    assert.match(workoutData, new RegExp(expected));
  }
  assert.doesNotMatch(workoutData, /Bulgarian split squat/);
  assert.match(workoutData, /weekPrescriptions: \{ 6: "2 × 1–2" \}/);
  assert.match(workoutData, /week: 6/);
});

test("keeps GitHub Pages deployment, local persistence, and download layout", async () => {
  const [workflow, nextConfig, page, css, packageJson] = await Promise.all([
    readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /NEXT_PUBLIC_BASE_PATH: \/Workin/);
  assert.match(nextConfig, /output: "export"/);
  assert.match(page, /window\.localStorage\.setItem/);
  assert.match(page, /pdf\.addImage\(pageImage, "JPEG", 0, 0, 210, 297/);
  assert.match(css, /\.weekly-pdf-meta span \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.session-meta span \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.export-meta span \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.download-workout-button \{[\s\S]*?white-space: nowrap;/);
  assert.match(css, /\.download-complete-button \{[\s\S]*?white-space: nowrap;/);
  assert.match(packageJson, /"html-to-image": "1\.11\.13"/);
  assert.match(packageJson, /"jspdf": "4\.2\.1"/);
  await assert.rejects(access(new URL("../.openai/hosting.json", import.meta.url)));
  await assert.rejects(access(new URL("../app/api/progress/route.ts", import.meta.url)));
});

test("exports a review-ready six-week JSON plan", async () => {
  const plan = JSON.parse(
    await readFile(new URL("../exports/workin-plan.json", import.meta.url), "utf8"),
  );
  const exerciseCount = plan.days.reduce(
    (total, day) => total + day.exercises.length,
    0,
  );
  assert.equal(plan.schemaVersion, 3);
  assert.equal(plan.plan.programStartDate, "2026-08-24");
  assert.equal(plan.plan.weekStartsOn, "Monday");
  assert.equal(plan.plan.scheduleVersion, 5);
  assert.equal(plan.plan.cycleLengthWeeks, 6);
  assert.equal(plan.plan.exerciseRecordCount, exerciseCount);
  assert.equal(plan.traineeProfile.demographics.ageYears, 25);
  assert.equal(plan.traineeProfile.demographics.heightCm, 190);
  assert.equal(plan.traineeProfile.demographics.bodyWeightKg, 88);
  assert.equal(plan.traineeProfile.nutrition.proteinTargetGramsPerKgPerDay, 1.76);
  assert.equal(plan.days.length, 7);
  assert.equal(plan.weekGuidance.length, 6);
  assert.equal(plan.days[0].weekday, "Monday");
  assert.equal(
    plan.days[0].exercises.find((exercise) => exercise.id === "a-walking-lunge").name,
    "Walking lunge",
  );
  assert.equal(
    plan.days[0].exercises.find((exercise) => exercise.id === "a-triceps-extension")
      .weekPrescriptions["6"],
    "1 × 12–20",
  );
  assert.equal(
    plan.days[2].exercises.find((exercise) => exercise.id === "c-face-pull").name,
    "Band face pull to external rotation",
  );
  assert.equal(
    plan.days[2].exercises.find((exercise) => exercise.id === "c-tibialis").cue
      .startsWith("BONUS"),
    true,
  );
  assert.equal(
    plan.days[4].exercises.find((exercise) => exercise.id === "e-side-plank").cue
      .startsWith("BONUS"),
    true,
  );
  assert.equal(plan.days[6].weekday, "Sunday");
  assert.equal(plan.days[6].title, "Complete rest");
});
