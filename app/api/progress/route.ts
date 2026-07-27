import { and, eq, gte, lte } from "drizzle-orm";
import { getDb } from "../../../db";
import { programSettings, workoutLogs } from "../../../db/schema";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MAX_NOTES_LENGTH = 4000;
const MAX_PLACE_LENGTH = 100;

function isDateKey(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function addUtcDays(dateKey: string, amount: number) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

function parseExerciseState(value: string) {
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([key, completed]) =>
          /^[a-z0-9-]{1,60}$/.test(key) && typeof completed === "boolean",
      ),
    );
  } catch {
    return {};
  }
}

function serializeLog(log: typeof workoutLogs.$inferSelect | undefined) {
  if (!log) return null;
  return { ...log, exerciseState: parseExerciseState(log.exerciseState) };
}

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table")) {
    return "Workout storage is still being prepared. Please try again shortly.";
  }
  return "The workout log could not be reached. Please try again.";
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");
    const weekStart = url.searchParams.get("weekStart");
    const anchor = url.searchParams.get("anchor");

    if (!isDateKey(date) || !isDateKey(weekStart) || !isDateKey(anchor)) {
      return Response.json({ error: "Valid date parameters are required." }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    await db
      .insert(programSettings)
      .values({ id: 1, startDate: anchor, scheduleVersion: 2, updatedAt: now })
      .onConflictDoNothing();

    const [settings, log, week] = await Promise.all([
      db.select().from(programSettings).where(eq(programSettings.id, 1)).limit(1),
      db.select().from(workoutLogs).where(eq(workoutLogs.date, date)).limit(1),
      db
        .select({ date: workoutLogs.date, completed: workoutLogs.completed })
        .from(workoutLogs)
        .where(
          and(
            gte(workoutLogs.date, weekStart),
            lte(workoutLogs.date, addUtcDays(weekStart, 6)),
          ),
        ),
    ]);

    return Response.json({
      settings: settings[0],
      log: serializeLog(log[0]),
      week,
    });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const date = payload.date;
    const dayIndex = payload.dayIndex;
    const completed = payload.completed;
    const exerciseState = payload.exerciseState;
    const place = typeof payload.place === "string" ? payload.place.trim() : "";
    const notes = typeof payload.notes === "string" ? payload.notes.trim() : "";
    const energy = payload.energy;

    if (!isDateKey(date)) {
      return Response.json({ error: "A valid workout date is required." }, { status: 400 });
    }
    if (!Number.isInteger(dayIndex) || Number(dayIndex) < 1 || Number(dayIndex) > 7) {
      return Response.json({ error: "Workout day must be between 1 and 7." }, { status: 400 });
    }
    if (typeof completed !== "boolean") {
      return Response.json({ error: "Completion state must be true or false." }, { status: 400 });
    }
    if (!exerciseState || typeof exerciseState !== "object" || Array.isArray(exerciseState)) {
      return Response.json({ error: "Exercise state is invalid." }, { status: 400 });
    }

    const safeExerciseState = Object.fromEntries(
      Object.entries(exerciseState).filter(
        ([key, value]) =>
          /^[a-z0-9-]{1,60}$/.test(key) && typeof value === "boolean",
      ),
    );
    if (Object.keys(safeExerciseState).length > 50) {
      return Response.json({ error: "Too many exercises were submitted." }, { status: 400 });
    }
    if (place.length > MAX_PLACE_LENGTH || notes.length > MAX_NOTES_LENGTH) {
      return Response.json({ error: "Place or notes are too long." }, { status: 400 });
    }
    if (energy !== null && (!Number.isInteger(energy) || Number(energy) < 1 || Number(energy) > 5)) {
      return Response.json({ error: "Energy must be from 1 to 5." }, { status: 400 });
    }

    const db = getDb();
    const values = {
      date,
      dayIndex: Number(dayIndex),
      completed,
      exerciseState: JSON.stringify(safeExerciseState),
      place,
      notes,
      energy: energy === null ? null : Number(energy),
      updatedAt: new Date().toISOString(),
    };

    const [log] = await db
      .insert(workoutLogs)
      .values(values)
      .onConflictDoUpdate({
        target: workoutLogs.date,
        set: values,
      })
      .returning();

    return Response.json({ log: serializeLog(log) });
  } catch (error) {
    return Response.json({ error: errorMessage(error) }, { status: 500 });
  }
}
