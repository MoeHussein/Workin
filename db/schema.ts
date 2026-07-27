import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const programSettings = sqliteTable("program_settings", {
  id: integer("id").primaryKey(),
  startDate: text("start_date").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const workoutLogs = sqliteTable("workout_logs", {
  date: text("date").primaryKey(),
  dayIndex: integer("day_index").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  exerciseState: text("exercise_state").notNull().default("{}"),
  place: text("place").notNull().default(""),
  energy: integer("energy"),
  notes: text("notes").notNull().default(""),
  updatedAt: text("updated_at").notNull(),
});
