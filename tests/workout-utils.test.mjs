import assert from "node:assert/strict";
import test from "node:test";
import {
  addDays,
  formatTimer,
  getCycleWeek,
  getDayIndex,
  getMonday,
  getProgramDayIndex,
  getProgramWeekStart,
  parseDateKey,
} from "../lib/workout-utils.mjs";

test("maps calendar dates to the Monday-first workout week", () => {
  assert.equal(getMonday("2026-07-27"), "2026-07-27");
  assert.equal(getMonday("2026-08-02"), "2026-07-27");
  assert.equal(getDayIndex("2026-07-27"), 1);
  assert.equal(getDayIndex("2026-08-02"), 7);
});

test("anchors the personal program week to Tuesday", () => {
  assert.equal(getProgramDayIndex("2026-07-28", "2026-07-28"), 1);
  assert.equal(getProgramDayIndex("2026-07-28", "2026-08-03"), 7);
  assert.equal(getProgramDayIndex("2026-07-28", "2026-08-04"), 1);
  assert.equal(getProgramWeekStart("2026-07-28", "2026-08-03"), "2026-07-28");
  assert.equal(getProgramWeekStart("2026-07-28", "2026-08-04"), "2026-08-04");
});

test("handles month boundaries and the repeating four-week cycle", () => {
  assert.equal(addDays("2026-07-31", 1), "2026-08-01");
  assert.equal(getCycleWeek("2026-07-27", "2026-07-27"), 1);
  assert.equal(getCycleWeek("2026-07-27", "2026-08-17"), 4);
  assert.equal(getCycleWeek("2026-07-27", "2026-08-24"), 1);
});

test("rejects impossible dates and formats timer boundaries", () => {
  assert.throws(() => parseDateKey("2026-02-30"), /real calendar date/);
  assert.throws(() => parseDateKey("27-07-2026"), /YYYY-MM-DD/);
  assert.equal(formatTimer(0), "0:00");
  assert.equal(formatTimer(90), "1:30");
  assert.equal(formatTimer(-5), "0:00");
});
