# Kahekesi

**Try the demo:** https://elshanjh.github.io/kahekesi-demo/ (made-up data, nothing to sign in to; changes stay in your browser)

Kahekesi ("the two of us" in Estonian) is a shared tasks, plans and shopping app for a couple, with points, rewards and a cat mascot. I built it for my own household, and we use it every day.

This repository is a public copy of the real app with the private parts removed. The code is the same as the version we run; only the names are swapped for sample ones and the live database is replaced by demo data.

## The problem

My wife and I kept forgetting things and struggled to schedule them: who said they'd call the landlord, what we ran out of, what was planned for Saturday. We wanted one place to capture ideas, tasks and shopping, put them on a day, and get a small reward for actually doing them.

## What I built

- **One place to capture anything.** Type it in and sort it later: a task for today, a to-do for someone, a shopping item, an idea for the inbox.
- **A day plan by time of day.** Quick tasks, morning, evening, with repeats (daily, weekly, monthly), steps inside bigger tasks, and urgency and importance.
- **Asking each other.** One person can ask the other to do something; it waits as a request until they accept or decline.
- **Points and rewards.** Finished tasks earn points for the person who did them (quick 5, normal 10, big 20). Each person has their own rewards to spend points on, plus one shared goal to save up for together.
- **Agla, our cat, as the mascot.** She pops up with a meow when you finish something, in a different pose each time you open the app. Small, but it's the reason ticking things off feels good.
- **Shopping with memory.** A shared list, "buy again" suggestions with the last price, and logging a shopping trip with prices, amounts, brands and discounts, so the app can work out the price per kg or litre and show a monthly shopping report.
- **Reminders that keep nudging.** Daily, on picked weekdays or on one date, repeating every few minutes until ticked. You can set one for the other person or send a nudge on theirs.
- **Focus mode, low-energy mode and a weekly review.** For the days when the list feels too long.
- **Push notifications.** Instant ones (a new request, a finished shared task) and scheduled ones (15 minutes before a planned time, a morning summary). Each person chooses which they want.

## How it changed with daily use

The app started as a single page made with Claude, and grew from what we noticed using it:

- It began as a claude.ai artifact. Once we relied on it, it needed sign-in, a proper database and phone notifications, so it moved to Firebase as an installable web app. The page kept the same small database adapter, which is also how this demo works without a backend.
- Shopping items stopped earning points, so the points reflect real chores.
- Logging shopping trips with prices, brands and discounts was added later, once we were using the shopping list every week.
- Notifications are chosen per person, since we don't want the same ones.

## How it's built

I built Kahekesi with AI coding tools (Claude). I decided what the app should do, how it should feel and what to change, tested every change in daily use, and asked for fixes when something didn't work for us.

| Part | Where |
|---|---|
| The app (one page, no framework) | `public/index.html` |
| Sign-in, database link, notification settings | `public/kk-firebase.js` |
| Who may read and write (only invited emails; private data stays private) | `firestore.rules` |
| Instant and scheduled notifications | `functions/index.js` |
| One-time Firebase project setup | `scripts/bootstrap.mjs` |
| Deploys the real app on push | `.github/workflows/deploy.yml` (manual only in this copy) |
| Demo data and browser-only database | `demo-src/demo-db.js` |
| Builds the demo into `docs/` for GitHub Pages | `scripts/build-demo.mjs` |

Stack: plain HTML, CSS and JavaScript; Firebase Auth, Firestore, Cloud Functions and Cloud Messaging; GitHub Actions for deploys.

## Running the demo yourself

```
node scripts/build-demo.mjs
npx serve docs
```

The real app needs its own Firebase project; see the deploy workflow for the setup it runs.
