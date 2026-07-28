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
  assert.match(page, /Complete this session/);
  assert.match(page, /Download workout/);
  assert.match(page, /workout-export-card/);
  assert.match(page, /REST/);
  assert.doesNotMatch(`${page}\n${layout}`, /codex-preview|react-loading-skeleton/i);
});

test("removes starter-only product artifacts", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Week \{cycleWeek\}/);
  assert.match(page, /Training place/);
  assert.match(page, /Start \{exercise\.restSeconds\}s rest/);
  assert.match(page, /timer-orbit/);
  assert.match(page, /DEFAULT_PROGRAM_START = "2026-07-28"/);
  assert.match(
    await readFile(new URL("../app/workout-data.ts", import.meta.url), "utf8"),
    /Band Romanian deadlift/,
  );
  assert.match(layout, /Workin — Four-week pull-up training block/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(packageJson, /"html-to-image": "1\.11\.13"/);
  assert.match(page, /toBlob\(exportCardRef\.current/);
  assert.match(page, /workin-day-\$\{day\.day\}-\$\{selectedDate\}\.png/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await assert.rejects(access(new URL("../app/_sites-preview/preview.css", import.meta.url)));
});

test("declares persistent D1 storage", async () => {
  const [hostingText, scheduleMigration] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(
      new URL("../drizzle/0001_aspiring_red_skull.sql", import.meta.url),
      "utf8",
    ),
  ]);
  const hosting = JSON.parse(hostingText);
  assert.equal(hosting.d1, "DB");
  assert.equal(hosting.r2, null);
  assert.match(scheduleMigration, /`start_date` = '2026-07-28'/);
  assert.match(scheduleMigration, /'2026-07-28',\s*1,\s*true/);
  await access(new URL("../db/schema.ts", import.meta.url));
  await access(new URL("../drizzle/0000_brief_shen.sql", import.meta.url));
});
