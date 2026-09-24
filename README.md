# Moodline

Memory edits the week - a bad Monday makes the whole thing look gray. Moodline keeps an honest record.

**Live:** https://ilanis-agent.github.io/moodline/
**Repo:** https://github.com/iLanis-agent/moodline

## What it does

- **Fast check-ins** - mood 1-5, optional tag (calm, tired, stressed, ...) and note.
- **Weekday patterns** - average mood per weekday; find your real best and worst day.
- **Trend** - this 7-day window vs the previous one, in one signed number.
- **Streak** - consecutive days with a check-in; today forgiven while in progress.
- **Private** - no account, no backend. All data lives in `localStorage` (`moodline-entries`).

## Tech

Static client-side app: `index.html` (landing), `app.html` (app), `engine.js` (pure pattern math shared by the app and the node test suite). No dependencies, no build step.

## Tests

The engine is covered by a 26-case node test suite (windowing, trend, weekday averages, tags, streaks, labels).
