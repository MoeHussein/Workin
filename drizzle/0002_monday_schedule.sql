UPDATE `program_settings`
SET `start_date` = '2026-07-27',
    `schedule_version` = 3,
    `updated_at` = CURRENT_TIMESTAMP
WHERE `id` = 1;
--> statement-breakpoint
INSERT OR IGNORE INTO `workout_logs` (
  `date`,
  `day_index`,
  `completed`,
  `exercise_state`,
  `place`,
  `energy`,
  `notes`,
  `updated_at`
)
SELECT
  '2026-07-27',
  1,
  `completed`,
  `exercise_state`,
  `place`,
  `energy`,
  `notes`,
  CURRENT_TIMESTAMP
FROM `workout_logs`
WHERE `date` = '2026-07-28';
--> statement-breakpoint
INSERT OR IGNORE INTO `workout_logs` (
  `date`,
  `day_index`,
  `completed`,
  `exercise_state`,
  `place`,
  `energy`,
  `notes`,
  `updated_at`
) VALUES (
  '2026-07-27',
  1,
  true,
  '{"a-warmup":true,"a-pullup":true,"a-pushup":true,"a-split-squat":true,"a-row":true,"a-core":true,"a-walk":true}',
  '',
  NULL,
  'Completed every original Day 1 exercise with no issues. The session felt easy and smooth.',
  CURRENT_TIMESTAMP
);
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
  2,
  true,
  '{"b-cardio":true,"b-hip":true,"b-chest":true,"b-hang":true}',
  '',
  NULL,
  'Completed the Aerobic Base session.',
  CURRENT_TIMESTAMP
)
ON CONFLICT(`date`) DO UPDATE SET
  `day_index` = 2,
  `completed` = true,
  `exercise_state` = excluded.`exercise_state`,
  `notes` = CASE
    WHEN `workout_logs`.`notes` = ''
      OR `workout_logs`.`notes` LIKE 'Completed every original Day 1%'
    THEN excluded.`notes`
    ELSE `workout_logs`.`notes`
  END,
  `updated_at` = CURRENT_TIMESTAMP;
