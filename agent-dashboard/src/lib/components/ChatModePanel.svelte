<script lang="ts">
	import type { AgentSummary } from '$lib/types/agent';

	export let agents: AgentSummary[] = [];
	export let open = false;
	export let activeAgentId: string | null = null;
	export let lastAction: { message: string; timestamp: string } | null = null;
	export let onClose: () => void = () => {};

	const statusPalette: Record<AgentSummary['status'], string> = {
		online: '#22c55e',
		idle: '#94a3b8',
		paused: '#fbbf24',
		error: '#f87171'
	};

	const formatInitials = (name: string) =>
		name
			.split(' ')
			.map((segment) => segment[0])
			.join('')
			.slice(0, 2)
			.toUpperCase();

	const formatTime = (value: string) => {
		const parsed = Date.parse(value);
		if (!Number.isNaN(parsed)) {
			return new Date(parsed).toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit'
			});
		}
		return '—';
	};

	const formatSnippet = (agent: AgentSummary) => agent.recentAlerts[0] ?? agent.topPrompts[0] ?? 'Awaiting activity…';
</script>

<aside class={`chat-panel ${open ? 'open' : ''}`} aria-live="polite" aria-hidden={!open}>
	<header class="chat-panel__header">
		<div>
			<p class="chat-panel__title">Chat mode</p>
			<p class="chat-panel__subtitle">WhatsApp style contacts for agents</p>
		</div>
		<button type="button" class="chat-panel__close" on:click={onClose} aria-label="Close chat panel">×</button>
	</header>

	<p class="chat-panel__status">
		{#if lastAction}
			<span>{lastAction.message}</span>
			<small>• {lastAction.timestamp}</small>
		{:else}
			Chat mode ready. Send a command to keep agents synchronized.
		{/if}
	</p>

	<ul class="chat-panel__list">
		{#each agents as agent (agent.id)}
			<li class={`chat-entry ${agent.id === activeAgentId ? 'active' : ''}`}>
				<span class="chat-entry__avatar">{formatInitials(agent.name)}</span>
				<div class="chat-entry__content">
					<div class="chat-entry__top">
						<strong>{agent.name}</strong>
						<span>{formatTime(agent.lastActive)}</span>
					</div>
					<p>{formatSnippet(agent)}</p>
				</div>
				<span
					class="chat-entry__indicator"
					style={`background:${statusPalette[agent.status]};`}
					aria-hidden="true"
				></span>
			</li>
		{/each}
	</ul>
</aside>

<style>
	.chat-panel {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		width: min(360px, 90vw);
		max-height: 80vh;
		background: #0f172a;
		color: #f8fafc;
		border-radius: 20px;
		padding: 1rem;
		box-shadow: 0 20px 45px rgba(15, 23, 42, 0.5);
		transform: translateX(120%);
		transition: transform 0.3s ease;
		z-index: 30;
		border: 1px solid rgba(148, 163, 184, 0.3);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		backdrop-filter: blur(12px);
	}

	.chat-panel.open {
		transform: translateX(0);
	}

	.chat-panel__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.chat-panel__title {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
	}

	.chat-panel__subtitle {
		margin: 0;
		font-size: 0.75rem;
		color: rgba(248, 250, 252, 0.8);
	}

	.chat-panel__close {
		border: none;
		background: rgba(148, 163, 184, 0.2);
		color: #f8fafc;
		border-radius: 50%;
		width: 32px;
		height: 32px;
		font-size: 1.4rem;
		line-height: 1;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.chat-panel__close:hover {
		background: rgba(148, 163, 184, 0.4);
	}

	.chat-panel__status {
		margin: 0;
		font-size: 0.85rem;
		color: rgba(248, 250, 252, 0.9);
		line-height: 1.4;
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
	}

	.chat-panel__status small {
		color: rgba(148, 163, 184, 0.9);
	}

	.chat-panel__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		overflow-y: auto;
		max-height: 55vh;
	}

	.chat-entry {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem 0.5rem;
		border-radius: 14px;
		background: rgba(15, 23, 42, 0.4);
		border: 1px solid rgba(148, 163, 184, 0.15);
		transition: background 0.2s ease, transform 0.2s ease;
		cursor: pointer;
	}

	.chat-entry.active {
		background: rgba(37, 99, 235, 0.15);
		transform: translateX(4px);
	}

	.chat-entry__avatar {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: rgba(148, 163, 184, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #e2e8f0;
	}

	.chat-entry__content {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.chat-entry__top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.9rem;
		color: #f8fafc;
	}

	.chat-entry__top span:last-child {
		font-size: 0.75rem;
		color: rgba(148, 163, 184, 0.85);
	}

	.chat-entry__content p {
		margin: 0;
		font-size: 0.75rem;
		color: rgba(248, 250, 252, 0.85);
	}

	.chat-entry__indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid rgba(15, 23, 42, 0.8);
	}

	@media (max-width: 600px) {
		.chat-panel {
			right: 0.5rem;
			bottom: 0.5rem;
			width: calc(100vw - 1rem);
			border-radius: 16px;
		}
	}
</style>
