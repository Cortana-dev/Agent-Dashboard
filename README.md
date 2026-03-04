# Agent Dashboard

An internal operations console that keeps every autonomous agent in sight. The dashboard lives in `agent-dashboard/`, and it was built as a lightweight Svelte + Vite SPA to make agent activity consumable in seconds, especially on small screens.

## Purpose

- Surface each agent's current status (online, idle, paused, error) alongside token usage so the team can spot capacity issues before they become incidents.
- Provide contextual prompts, alerts, and timestamps when an agent is expanded, giving quick clues for debugging or follow-up actions.
- Offer a fast refresh path with skeleton loading states so the page feels responsive even when new data is being fetched.

## Use cases

- **Monitoring:** Scan token consumption and statuses to keep usage within budget and detect paused/error states that need attention.
- **Incident triage:** Expand a card to read recent alerts, view last active time, and trigger inspect/check actions without leaving the dashboard.
- **Prompt intelligence:** Review the most-used prompts for each agent to understand ongoing workloads and reuse winning prompts during planning.
- **Team alignment:** Share the last-updated timestamp and guidance copy with other operators so everyone is aware of when the data was refreshed and what behaviors to maintain.

## Implementation notes

- The `agent-dashboard` app seeds sample data in `src/routes/+page.ts` and renders it through reusable components such as `AgentCard`, `UsageMeter`, and `ExpandableDetails`.
- The interface prioritizes a centered column (max 640px) with responsive layouts so it adapts nicely to mobile screens.
- UI copy and styling lean on neon-inspired control accents (primary blues, warning oranges, and success greens) overlaid on muted backgrounds to keep focus on the data.

## How to run locally

```bash
cd agent-dashboard
npm install
npm run dev -- --host
```

Reloading the root route pulls new data via `load()` and animates between skeleton and real data, mimicking a real-world refresh cycle.
