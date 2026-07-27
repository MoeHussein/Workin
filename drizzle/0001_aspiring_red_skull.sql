ALTER TABLE `program_settings` ADD `schedule_version` integer DEFAULT 2 NOT NULL;
--> statement-breakpoint
UPDATE `program_settings`
SET `start_date` = '2026-07-28',
    `schedule_version` = 2,
    `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 1;
--> statement-breakpoint
INSERT INTO `workout_logs` (
  `date`,
  `day_index`,
  `completed`,
  `exercise_state`,
  `place`,
  `energy`,
  `notes`,
  `updated_at`
) VALUES (
  '2026-07-28',
  1,
  true,
  '{"a-warmup":true,"a-pullup":true,"a-pushup":true,"a-split-squat":true,"a-row":true,"a-core":true,"a-walk":true}',
  '',
  NULL,
  'Completed every original Day 1 exercise with no issues. The session felt easy and smooth.',
  CURRENT_TIMESTAMP
)
ON CONFLICT(`date`) DO UPDATE SET
  `day_index` = 1,
  `completed` = true,
  `exercise_state` = excluded.`exercise_state`,
  `notes` = CASE
    WHEN `workout_logs`.`notes` = '' THEN excluded.`notes`
    ELSE `workout_logs`.`notes`
  END,
  `updated_at` = CURRENT_TIMESTAMP;
