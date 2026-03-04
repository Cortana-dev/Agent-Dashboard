<script lang="ts">
	import AgentCard from '$lib/components/AgentCard.svelte';
	import SkeletonAgentCard from '$lib/components/SkeletonAgentCard.svelte';
	import type { AgentSummary } from '$lib/types/agent';

	export let agents: AgentSummary[] = [];
	export let expandedId: string | null = null;
	export let onToggle: (id: string) => void = () => {};
	export let loading = false;
</script>

<div class="agent-list">
	{#if loading}
		{#each Array(3) as _, index (index)}
			<SkeletonAgentCard />
		{/each}
	{:else if agents.length === 0}
		<p class="empty-state">No agents connected yet.</p>
	{:else}
		{#each agents as agent (agent.id)}
			<AgentCard agent={agent} isExpanded={agent.id === expandedId} onToggle={() => onToggle(agent.id)} />
		{/each}
	{/if}
</div>

<style>
	.agent-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.empty-state {
		margin: 2rem 0;
		text-align: center;
		font-size: 0.95rem;
		color: rgba(226, 232, 240, 0.7);
	}
</style>
