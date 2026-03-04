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
		<p>
			Each card now tracks a neon timeline and health pulse so you can sense when an agent drifted into warnings or errors without leaving the mobile view.
		</p>
		<p class="guidance__meta">Key reminders: short prompts, 80% usage alerts, clear system instructions.</p>
	</div>
</section>

<style>
	.dashboard {
		width: min(960px, 100%);
		margin: 0 auto;
		padding: 1rem 0 2rem;
		display: flex;
		flex-direction: column;
		row-gap: 1rem;
		color: #e0e7ff;
	}

	.dashboard__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.dashboard__header h1 {
		margin: 0;
		font-size: clamp(1.7rem, 4vw, 2.7rem);
	}

	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.25em;
		font-size: 0.7rem;
		color: rgba(226, 232, 240, 0.65);
	}

	.last-updated {
		margin: 0;
		font-size: 0.85rem;
		color: rgba(226, 232, 240, 0.6);
	}

	.refresh {
		border: none;
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(14, 165, 233, 0.9));
		color: #020617;
		padding: 0.75rem 1.3rem;
		border-radius: 999px;
		font-weight: 600;
		box-shadow: 0 8px 20px rgba(14, 165, 233, 0.6);
		transition: transform 0.2s ease;
	}

	.refresh:hover {
		transform: translateY(-1px);
	}

	.llm-guidance {
		padding: 1rem 1.2rem;
		border-radius: 16px;
		background: rgba(2, 6, 23, 0.75);
		border: 1px solid rgba(59, 130, 246, 0.4);
		font-size: 0.9rem;
		line-height: 1.5;
		color: rgba(226, 232, 240, 0.8);
	}

	.llm-guidance a {
		color: #38bdf8;
		text-decoration: underline;
	}

	.guidance__meta {
		margin-top: 0.5rem;
		font-size: 0.8rem;
		color: rgba(226, 232, 240, 0.6);
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
