<script lang="ts">
	import AgentList from '$lib/components/AgentList.svelte';
	import ErrorBanner from '$lib/components/ErrorBanner.svelte';
	import type { AgentSummary } from '$lib/types/agent';

	export let agents: AgentSummary[] = [];
	export let lastUpdated: string = new Date().toISOString();
	export let refresh: () => Promise<void> = async () => {};
	export let isRefreshing = false;
	export let errorMessage: string | null = null;
	export let loading = false;

	let expandedId: string | null = null;

	const toggleCard = (id: string) => {
		expandedId = expandedId === id ? null : id;
	};

	const docLink = '/docs/llms.txt';

	const handleRefresh = async () => {
		await refresh();
	};

	$: parsedValue = Date.parse(lastUpdated);
	$: formattedUpdated = !Number.isNaN(parsedValue)
		? new Date(parsedValue).toLocaleString('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		})
		: 'Unknown';
</script>

<section class="dashboard">
	<header class="dashboard__header">
		<div>
			<p class="eyebrow">Agent console</p>
			<h1>Agents</h1>
		</div>

		<button
			type="button"
			class="refresh"
			aria-live="polite"
			aria-busy={isRefreshing}
			disabled={isRefreshing}
			on:click={handleRefresh}
		>
			{#if isRefreshing}
			Refreshing…
			{:else}
			Refresh data
			{/if}
		</button>
	</header>

	<p class="last-updated">Last updated {formattedUpdated}</p>

	{#if errorMessage}
		<ErrorBanner message={errorMessage} on:retry={handleRefresh} />
	{/if}

	<AgentList
		agents={agents}
		expandedId={expandedId}
		onToggle={toggleCard}
		loading={loading || isRefreshing}
	/>

	<div class="llm-guidance">
		<p>
			LLM usage notes live in <a href={docLink} target="_blank" rel="noreferrer">{docLink}</a>.
			Keep prompts scoped, recycle trusted system instructions, and monitor monthly usage so you can act before limits are hit.
		</p>
		<p class="guidance__meta">Key reminders: short prompts, 80% usage alerts, clear system instructions.</p>
	</div>
</section>

<style>
	.dashboard {
		width: min(640px, 100%);
		margin: 0 auto;
		padding: 1rem 0 2rem;
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
	}

	.dashboard__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.dashboard__header h1 {
		margin: 0;
		font-size: clamp(1.7rem, 4vw, 2.4rem);
	}

	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-size: 0.7rem;
		color: var(--muted-text, #8a95a1);
	}

	.last-updated {
		margin: 0;
		font-size: 0.85rem;
		color: var(--muted-text, #8a95a1);
	}

	.refresh {
		border: none;
		background: var(--card-background, #ffffff);
		color: var(--primary, #2563eb);
		padding: 0.65rem 1.2rem;
		border-radius: 999px;
		font-weight: 600;
		box-shadow: 0 4px 12px rgba(20, 23, 37, 0.12);
		transition: transform 0.2s ease, background 0.2s ease;
	}

	.refresh:hover {
		transform: translateY(-1px);
		background: var(--primary-muted, #f0f5ff);
	}

	.refresh:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		box-shadow: none;
		transform: none;
	}

	.llm-guidance {
		padding: 1rem 1.2rem;
		border-radius: 12px;
		background: var(--guide-bg, #11182714);
		border: 1px solid rgba(226, 232, 240, 0.8);
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--muted-text, #4b5563);
	}

	.llm-guidance a {
		color: var(--primary, #2563eb);
		text-decoration: underline;
	}

	.guidance__meta {
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: var(--muted-text, #6b7280);
	}

	@media (max-width: 480px) {
		.dashboard__header {
			flex-direction: column;
			align-items: flex-start;
		}
	
		.refresh {
			width: 100%;
			text-align: center;
		}
	}
</style>
