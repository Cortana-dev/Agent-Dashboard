# Mobile-first Svelte/SvelteKit Agent Dashboard Plan

## Inspiration & Focus
- Mobile-first dashboards lean on a single column of cards, bold typography for the headline metrics, and touch-friendly hit areas.
- For an agent management view, the priority is to make the token usage ratios and bot health states glanceable, with expandable detail only one tap away so the list stays scannable.
- We'll follow these principles by keeping the hero area compact, using responsive cards with progress meters for percentages, and retaining supporting details in collapsible panels.

## Layout & UX Storyboard
1. **Launch state (seconds 0–1):** Show a slim header with title (e.g., "Agents") and a concise refresh action/icon. The background is clean, with subtle gradients for depth.
2. **Loading/Skeleton:** As data loads, render 2-3 skeleton cards that mock up the layout (avatar, status chip, usage bars) so the page doesn’t feel empty.
3. **Default view:** Each card occupies nearly the full viewport width with comfortable padding. The top row of the card shows the agent name and a status badge (online, paused, error). Below that, we display two horizontal usage meters (daily and monthly) with percentage values, and a small indicator of raw tokens.
4. **Expansion:** Tapping anywhere on a card expands a details area beneath the meters. This area reveals latest activity timestamp, recent alerts (if any), a quick summary of top prompts used, and CTA buttons (e.g., "Inspect logs", "Run check"). The expansion is animated with a smooth height transition to feel native.
5. **Interactivity:** Users can pull-to-refresh or tap a refresh icon to re-fetch data. If an agent is in an alert state, the card subtly pulses or uses accent color to draw attention.

## Component Breakdown
- `+page.svelte` / `page.svelte`: Entry point that composes the dashboard. It calls `load()` in `+page.ts` to fetch data, handles error states, and renders the `AgentDashboard` component.
- `AgentDashboard.svelte`: Wraps the list, displays header/refresh controls, and handles global states (isRefreshing, error message).
- `AgentList.svelte`: Iterates over agent data and renders an `AgentCard` for each entry; also shows placeholders when the data array is empty.
- `AgentCard.svelte`:
  - Props: `{ agent, isExpanded, onToggle }`.
  - Displays name, status badge (color-coded), usage meters, and a chevron that rotates when expanded.
  - Handles tap/keyboard activation to toggle the detail panel.
- `UsageMeter.svelte`: Reusable component that renders a base track with a filled segment representing the percentage; shows the numeric percentage and contextual label (daily/monthly).
- `StatusBadge.svelte`: Maps status strings to colors/icons (online, warning, offline, paused) and exposes accessible descriptions.
- `ExpandableDetails.svelte`: Panel that shows last activity, recent errors/log snippets, pinned prompts, and potential action buttons. Supports `slot` for custom actions.
- `SkeletonAgentCard.svelte`: Lightweight placeholder for loading state.
- `ErrorBanner.svelte`: When data fails to load, show compact banner with retry button.

## Data Flow & State
- API: we expect an endpoint such as `/api/agents/overview` returning a list of agents with the shape:
  ```ts
  interface AgentSummary {
    id: string;
    name: string;
    status: 'online' | 'idle' | 'paused' | 'error';
    dailyUsagePercent: number; // 0-100
    monthlyUsagePercent: number;
    dailyTokens: number;
    monthlyTokens: number;
    lastActive: string; // ISO
    extraDetails?: string[]; // messages or alerts
  }
  ```
- `+page.ts`: uses `load` to fetch the summaries server-side (or via `fetch` client-side during navigation). Provides the data to the page component.
- `AgentDashboard` maintains the expanded card state (e.g., `expandedId`). It also exposes an `agentStore` (Svelte writable) for partial hydration updates (refresh button, polling).
- Data refresh: tapping refresh or using `onMount` + `setInterval` invalidates the SvelteKit page data, re-running `load` and updating components. For more granular updates, the store can `set` a new list upon fetch.
- Derived state: each card computes the appropriate CSS for meter width, formats percentages for display, and determines whether to show warning styles (e.g., monthly usage over 80%).
- Error handling: `load` catches fetch errors and sets an error flag; the UI renders `ErrorBanner` with retry.

## Styling & Accessibility
- Single column layout using `max-width: 640px` container centered with `padding: 1rem` so cards span most of the screen on mobile.
- Cards use `border-radius: 1rem`, `box-shadow`, and `transition` for expand/collapse.
- Usage meters use `aria-valuenow` and textual labels to be screen-reader friendly. Details panels are controlled via `aria-expanded`.
- Colors adapt to the preferred theme; we expose CSS variables for status colors and background.
- The expand action is triggered on both `click` and `keydown` (Space/Enter) for accessibility.

## Storyboard (mobile flow)
1. User opens dashboard and sees a header, refresh icon, and placeholder cards.
2. Data loads quickly, and agent cards reveal name, status, and two usage bars.
3. The user taps the first card. It expands to show last responded time, any alerts, and action links.
4. At the bottom of the list, a subtle footer ("Updated 2m ago") reminds the user of freshness. A pull-to-refresh or button re-fetches data.
5. If tokens spike, the monthly bar turns amber/red and a callout text warns the user (e.g., "Monthly limit at 89% — consider adjusting prompts").

## Questions for Kevin
1. Which backend endpoint(s) will provide the per-agent token usage and status data? Do they already include daily/monthly token percentages, or do we need to compute them ourselves?
2. Are there predefined status values we must support (online, running, paused, error, etc.) and associated colors/icons, or should I define them?
3. Should the expandable details panel show any specific data (logs, alerts, last command, etc.), or is it acceptable to keep it generic for now with placeholders?
4. Do we need to support real-time updates (websocket/push) later, or is manual refresh/polling the initial requirement?
