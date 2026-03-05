<script lang="ts">
	import { createEventDispatcher } from 'svelte';
import type { NavigationItem } from '$lib/types/navigation';

	export let items: NavigationItem[] = [];
	export let ariaLabel = 'Primary navigation';

	const dispatch = createEventDispatcher<{ select: NavigationItem }>();

	const handleSelect = (item: NavigationItem) => {
		dispatch('select', item);
	};
</script>

<nav class="navigation-panel" aria-label={ariaLabel}>
	<div class="navigation-panel__header">
		<p class="navigation-panel__eyebrow">Navigation</p>
		<h2>Control center</h2>
	</div>

	<div class="navigation-panel__list">
		{#each items as item}
			<button type="button" class="navigation-panel__link" on:click={() => handleSelect(item)}>
				{#if item.icon}
					<span aria-hidden="true" class="navigation-panel__icon">{item.icon}</span>
				{/if}
				<span class="navigation-panel__label">{item.label}</span>
				<small>{item.description}</small>
			</button>
		{/each}
	</div>
</nav>

<style>
	.navigation-panel {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.navigation-panel__header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.navigation-panel__eyebrow {
		margin: 0;
		text-transform: uppercase;
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		color: rgba(226, 232, 240, 0.7);
	}

	.navigation-panel__header h2 {
		margin: 0;
		font-size: 1.5rem;
	}

	.navigation-panel__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.navigation-panel__link {
		border: none;
		background: rgba(148, 163, 184, 0.08);
		color: inherit;
		border-radius: 14px;
		padding: 0.75rem 1rem;
		text-align: left;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		cursor: pointer;
		transition: background 0.2s ease, transform 0.2s ease;
	}

	.navigation-panel__link:hover {
		background: rgba(148, 163, 184, 0.2);
		transform: translateX(2px);
	}

	.navigation-panel__icon {
		display: inline-flex;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		border: 1px solid rgba(148, 163, 184, 0.35);
		align-items: center;
		justify-content: center;
		background: rgba(148, 163, 184, 0.25);
	}

	.navigation-panel__label {
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.navigation-panel__link small {
		color: rgba(226, 232, 240, 0.8);
		font-size: 0.8rem;
	}
</style>
