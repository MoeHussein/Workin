# Workin

Workin is a phone-first calisthenics workout tracker built around a progressive
four-week program.

[Open the live website](https://moehussein.github.io/Workin/#today)

## Features

- Monday-first weekly workout schedule
- Exercise completion tracking and session notes
- Circular rest timer
- Four-week progression and consolidation rules
- Downloadable daily workout images
- Downloadable complete weekly workout PDFs
- Review-ready JSON plan export
- Private workout logs stored locally in the current browser

## Workout data

The current structured program is available in:

- `app/workout-data.ts` — source used by the website and downloads
- `exports/workin-plan.json` — shareable plan and trainee-profile snapshot
- `exports/workin-whole-body-muscle-audit.md` — documented coverage audit

Exercise changes made in `app/workout-data.ts` automatically flow into the
website, daily workout images, weekly PDFs, and the generated JSON export.

## Local development

Requirements:

- Node.js `>=22.13.0`

```bash
npm install
npm run dev
```

Validation:

```bash
npm run export:plan
npm test
```

## Publishing

Every push to `main` is built and deployed through GitHub Actions to GitHub
Pages. The static deployment stores progress on the device, so workout history
does not automatically sync between different browsers or phones.

## Stack

- React and TypeScript
- Next.js static export
- GitHub Pages and GitHub Actions

## Important note

Workin is a practical training tracker, not medical care or individualized
clinical coaching. Exercise selection and progression should be adjusted when
pain, technique breakdown, or inadequate recovery occurs.
