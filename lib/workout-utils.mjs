const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateKey(dateKey) {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    throw new TypeError("Expected a date in YYYY-MM-DD format.");
  }

  const date = new Date(`${dateKey}T12:00:00`);
  if (Number.isNaN(date.getTime()) || toLocalDateKey(date) !== dateKey) {
    throw new TypeError("Expected a real calendar date.");
  }
  return date;
}

export function toLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return toLocalDateKey(date);
}

export function getMonday(dateKey) {
  const date = parseDateKey(dateKey);
  const offset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - offset);
  return toLocalDateKey(date);
}

export function getDayIndex(dateKey) {
  const day = parseDateKey(dateKey).getDay();
  return day === 0 ? 7 : day;
}

export function getCycleWeek(startDateKey, selectedDateKey) {
  const start = parseDateKey(startDateKey);
  const selected = parseDateKey(selectedDateKey);
  const days = Math.floor((selected.getTime() - start.getTime()) / 86_400_000);
  if (days < 0) return 1;
  return (Math.floor(days / 7) % 4) + 1;
}

export function formatTimer(totalSeconds) {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}
