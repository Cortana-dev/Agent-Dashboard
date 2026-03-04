# Agent Dashboard

A mobile-first SvelteKit dashboard showing agent health, token usage, and quick actions tailored for LLM operations. The layout keeps a single-column flow, progressive loading, and expandable cards so operators can scan on a phone or tablet.

## Features

- **Mobile-first hero and refresh controls** with visible status badges.
- **Usage meters** for daily and monthly consumption plus token totals.
- **Expandable details** featuring last activity, alerts, top prompts, and CTA buttons.
- **Neon alert timeline and health pulse** surfaces show the most recent 24-hour events and an animated health ring per agent.
- **Error banner and skeletons** to communicate loading or failure states.
- **LLM guidance callouts** linking back to the documented playbook in `static/docs/llms.txt`.

## LLM Guidelines Reference

The dashboard explicitly points to [`static/docs/llms.txt`](./static/docs/llms.txt). That file captures the rules shown in the UI, including keeping prompts scoped, monitoring budgets (especially 80%+ monthly) and reusing trusted system instructions so LLM usage remains predictable.

## Getting started

```bash
cd agent-dashboard
npm install
npm run dev -- --open
```

The page will hot-reload as you make changes. Use `npm run check` to validate TypeScript and lint rules, and `npm run build` to produce a production bundle.
