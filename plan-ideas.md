# plan-ideas

Keeping the mobile-first, neon-dark aesthetic in mind, here are a few directions the agent dashboard could grow into:

1. **Bottom-sheet agent inspector for thumb use**
   - Replace the inline expandable details with a bottom sheet on narrow viewports so expanding a card feels like pulling up a quick inspector. A neon-accented handle could signal activity, and the overlay can dim the background while keeping the hero metrics in view.
   - This would keep the primary feed swipeable while still exposing alerts, prompts, and quick action buttons in the sheet.

2. **Neon alert timeline + health pulse**
   - Add a horizontally scrollable timeline per agent that tracks the last 24h of status transitions, rendered as neon strokes on a dark canvas. Snapshots of usage spikes, pauses, or errors could glow in different colors (success green, warning amber, danger pink) to stay on-theme.
   - Touch targets should be large and spaced for mobile comfort, with contextual tooltips or toasts explaining each pulse.

3. **Usage forecasting mural**
   - Surface a single-row sparkline or radial meter that projects daily/monthly usage versus quota (perhaps using semi-transparent neon gradients). A “guardrail” band could show safe/overrun zones, helping teams anticipate when throttles or cost controls are needed.
   - Pair this with a quick action (e.g., “Throttle prompts” or “Request tokens”) so operators can act from the same mobile view.

4. **Quick filters + saved views**
   - Introduce tabs or chips (styled with neon outlines) that filter agents by status (e.g., online/needs attention) and let the user save their preferred set of agents for a given mission.
   - On phones, these controls could collapse into a sticky floating FAB that expands into the filter menu when tapped.
