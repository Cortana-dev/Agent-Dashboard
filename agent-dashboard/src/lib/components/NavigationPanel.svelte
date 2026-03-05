<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { NavigationItem } from '$lib/types/navigation';

	export let items: NavigationItem[] = [];
	export let activeId: string | null = null;

	export let ariaLabel = 'Primary navigation';

	const dispatch = createEventDispatcher<{ select: NavigationItem }>();

	const handleSelect = (item: NavigationItem) => {
		dispatch('select', item);
	};
</script>

<nav class="navigation-panel" aria-label={ariaLabel}>
	<div class="navigation-panel__header">
		<div class="navigation-panel__header-content">
			<p class="navigation-panel__eyebrow">Navigation</p>
			<h2>Control center</h2>
		</div>
		<div class="navigation-panel__header-actions">
			<slot name="header-actions" />
		</div>
	</div>

	<div class="navigation-panel__list">
		{#each items as item}
			<button
				type="button"
				class="navigation-panel__link"
				class:active={item.id === activeId}
				aria-current={item.id === activeId ? 'page' : undefined}
				on:click={() => handleSelect(item)}>
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
		color: var(--sidebar-text);
	}

	.navigation-panel__header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
	}

	.navigation-panel__header-content {
		flex: 1;
	}

	.navigation-panel__eyebrow {
		margin: 0;
		text-transform: uppercase;
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		color: var(--muted-text);
	}

	.navigation-panel__header-content h2 {
		margin: 0;
		font-size: 1.5rem;
		color: var(--text-color);
	}

	.navigation-panel__header-actions {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.navigation-panel__list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.navigation-panel__link {
		border: 1px solid var(--navigation-link-border);
		background: var(--navigation-link-bg);
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
		background: var(--navigation-link-hover);
		transform: translateX(2px);
	}
	.navigation-panel__link.active {
		border-color: var(--primary);
		background: rgba(37, 99, 235, 0.14);
		transform: translateX(0);
	}

	.navigation-panel__icon {
		display: inline-flex;
		width: 32px;
		height: 32px;
		border-radius: 10px;
		border: 1px solid var(--navigation-link-border);
		align-items: center;
		justify-content: center;
		background: var(--navigation-link-bg);
	}

	.navigation-panel__label {
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.navigation-panel__link small {
		color: var(--muted-text);
		font-size: 0.8rem;
	}
</style>
