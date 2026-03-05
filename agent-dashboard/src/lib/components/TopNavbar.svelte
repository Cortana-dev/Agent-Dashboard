<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { NavigationItem } from '$lib/types/navigation';

	export let items: NavigationItem[] = [];
	export let activeId: string = items[0]?.id ?? '';
	export let disabled = false;

	const dispatch = createEventDispatcher<{ select: NavigationItem }>();

	const handleSelect = (item: NavigationItem) => {
		dispatch('select', item);
	};
</script>

<nav class="top-navbar" aria-label="Primary dashboard navigation">
	<div class="top-navbar__pill-row">
		{#each items as item (item.id)}
			<button
				type="button"
				class:active={item.id === activeId}
				class:disabled={disabled}
				disabled={disabled}
				aria-disabled={disabled ? 'true' : undefined}
				aria-current={item.id === activeId ? 'page' : undefined}
				on:click={() => handleSelect(item)}
			>
				<span class="top-navbar__label">{item.label}</span>
				{#if item.description}
					<small>{item.description}</small>
				{/if}
			</button>
		{/each}
	</div>
</nav>

<style>
	.top-navbar {
		width: 100%;
	}

	.top-navbar__pill-row {
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		padding-bottom: 0.5rem;
	}

	.top-navbar__pill-row::-webkit-scrollbar {
		height: 4px;
	}

	.top-navbar__pill-row::-webkit-scrollbar-thumb {
		background: rgba(15, 23, 42, 0.2);
		border-radius: 99px;
	}

	.top-navbar__pill-row button {
		border: 1px solid var(--surface-border);
		background: var(--card-background);
		border-radius: 999px;
		padding: 0.6rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		min-width: 120px;
		cursor: pointer;
		font-weight: 600;
		color: var(--text-color);
		transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.top-navbar__pill-row button small {
		font-weight: 400;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted-text);
	}

	.top-navbar__pill-row button:disabled {
		cursor: not-allowed;
		opacity: 0.65;
		box-shadow: none;
	}

	.top-navbar__pill-row button:not(:disabled):hover {
		transform: translateY(-2px);
		border-color: var(--primary);
		box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
	}

	.top-navbar__pill-row button:not(:disabled).active {
		background: var(--primary);
		color: #fff;
		border-color: transparent;
		box-shadow: 0 10px 30px rgba(37, 99, 235, 0.35);
	}

	.top-navbar__pill-row button.active small {
		color: rgba(255, 255, 255, 0.8);
	}
</style>
