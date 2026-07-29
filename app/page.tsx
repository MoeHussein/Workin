"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addDays,
  formatTimer,
  getCycleWeek,
  getProgramDayIndex,
  getProgramWeekStart,
  parseDateKey,
  toLocalDateKey,
} from "../lib/workout-utils.mjs";
import { weekGuidance, workoutDays } from "./workout-data";

type ExerciseState = Record<string, boolean>;

type WorkoutLog = {
  completed: boolean;
  energy: number | null;
  exerciseState: ExerciseState;
  notes: string;
  place: string;
};

const emptyLog: WorkoutLog = {
  completed: false,
  energy: null,
  exerciseState: {},
  notes: "",
  place: "",
};

const DEFAULT_PROGRAM_START = "2026-07-27";
const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
});
const weekdayFormatter = new Intl.DateTimeFormat("en", { weekday: "short" });
const fullDateFormatter = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function pdfText(value: string) {
  return value.replace(/[–—−]/g, "-").replace(/\u00a0/g, " ");
}

export default function Home() {
  const [selectedDate, setSelectedDate] = useState("");
  const [programStart, setProgramStart] = useState("");
  const [log, setLog] = useState<WorkoutLog>(emptyLog);
  const [weeklyCompleted, setWeeklyCompleted] = useState<Set<string>>(new Set());
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [timerDuration, setTimerDuration] = useState(90);
  const [remaining, setRemaining] = useState(90);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerNotice, setTimerNotice] = useState("");
  const [downloadState, setDownloadState] = useState<"idle" | "creating" | "done" | "error">(
    "idle",
  );
  const [weeklyPdfState, setWeeklyPdfState] = useState<
    "idle" | "creating" | "done" | "error"
  >("idle");
  const [weeklyPdfProgress, setWeeklyPdfProgress] = useState(0);
  const exportCardRef = useRef<HTMLElement>(null);
  const weeklyPdfRef = useRef<HTMLElement>(null);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const latestSaveId = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const today = toLocalDateKey(new Date());
      setSelectedDate(today);
      setProgramStart(DEFAULT_PROGRAM_START);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const dayIndex =
    selectedDate && programStart ? getProgramDayIndex(programStart, selectedDate) : 1;
  const day = workoutDays[dayIndex - 1];
  const weekStart =
    selectedDate && programStart
      ? getProgramWeekStart(programStart, selectedDate)
      : "";
  const cycleWeek =
    selectedDate && programStart ? getCycleWeek(programStart, selectedDate) : 1;
  const guidance = weekGuidance[cycleWeek - 1];
  const weekDates = useMemo(
    () => (weekStart ? Array.from({ length: 7 }, (_, index) => addDays(weekStart, index)) : []),
    [weekStart],
  );

  useEffect(() => {
    if (!selectedDate || !weekStart || !programStart) return;
    const controller = new AbortController();

    async function loadProgress() {
      setLoadState("loading");
      setMessage("");
      try {
        const params = new URLSearchParams({
          date: selectedDate,
          weekStart,
          anchor: programStart,
        });
        const response = await fetch(`/api/progress?${params}`, {
          signal: controller.signal,
        });
        const data = (await response.json()) as {
          error?: string;
          log?: WorkoutLog | null;
          settings?: { startDate?: string };
          week?: { date: string; completed: boolean }[];
        };
        if (!response.ok) throw new Error(data.error || "Progress could not be loaded.");

        setLog(data.log ?? emptyLog);
        setProgramStart(data.settings?.startDate ?? programStart);
        setWeeklyCompleted(
          new Set((data.week ?? []).filter((item) => item.completed).map((item) => item.date)),
        );
        setLoadState("ready");
        setSaveState("idle");
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadState("error");
        setMessage(error instanceof Error ? error.message : "Progress could not be loaded.");
      }
    }

    void loadProgress();
    return () => controller.abort();
  }, [programStart, selectedDate, weekStart]);

  const persist = useCallback(
    (snapshot: WorkoutLog) => {
      if (!selectedDate) return;
      const saveId = ++latestSaveId.current;
      setSaveState("saving");
      setMessage("");

      saveQueue.current = saveQueue.current
        .catch(() => undefined)
        .then(async () => {
          const response = await fetch("/api/progress", {
            method: "PATCH",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              date: selectedDate,
              dayIndex,
              ...snapshot,
            }),
          });
          const data = (await response.json()) as { error?: string };
          if (!response.ok) throw new Error(data.error || "Progress could not be saved.");

          setWeeklyCompleted((current) => {
            const next = new Set(current);
            if (snapshot.completed) next.add(selectedDate);
            else next.delete(selectedDate);
            return next;
          });
          if (latestSaveId.current === saveId) setSaveState("saved");
        })
        .catch((error: unknown) => {
          if (latestSaveId.current === saveId) {
            setSaveState("error");
            setMessage(error instanceof Error ? error.message : "Progress could not be saved.");
          }
        });
    },
    [dayIndex, selectedDate],
  );

  function updateLog(patch: Partial<WorkoutLog>, saveNow = true) {
    setLog((current) => {
      const next = { ...current, ...patch };
      if (saveNow) persist(next);
      return next;
    });
  }

  function toggleExercise(exerciseId: string) {
    const exerciseState = {
      ...log.exerciseState,
      [exerciseId]: !log.exerciseState[exerciseId],
    };
    updateLog({ exerciseState });
  }

  function saveNotes() {
    persist(log);
  }

  function startRest(seconds: number) {
    setTimerDuration(seconds);
    setRemaining(seconds);
    setTimerRunning(true);
    setTimerNotice("");
  }

  async function downloadWorkout() {
    if (
      !exportCardRef.current ||
      !selectedDate ||
      downloadState === "creating" ||
      weeklyPdfState === "creating"
    ) {
      return;
    }

    setWeeklyPdfState("idle");
    setDownloadState("creating");
    try {
      const { toBlob } = await import("html-to-image");
      const blob = await toBlob(exportCardRef.current, {
        backgroundColor: "#141513",
        cacheBust: true,
        pixelRatio: 1,
      });
      if (!blob) throw new Error("The workout image could not be created.");

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `workin-day-${day.day}-${selectedDate}.png`;
      link.href = objectUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1_000);
      setDownloadState("done");
      window.setTimeout(() => setDownloadState("idle"), 2_500);
    } catch {
      setDownloadState("error");
    }
  }

  async function downloadCompleteWorkout() {
    if (
      !weeklyPdfRef.current ||
      !weekStart ||
      weekDates.length !== 7 ||
      weeklyPdfState === "creating" ||
      downloadState === "creating"
    ) {
      return;
    }

    const pages = Array.from(
      weeklyPdfRef.current.querySelectorAll<HTMLElement>("[data-weekly-pdf-page]"),
    );
    if (pages.length !== 7) {
      setWeeklyPdfState("error");
      return;
    }

    setDownloadState("idle");
    setWeeklyPdfState("creating");
    setWeeklyPdfProgress(0);
    try {
      const [{ toJpeg }, { jsPDF }] = await Promise.all([
        import("html-to-image"),
        import("jspdf"),
      ]);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
        putOnlyUsedFonts: true,
      });

      for (let index = 0; index < pages.length; index += 1) {
        const pageImage = await toJpeg(pages[index], {
          backgroundColor: "#141513",
          cacheBust: true,
          pixelRatio: 1.4,
          quality: 0.92,
        });
        if (index > 0) pdf.addPage("a4", "portrait");
        pdf.addImage(pageImage, "JPEG", 0, 0, 210, 297, undefined, "FAST");
        setWeeklyPdfProgress(index + 1);
        await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
      }

      pdf.save(`workin-week-${weekStart}.pdf`);
      setWeeklyPdfState("done");
      window.setTimeout(() => setWeeklyPdfState("idle"), 2_500);
    } catch {
      setWeeklyPdfState("error");
    }
  }

  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current > 1) return current - 1;
        window.clearInterval(interval);
        setTimerRunning(false);
        setTimerNotice("Rest complete");
        if ("vibrate" in navigator) navigator.vibrate([180, 90, 180]);
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const activeExercises = day.exercises.filter(
    (exercise) => !exercise.startsAfter || selectedDate > exercise.startsAfter,
  );
  const completedExercises = activeExercises.filter(
    (exercise) => log.exerciseState[exercise.id],
  ).length;
  const progress = activeExercises.length
    ? Math.round((completedExercises / activeExercises.length) * 100)
    : 0;
  const timerProgress = timerDuration > 0 ? (remaining / timerDuration) * 360 : 0;
  const selectedDateLabel = selectedDate
    ? fullDateFormatter.format(parseDateKey(selectedDate))
    : "Loading today";

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#today" aria-label="Workin home">
          <Image
            className="brand-logo"
            src="/workin-logo.png"
            alt="Workin"
            width={68}
            height={55}
            priority
          />
        </a>
        <a className="audit-link" href="#guide">
          Plan guide <span aria-hidden="true">↓</span>
        </a>
      </header>

      <section className="week-strip" aria-label="Select a workout day">
        <div className="week-strip-heading">
          <div>
            <span>THIS WEEK</span>
            <strong>{weekStart ? monthFormatter.format(parseDateKey(weekStart)) : "—"}</strong>
          </div>
          <span>{weeklyCompleted.size}/7 logged</span>
        </div>
        <div className="day-picker">
          {weekDates.map((date) => {
            const isSelected = date === selectedDate;
            const isDone = weeklyCompleted.has(date);
            return (
              <button
                className={`day-pill ${isSelected ? "selected" : ""} ${isDone ? "done" : ""}`}
                key={date}
                onClick={() => setSelectedDate(date)}
                aria-pressed={isSelected}
                type="button"
              >
                <span>{weekdayFormatter.format(parseDateKey(date)).toUpperCase()}</span>
                <strong>{parseDateKey(date).getDate()}</strong>
                <i aria-hidden="true">{isDone ? "✓" : ""}</i>
              </button>
            );
          })}
        </div>
      </section>

      <section className="today-grid">
        <article className="session-panel">
          <div className="session-heading">
            <div>
              <div className="date-nav">
                <button
                  type="button"
                  onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                  disabled={!selectedDate}
                  aria-label="Previous day"
                >
                  ←
                </button>
                <span>{selectedDateLabel}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                  disabled={!selectedDate}
                  aria-label="Next day"
                >
                  →
                </button>
              </div>
              <p className="session-eyebrow">DAY {day.day} · {day.eyebrow}</p>
              <h2>{day.title}</h2>
              <p className="session-summary">{day.summary}</p>
            </div>
            <div
              className="progress-ring"
              style={{ "--progress": `${progress * 3.6}deg` } as React.CSSProperties}
              aria-label={`${progress}% of exercises checked`}
            >
              <span>{progress}%</span>
            </div>
          </div>

          <div className="session-meta">
            <span>◷ {day.duration}</span>
            <span>◎ {day.intensity}</span>
            <span>W{cycleWeek} · {guidance.label}</span>
          </div>

          <div className="session-actions">
            <button
              className="download-workout-button"
              type="button"
              onClick={downloadWorkout}
              disabled={
                !selectedDate ||
                downloadState === "creating" ||
                weeklyPdfState === "creating"
              }
            >
              <span className="download-arrow" aria-hidden="true" />
              {downloadState === "creating" ? "Designing image…" : "Download today’s workout"}
            </button>
            <button
              className="download-complete-button"
              type="button"
              onClick={downloadCompleteWorkout}
              disabled={
                weekDates.length !== 7 ||
                weeklyPdfState === "creating" ||
                downloadState === "creating"
              }
            >
              <span className="download-arrow" aria-hidden="true" />
              {weeklyPdfState === "creating"
                ? `Creating PDF ${weeklyPdfProgress}/7…`
                : "Download complete workout"}
            </button>
            <span
              className={`download-status ${
                downloadState === "error" || weeklyPdfState === "error" ? "error" : ""
              }`}
              role={
                downloadState === "error" || weeklyPdfState === "error" ? "alert" : "status"
              }
              aria-live="polite"
            >
              {downloadState === "done" && "Workout image downloaded"}
              {downloadState === "error" && "Could not create the image. Please try again."}
              {weeklyPdfState === "done" && "Complete weekly PDF downloaded"}
              {weeklyPdfState === "error" && "Could not create the PDF. Please try again."}
            </span>
          </div>

          <div className="week-guidance">
            <strong>Week {cycleWeek} · {guidance.label}</strong>
            <span>{guidance.guidance}</span>
          </div>

          {loadState === "loading" && (
            <div className="status-box" role="status">Loading your saved session…</div>
          )}
          {loadState === "error" && (
            <div className="status-box error" role="alert">{message}</div>
          )}

          <div className={`exercise-list ${loadState !== "ready" ? "muted" : ""}`}>
            {day.exercises.map((exercise, index) => {
              const checked = Boolean(log.exerciseState[exercise.id]);
              const deferred = Boolean(
                exercise.startsAfter && selectedDate <= exercise.startsAfter,
              );
              return (
                <article
                  className={`exercise-card ${checked ? "checked" : ""} ${deferred ? "deferred" : ""}`}
                  key={exercise.id}
                >
                  <button
                    className="exercise-check"
                    type="button"
                    onClick={() => toggleExercise(exercise.id)}
                    disabled={loadState !== "ready" || deferred}
                    aria-pressed={checked}
                    aria-label={`${checked ? "Mark incomplete" : "Mark complete"}: ${exercise.name}`}
                  >
                    <span>{checked ? "✓" : String(index + 1).padStart(2, "0")}</span>
                  </button>
                  <div className="exercise-main">
                    <div className="exercise-title-row">
                      <h3>{exercise.name}</h3>
                      {exercise.optional && <span className="optional-tag">OPTIONAL</span>}
                      {deferred && <span className="optional-tag next-tag">NEXT DAY 1</span>}
                    </div>
                    <strong>{exercise.prescription}</strong>
                    <p>{exercise.cue}</p>
                    <div className="exercise-actions">
                      {exercise.restSeconds && !deferred && (
                        <button type="button" onClick={() => startRest(exercise.restSeconds!)}>
                          Start {exercise.restSeconds}s rest
                        </button>
                      )}
                      {exercise.demoUrl && (
                        <a href={exercise.demoUrl} target="_blank" rel="noreferrer">
                          Form demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="complete-row">
            <button
              className={`complete-button ${log.completed ? "is-complete" : ""}`}
              type="button"
              onClick={() => updateLog({ completed: !log.completed })}
              disabled={loadState !== "ready"}
            >
              <span>{log.completed ? "✓" : "○"}</span>
              {log.completed ? "Session completed" : "Complete this session"}
            </button>
            <p>Optional items may be skipped. Completion is your judgment, not a punishment.</p>
          </div>
        </article>

        <aside className="side-column">
          <details className="notes-card card">
            <summary>Session notes <span>+</span></summary>
            <div className="notes-content">
            <div className="card-label">SESSION LOG</div>
            <label htmlFor="place">Training place</label>
            <input
              id="place"
              value={log.place}
              maxLength={100}
              placeholder="Home, park, gym…"
              onChange={(event) => updateLog({ place: event.target.value }, false)}
              disabled={loadState !== "ready"}
            />

            <fieldset>
              <legend>Energy before training</legend>
              <div className="energy-row">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    type="button"
                    key={value}
                    className={log.energy === value ? "selected" : ""}
                    onClick={() => updateLog({ energy: value })}
                    disabled={loadState !== "ready"}
                    aria-pressed={log.energy === value}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={log.notes}
              maxLength={4000}
              placeholder="Band color, reps, pain, what felt better…"
              onChange={(event) => updateLog({ notes: event.target.value }, false)}
              disabled={loadState !== "ready"}
            />
            <div className="save-notes-row">
              <button type="button" onClick={saveNotes} disabled={loadState !== "ready"}>
                Save place & notes
              </button>
              <span className={saveState === "error" ? "save-error" : ""} aria-live="polite">
                {saveState === "saving" && "Saving…"}
                {saveState === "saved" && "Saved"}
                {saveState === "error" && "Not saved"}
              </span>
            </div>
            {message && saveState === "error" && <p className="inline-error">{message}</p>}
            </div>
          </details>

          {day.strengthDay && (
            <details className="minimum-card card">
              <summary>Low-energy version <span>+</span></summary>
              <p>Use this instead of today’s full strength session—not as extra work.</p>
              <ol>
                <li>1 set assisted pull-ups</li>
                <li>1 set push-ups</li>
                <li>1 set squats or split squats</li>
                <li>10-minute brisk walk</li>
              </ol>
            </details>
          )}
        </aside>
      </section>

      <section className="rules-section">
        <div className="section-heading">
          <p className="kicker">PROGRESSION, WITHOUT THE NOISE</p>
          <h2>One variable at a time.</h2>
        </div>
        <div className="rule-grid">
          <article>
            <span>01</span>
            <h3>Own the range</h3>
            <p>Reach the top of the rep range on every prescribed set with clean form—twice.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Then progress</h3>
            <p>Use slightly less band assistance, a harder variation, or modest backpack load.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Do not stack changes</h3>
            <p>Change one thing, keep 1–3 reps in reserve, and watch recovery for a full week.</p>
          </article>
        </div>
        <div className="pain-rule">
          <strong>Sharp or increasing joint pain is a stop signal.</strong>
          <p>
            Muscle effort is expected; shoulder, elbow, or forearm pain that changes your movement
            is not. Stop that exercise and seek qualified medical or rehabilitation advice if it persists.
          </p>
        </div>
      </section>

      <section className="audit-section" id="audit">
        <div className="audit-heading">
          <p className="kicker">EVIDENCE + REAL-WORLD CHECK</p>
          <h2>What was changed, and why.</h2>
          <p>
            This separates established guidance, our plan-level inference, and anecdotal user reports.
            That distinction matters.
          </p>
        </div>
        <div className="audit-grid">
          <article className="audit-card strong">
            <span className="audit-type">ESTABLISHED GUIDANCE</span>
            <h3>Bands and bodyweight are valid resistance tools.</h3>
            <p>
              ACSM’s 2026 review supports elastic bands, bodyweight, and home-based training.
              It emphasizes training major muscle groups at least twice weekly and consistency over complexity.
            </p>
          </article>
          <article className="audit-card inference">
            <span className="audit-type">OUR INFERENCE</span>
            <h3>The original pulling dose was unnecessarily aggressive.</h3>
            <p>
              Counting pull-ups, rows, scapular pulls, negatives, and hangs produced a high weekly
              upper-pull exposure for a beginner-plus trainee. Three balanced exposures are easier to recover from.
            </p>
          </article>
          <article className="audit-card anecdote">
            <span className="audit-type">AUTHENTIC ANECDOTES</span>
            <h3>Band versus negative pull-ups is not settled by reviews.</h3>
            <p>
              Community reports conflict: some users credit negatives, others bands, and several describe
              forearm or elbow problems after negatives. These are genuine experiences, not controlled evidence.
            </p>
          </article>
          <article className="audit-card changed">
            <span className="audit-type">PROGRAM CHANGE</span>
            <h3>Negatives became optional; dips were removed.</h3>
            <p>
              Negatives now require a pain-free controlled descent. Dips were removed because the listed
              equipment does not include stable dip bars and push-ups already cover horizontal pressing.
            </p>
          </article>
        </div>

        <div className="source-list">
          <div>
            <span>01</span>
            <a
              href="https://acsm.org/resistance-training-guidelines-update-2026/"
              target="_blank"
              rel="noreferrer"
            >
              ACSM 2026 resistance-training position stand summary
            </a>
            <em>Current evidence synthesis</em>
          </div>
          <div>
            <span>02</span>
            <a
              href="https://www.who.int/news-room/fact-sheets/detail/physical-activity"
              target="_blank"
              rel="noreferrer"
            >
              WHO physical activity fact sheet
            </a>
            <em>Current public-health target</em>
          </div>
          <div>
            <span>03</span>
            <a
              href="https://www.reddit.com/r/bodyweightfitness/comments/1b327xj/routine_for_pullups/"
              target="_blank"
              rel="noreferrer"
            >
              2024 pull-up progression discussion
            </a>
            <em>Anecdotal, mixed experience</em>
          </div>
          <div>
            <span>04</span>
            <a
              href="https://www.reddit.com/r/bodyweightfitness/comments/jdqigi/i_did_my_first_pullup_today_dont_use_banded/"
              target="_blank"
              rel="noreferrer"
            >
              Bands versus negatives discussion
            </a>
            <em>Anecdotal, includes adverse experiences</em>
          </div>
        </div>

        <div className="truth-note">
          <strong>No authentic reviews exist for this exact plan.</strong>
          <p>
            It is a bespoke, unpublished program. Claims that “real users reviewed this plan” would be invented.
            The assessment above compares its ingredients and dosage with current guidance and openly identified
            community reports.
          </p>
        </div>
      </section>

      <footer>
        <div>
          <Image
            className="brand-logo footer-brand-logo"
            src="/workin-logo.png"
            alt="Workin"
            width={58}
            height={47}
          />
          <p>Workin · A practical four-week block. Not medical care or individualized coaching.</p>
        </div>
        <a href="#today">Back to today ↑</a>
      </footer>

      <section className="workout-export-stage" aria-hidden="true">
        <article className="workout-export-card" ref={exportCardRef}>
          <header className="export-header">
            <div className="export-brand">
              <Image
                className="export-brand-logo"
                src="/workin-logo.png"
                alt="Workin"
                width={78}
                height={63}
              />
            </div>
            <p>4-week pull-up block</p>
          </header>

          <div className="export-hero">
            <p>DAY {day.day} · WEEK {cycleWeek}</p>
            <h2>{day.title}</h2>
            <span>{selectedDateLabel}</span>
          </div>

          <div className="export-meta">
            <span>{day.duration}</span>
            <span>{day.intensity}</span>
            <span>{guidance.label}</span>
          </div>

          <div className="export-exercises">
            {activeExercises.map((exercise, index) => (
              <section className="export-exercise" key={exercise.id}>
                <span className="export-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="export-exercise-title">
                    <h3>{exercise.name}</h3>
                    {exercise.optional && <span>OPTIONAL</span>}
                  </div>
                  <strong>{exercise.prescription}</strong>
                  <p>{exercise.cue}</p>
                </div>
              </section>
            ))}
          </div>

          <footer className="export-footer">
            <strong>Move well. Leave 1–3 good reps in reserve.</strong>
            <span>WORKIN · {selectedDate}</span>
          </footer>
        </article>
      </section>

      <section className="weekly-pdf-export-stage" ref={weeklyPdfRef} aria-hidden="true">
        {workoutDays.map((weeklyDay, index) => {
          const scheduledDate = weekDates[index] ?? "";
          const scheduledExercises = weeklyDay.exercises.filter(
            (exercise) => !exercise.startsAfter || scheduledDate > exercise.startsAfter,
          );
          const scheduledDateLabel = scheduledDate
            ? fullDateFormatter.format(parseDateKey(scheduledDate))
            : `Day ${weeklyDay.day}`;

          return (
            <article
              className="weekly-pdf-page"
              data-weekly-pdf-page
              key={weeklyDay.day}
            >
              <header className="weekly-pdf-header">
                <div className="weekly-pdf-brand">
                  <Image
                    className="weekly-pdf-brand-logo"
                    src="/workin-logo.png"
                    alt="Workin"
                    width={62}
                    height={50}
                  />
                  <small>Complete weekly workout</small>
                </div>
                <p>WEEK {cycleWeek} / 4</p>
              </header>

              <div className="weekly-pdf-hero">
                <div>
                  <p>DAY {weeklyDay.day}</p>
                  <h2>{pdfText(weeklyDay.title)}</h2>
                  <span>{pdfText(scheduledDateLabel)}</span>
                </div>
                <strong>{String(weeklyDay.day).padStart(2, "0")}</strong>
              </div>

              <p className="weekly-pdf-summary">{pdfText(weeklyDay.summary)}</p>

              <div className="weekly-pdf-meta">
                <span>{pdfText(weeklyDay.duration)}</span>
                <span>{pdfText(weeklyDay.intensity)}</span>
                <span>{pdfText(guidance.label)}</span>
              </div>

              <div className="weekly-pdf-exercises">
                {scheduledExercises.map((exercise, exerciseIndex) => (
                  <section className="weekly-pdf-exercise" key={exercise.id}>
                    <span>{String(exerciseIndex + 1).padStart(2, "0")}</span>
                    <div>
                      <div>
                        <h3>{pdfText(exercise.name)}</h3>
                        {exercise.optional && <small>OPTIONAL</small>}
                      </div>
                      <strong>{pdfText(exercise.prescription)}</strong>
                      <p>{pdfText(exercise.cue)}</p>
                    </div>
                  </section>
                ))}
              </div>

              <footer className="weekly-pdf-footer">
                <strong>Move well. Leave 1-3 good reps in reserve.</strong>
                <span>WORKIN · PAGE {index + 1} / 7</span>
              </footer>
            </article>
          );
        })}
      </section>

      <details className="plan-guide" id="guide">
        <summary>Plan guide <span>+</span></summary>
        <div className="guide-grid">
          <p><strong>Progress:</strong> reach the top of a rep range with clean form twice, then change one variable.</p>
          <p><strong>Effort:</strong> keep roughly 1–3 good reps in reserve so the next session is repeatable.</p>
          <p><strong>Safety:</strong> stop if pain is sharp, increasing, or changes your movement.</p>
        </div>
      </details>

      <section className={`timer-dock ${timerRunning ? "running" : ""}`} aria-label="Rest timer">
        <div
          className="timer-orbit"
          style={{ "--timer-progress": `${timerProgress}deg` } as React.CSSProperties}
        >
          <div className="timer-readout">
            <span>REST</span>
            <strong>{formatTimer(remaining)}</strong>
          </div>
        </div>
        <div className="timer-tools">
          <div className="timer-presets" aria-label="Timer presets">
            {[60, 90, 120].map((seconds) => (
              <button
                type="button"
                key={seconds}
                className={timerDuration === seconds ? "selected" : ""}
                onClick={() => {
                  setTimerDuration(seconds);
                  setRemaining(seconds);
                  setTimerRunning(false);
                  setTimerNotice("");
                }}
              >
                {seconds}s
              </button>
            ))}
          </div>
          <div className="timer-actions">
            <button
              className="timer-control"
              type="button"
              onClick={() => {
                if (remaining === 0) setRemaining(timerDuration);
                setTimerRunning((current) => !current);
                setTimerNotice("");
              }}
            >
              {timerRunning ? "Pause" : remaining === 0 ? "Again" : "Start"}
            </button>
            <button
              className="timer-reset"
              type="button"
              onClick={() => {
                setTimerRunning(false);
                setRemaining(timerDuration);
                setTimerNotice("");
              }}
              aria-label="Reset timer"
            >
              ↺
            </button>
          </div>
        </div>
        <span className="sr-only" aria-live="assertive">{timerNotice}</span>
      </section>
    </main>
  );
}
