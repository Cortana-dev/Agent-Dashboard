<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import StatusBadge from '$lib/components/StatusBadge.svelte';
	import UsageMeter from '$lib/components/UsageMeter.svelte';
	import ExpandableDetails from '$lib/components/ExpandableDetails.svelte';
	import type { AgentSummary, AgentActionType } from '$lib/types/agent';

	export let agent: AgentSummary;
	export let isExpanded = false;
	export let onToggle: () => void = () => {};

	const dispatch = createEventDispatcher();

	const detailId = `agent-${agent.id}-details`;

	const handleKeyDown = (event: KeyboardEvent) => {
		const key = event.key;
		if (key === 'Enter' || key === ' ' || key === 'Spacebar' || key === 'Space') {
			event.preventDefault();
			onToggle();
		}
	};

	const fireAction = (type: AgentActionType) => {
		dispatch('action', { type, agentId: agent.id });
	};
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
				<button type="button" class="ghost" on:click|stopPropagation={() => fireAction('restart')}>Restart agent</button>
				<button type="button" class="ghost secondary" on:click|stopPropagation={() => fireAction('check')}>Run check</button>
				<button type="button" class="danger" on:click|stopPropagation={() => fireAction('stop')}>Stop agent</button>
			</div>
		</ExpandableDetails>
	{/if}
</article>

<style>
	.agent-card {
		border-radius: 1rem;
		border: 1px solid rgba(15, 23, 42, 0.08);
		background: var(--card-background, #ffffff);
		box-shadow: var(--card-shadow, 0 10px 25px rgba(15, 23, 42, 0.08));
		padding: 0;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
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

	.agent-card__focus:focus-visible,
	.agent-card__focus:focus {
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.35);
	}

	.agent-card__heading {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
	}

	.agent-card__title {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 600;
	}

	.agent-card__chevron {
		font-size: 1.4rem;
	}

	.agent-card__usage {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 0.75rem;
	}

	.agent-card__tokens {
		display: flex;
		justify-content: space-between;
		font-size: 0.8rem;
		color: var(--muted-text, #6b7280);
	}

	.agent-card.expanded {
		transform: translateY(-2px);
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
		background: var(--primary, #2563eb);
		color: #fff;
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.agent-card__actions button:hover {
		transform: translateY(-1px);
		box-shadow: 0 6px 12px rgba(37, 99, 235, 0.3);
	}

	.agent-card__actions button.ghost {
		background: transparent;
		border: 1px solid rgba(37, 99, 235, 0.4);
		color: var(--primary, #2563eb);
		box-shadow: none;
	}

	.agent-card__actions button.ghost.secondary {
		background: rgba(37, 99, 235, 0.12);
		color: #0f172a;
	}

	.agent-card__actions button.danger {
		background: #ef4444;
		color: #fff;
		box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
	}

	.agent-card__actions button.danger:hover {
		background: #dc2626;
	}

	.agent-card.online {
		border-color: rgba(34, 197, 94, 0.2);
	}

	.agent-card.error {
		border-color: rgba(248, 113, 113, 0.4);
	}

	.agent-card.paused {
		border-color: rgba(251, 191, 36, 0.4);
	}

	.agent-card.idle {
		border-color: rgba(59, 130, 246, 0.2);
	}
</style>
