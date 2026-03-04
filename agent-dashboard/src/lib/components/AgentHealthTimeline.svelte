<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { TimelineEvent } from '$lib/types/agent';

	export let events: TimelineEvent[] = [];
	export let activeId: string | null = null;
	export let compact = false;

	const dispatch = createEventDispatcher<{ select: { event: TimelineEvent } }>();

	const handleSelect = (event: TimelineEvent) => {
		dispatch('select', { event });
	};

	const formatTime = (timestamp: string) => {
		const parsed = Date.parse(timestamp);
		if (Number.isNaN(parsed)) return 'unknown';
		return new Date(parsed).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
	};
</script>

<div class={`timeline ${compact ? 'timeline--compact' : 'timeline--full'}`} aria-label="Agent activity timeline">
	{#if events.length === 0}
		<p class="timeline__empty">No activity yet</p>
	{:else}
		{#each events as event (event.id)}
			<button
				type="button"
				class={`timeline__event ${event.severity} ${activeId === event.id ? 'active' : ''}`}
				aria-pressed={activeId === event.id}
				aria-label={`${event.label} at ${formatTime(event.timestamp)}`}
				on:click={() => handleSelect(event)}
				on:focus={() => handleSelect(event)}
			>
				<span class="timeline__dot" aria-hidden="true"></span>
				<span class="timeline__label">
					{event.label}
					<span class="timeline__time">{formatTime(event.timestamp)}</span>
				</span>
			</button>
		{/each}
	{/if}
</div>

<style>
	.timeline {
		display: flex;
		gap: 0.5rem;
		padding: 0.4rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6));
		overflow-x: auto;
		scrollbar-width: none;
	}

	.timeline::-webkit-scrollbar {
		display: none;
	}

	.timeline__event {
		all: unset;
		box-sizing: border-box;
		display: inline-flex;
		gap: 0.35rem;
		align-items: center;
		padding: 0.35rem 0.6rem;
		border-radius: 999px;
		min-width: 10ch;
		background: rgba(255, 255, 255, 0.05);
		color: #e2e8f0;
		font-size: 0.75rem;
		line-height: 1.2;
		text-align: left;
		cursor: pointer;
		transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
		border: 1px solid transparent;
		position: relative;
	}

	.timeline__event:focus-visible,
	.timeline__event:hover {
		transform: translateY(-1px);
		box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
	}

	.timeline__event.success {
		box-shadow: 0 0 12px rgba(34, 197, 94, 0.5);
	}

	.timeline__event.warning {
		box-shadow: 0 0 12px rgba(251, 191, 36, 0.6);
	}

	.timeline__event.danger {
		box-shadow: 0 0 12px rgba(248, 113, 113, 0.6);
	}

	.timeline__event.active {
		background: rgba(59, 130, 246, 0.3);
		border-color: rgba(59, 130, 246, 0.8);
	}

	.timeline__dot {
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 10px currentColor;
	}

	.timeline__label {
		display: flex;
		flex-direction: column;
		font-weight: 600;
	}

	.timeline__time {
		font-size: 0.6rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(255, 255, 255, 0.7);
	}

	.timeline__empty {
		margin: 0;
		color: rgba(255, 255, 255, 0.7);
	}

	.timeline--compact {
		gap: 0.35rem;
		padding: 0.35rem;
	}

	.timeline--compact .timeline__event {
		min-width: auto;
		padding: 0.25rem 0.5rem;
		font-size: 0.65rem;
	}

	.timeline--compact .timeline__label {
		font-size: 0.7rem;
	}
</style>
