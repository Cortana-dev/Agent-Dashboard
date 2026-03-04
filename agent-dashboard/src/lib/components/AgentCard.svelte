<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import UsageMeter from '$lib/components/UsageMeter.svelte';
	import ExpandableDetails from '$lib/components/ExpandableDetails.svelte';
	import AgentHealthTimeline from '$lib/components/AgentHealthTimeline.svelte';
	import HealthPulseIndicator from '$lib/components/HealthPulseIndicator.svelte';
	import type { AgentSummary, TimelineEvent } from '$lib/types/agent';

	export let agent: AgentSummary;
	export let isExpanded = false;
	export let onToggle: () => void = () => {};

	const dispatch = createEventDispatcher();

	const detailId = `agent-${agent.id}-details`;

	let selectedEvent: TimelineEvent | null = agent.activityTimeline[agent.activityTimeline.length - 1] ?? null;

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			onToggle();
		}
	};

	const fireAction = (type: 'inspect' | 'check') => {
		dispatch('action', { type, agentId: agent.id });
	};

	const handleTimelineSelect = (event: TimelineEvent) => {
		selectedEvent = event;
	};

	const formatEventTime = (timestamp: string) => {
		const parsed = Date.parse(timestamp);
		if (Number.isNaN(parsed)) return 'unknown';
		return new Date(parsed).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
	};

	$: if (agent.activityTimeline.length) {
		const newest = agent.activityTimeline[agent.activityTimeline.length - 1];
		if (!selectedEvent || selectedEvent.id !== newest.id) {
			selectedEvent = newest;
		}
	}
</script>

<article class={`agent-card ${agent.status} ${isExpanded ? 'expanded' : ''}`}>
	<div
		class="agent-card__focus"
		role="button"
		tabindex="0"
		aria-controls={detailId}
		aria-expanded={isExpanded}
		on:click={onToggle}
		on:keydown={handleKeyDown}
	>
		<div class="agent-card__heading">
			<div>
				<p class="agent-card__title">{agent.name}</p>
				<StatusBadge status={agent.status} />
			</div>
			<span class="agent-card__chevron" aria-hidden="true">{isExpanded ? '▾' : '▸'}</span>
		</div>
		<div class="agent-card__usage">
			<UsageMeter label="Daily" percent={agent.dailyUsagePercent} variant="daily" />
			<UsageMeter label="Monthly" percent={agent.monthlyUsagePercent} variant="monthly" />
		</div>
		<div class="agent-card__tokens">
			<span>{agent.dailyTokens.toLocaleString()} tokens today</span>
			<span>{agent.monthlyTokens.toLocaleString()} tokens month</span>
		</div>
		<div class="agent-card__pulse">
			<AgentHealthTimeline
				events={agent.activityTimeline}
				activeId={selectedEvent?.id ?? null}
				compact={!isExpanded}
				on:select={(event) => handleTimelineSelect(event.detail.event)}
			/>
			<HealthPulseIndicator {...agent.healthPulse} />
		</div>
		{#if selectedEvent}
			<p class="agent-card__event-summary">
				<strong>{selectedEvent.label}</strong> · {selectedEvent.detail}
				<span>{formatEventTime(selectedEvent.timestamp)}</span>
			</p>
		{/if}
	</div>

	{#if isExpanded}
		<ExpandableDetails
			id={detailId}
			lastActive={agent.lastActive}
			recentAlerts={agent.recentAlerts}
			prompts={agent.topPrompts}
		>
			<div slot="actions" class="agent-card__actions">
				<button type="button" on:click|stopPropagation={() => fireAction('inspect')}>Inspect logs</button>
				<button type="button" class="ghost" on:click|stopPropagation={() => fireAction('check')}>Run check</button>
			</div>
		</ExpandableDetails>
	{/if}
</article>

<style>
	:global(:root) {
		--card-background: #070b1a;
		--card-border: rgba(59, 130, 246, 0.7);
		--muted-text: rgba(255, 255, 255, 0.65);
		--primary: #38bdf8;
	}

	.agent-card {
		border-radius: 1.25rem;
		border: 1px solid rgba(59, 130, 246, 0.2);
		background: linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(2, 6, 23, 0.95));
		box-shadow: 0 20px 35px rgba(2, 6, 23, 0.5);
		padding: 0;
		transition: transform 0.2s ease, border-color 0.2s ease;
		overflow: hidden;
	}

	.agent-card__focus {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		cursor: pointer;
		outline: none;
	}

	.agent-card__focus:focus-visible {
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
	}

	.agent-card__heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
	}

	.agent-card__title {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: #f8fafc;
	}

	.agent-card__chevron {
		font-size: 1.4rem;
		color: rgba(248, 250, 252, 0.6);
	}

	.agent-card__usage {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
	}

	.agent-card__tokens {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		color: var(--muted-text);
	}

	.agent-card__pulse {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.agent-card__event-summary {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted-text);
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.agent-card__event-summary strong {
		color: #e0f2fe;
		font-weight: 600;
	}

	.agent-card__event-summary span {
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
	}

	.agent-card.expanded {
		transform: translateY(-2px);
		border-color: rgba(59, 130, 246, 0.9);
	}

	.agent-card__actions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.agent-card__actions button {
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
		border: none;
		font-weight: 600;
		cursor: pointer;
		background: #38bdf8;
		color: #020617;
	}

	.agent-card__actions button.ghost {
		background: transparent;
		border: 1px solid rgba(59, 130, 246, 0.6);
		color: #e0e7ff;
	}

	.agent-card.online {
		border-color: rgba(52, 211, 153, 0.5);
	}

	.agent-card.error {
		border-color: rgba(248, 113, 113, 0.5);
	}

	.agent-card.paused {
		border-color: rgba(251, 191, 36, 0.5);
	}

	.agent-card.idle {
		border-color: rgba(59, 130, 246, 0.5);
	}

	@media (max-width: 640px) {
		.agent-card__pulse {
			flex-direction: column;
			align-items: flex-start;
		}

		.agent-card__event-summary {
			font-size: 0.75rem;
		}
	}
</style>

