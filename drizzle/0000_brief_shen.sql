CREATE TABLE `program_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`start_date` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`date` text PRIMARY KEY NOT NULL,
	`day_index` integer NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`exercise_state` text DEFAULT '{}' NOT NULL,
	`place` text DEFAULT '' NOT NULL,
	`energy` integer,
	`notes` text DEFAULT '' NOT NULL,
	`updated_at` text NOT NULL
);
