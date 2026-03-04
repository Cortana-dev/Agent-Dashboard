# iteration-v1.1-plan

## Chosen enhancement
Implement the **Neon alert timeline + health pulse** from `plan-ideas.md`. The goal for V1.1 is to turn each agent card into a neon-dark activity canvas that shows the last 24‑hour status history and highlights critical pulses so operators can instantly spot when a run tipped into “needs attention” territory.

## UX narrative
- Each card keeps the same hero metrics (name, status badge, usage meters) so the current scan flow stays familiar.
- Below the hero row (but still within the card), add a slim, horizontally scrollable “neon rail” that represents the past 24 hours. Touching a segment shows a transient toast/tooltip explaining what happened (status transition, alert, error, spike). This rail is always visible; it acts like a visual heartbeat.
- When a card is expanded, the rail grows taller so we can overlay annotations (e.g., alert badges, mini sparklines) and expose precise timestamps.
- To the right or beneath the timeline we render a `HealthPulse` indicator—a concentric neon ring whose fill level reflects the ratio of healthy ticks vs. warnings/errors (think of it as a mini meter). The pulse also flashes softly when a critical alert exists.
- Timeline touch targets are generous (≥44px) and the whole control supports horizontal swipes to pan through the day without grabbing the entire page.

## Components
1. **`AgentHealthTimeline.svelte`** (new)
   - Props: `events: TimelineEvent[]`, `windowHours?: number`, `activeAlertId?: string`.
   - Renders a dark canvas/gradient background with a thin neon stroke across the width. Each event becomes a glowing circle or block positioned proportionally to its timestamp.
   - Colors map to statuses (`success`, `warning`, `danger`) and animate softly on mount.
   - Emits `eventHover` (or `tap`) with detail for tooltips so the parent `AgentCard` can show details alongside the existing `ExpandableDetails` slot.

2. **`HealthPulseIndicator.svelte`** (new, reused across cards)
   - Accepts metrics such as `healthyPct`, `warningPct`, `dangerPct` to draw arcs/rings and optionally pulse.
   - Works well on dark backgrounds and supports `aria-label` describing the overall health.

3. **`AgentCard.svelte` updates**
   - Inject timeline component just above the expandable details.
   - Keep `UsageMeter`s but adjust spacing so the timeline and pulse share horizontal space.
   - Hook timeline taps to show contextual microcopy (maybe a floating `Toast` in the card). Could reuse existing `ExpandableDetails` area to show the last tapped event summary.

4. **Optional: `TimelineToast.svelte`**
   - Lightweight overlay text for tough-to-see events; uses neon border, dropshadow, fades after a few seconds.

## Data needs
Extend `AgentSummary` (and the seed/mock data) with:
- `activityTimeline: TimelineEvent[]` where `TimelineEvent = { timestamp: string; type: 'status' | 'alert' | 'error' | 'spike'; label: string; severity: 'success' | 'warning' | 'danger'; }`.
- `healthPulse: { healthyPct: number; warningPct: number; dangerPct: number }` (or derive on the fly from the timeline events, but the backend may already surface a health score).
- Possibly `last24hWindowStart: string` if we want to show the range explicitly.

The mock `+page.ts` seeds can generate synthetic events (e.g., status transitions every few hours plus a couple of alerts). Later, the real API can replace the seeded timeline.

## Neon-dark integration
- Timeline background uses navy/black gradient (#030712 → #101828) with a glowing neon stroke (#7C3AED, #22D3EE, #F472B6) for events. Each circle is a softly blurred glow (CSS `filter: blur(2px); opacity`), keeping it subtle but neon.
- Health pulse rings use angled gradient outlines and a faint glow. On critical alerts, the pulse border animates (scale up + box-shadow) so operators feel the urgency.
- Interactions (scroll bars, hover outlines) use neon-coded accents rather than default scrollbars. Buttons near the timeline (if we add inline CTA badges) adopt semi-transparent neon backgrounds.
- All new text sits on the existing dark card background; drop shadows mimic neon halos.

## Dependencies & rationale
- **Data dependency:** Need historical status/alert data from whichever service feeds the dashboard (even if stubbed in V1.1); without it, the timeline is speculative. We should confirm how soon the telemetry team can supply events.
- **Component dependency:** Timeline and pulse components will touch canvas/animations, so we should ensure Svelte animations stay performant on mobile. We may want to integrate `svelte-motion` (if already in project) or keep to CSS transitions.
- **Rationale:** This enhancement aligns with the neon-dark theme by turning bottleneck data into a visual story. It also keeps the hero metrics swipable while adding more context for on-call operators who need to understand the *why* behind a status badge.

## Questions for Kevin
1. Should the timeline be visible in the collapsed card, or only after expansion? (I’m leaning toward always showing a compact rail so the pulse story never requires extra taps.)
2. Do we already get event history from the backend, or should I prototype with generated data and plan for a future API contract?
3. Would you prefer the health pulse meter to sit beside the timeline inside each card or be part of the expandable details when the card opens?
4. Are there particular statuses/alerts you want to highlight in the neon palette (e.g., `maintenance`, `cost-guardrail`, `incident`), or should the mapping stay generic in V1.1?
