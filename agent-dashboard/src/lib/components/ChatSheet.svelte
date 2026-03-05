<script lang="ts">
	import type { AgentSummary } from '$lib/types/agent';

	export let agents: AgentSummary[] = [];
	export let open = false;
	export let expandedAgentId: string | null = null;
	export let onClose: () => void = () => {};
	export let onEntrySelect: (agentId: string) => void = () => {};
	export let onDetailClose: () => void = () => {};
	export let lastAction: { message: string; timestamp: string } | null = null;

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

	let selectedAgent: AgentSummary | null = null;

	$: selectedAgent = expandedAgentId ? agents.find((entry) => entry.id === expandedAgentId) ?? null : null;
</script>

<div class={`chat-sheet ${open ? 'open' : ''}`} aria-hidden={!open}>
	<header class="chat-sheet__header">
		<div>
			<p class="chat-sheet__title">Chat mode</p>
			<p class="chat-sheet__subtitle">WhatsApp-style updates from every agent</p>
		</div>
		{#if expandedAgentId}
			<button type="button" class="chat-sheet__mini" on:click={onDetailClose}>
				← Back to contacts
			</button>
		{:else}
			<button type="button" class="chat-sheet__mini ghost" on:click={onClose}>
				Close sheet
			</button>
		{/if}
	</header>

	{#if lastAction}
		<p class="chat-sheet__last-action" aria-live="polite">
			<strong>Last action:</strong> {lastAction.message} • {lastAction.timestamp}
		</p>
	{/if}

	<div class="chat-sheet__body">
		{#if expandedAgentId}
			{#if selectedAgent}
				<section class="chat-sheet__detail">
					<div class="chat-sheet__detail-meta">
						<div>
							<strong>{selectedAgent.name}</strong>
							<small>Live check-in • {formatTime(selectedAgent.lastActive)}</small>
						</div>
						<span
							class="chat-sheet__status"
							style={`background:${statusPalette[selectedAgent.status]};`}
							aria-hidden="true"
						></span>
					</div>
					<div class="chat-sheet__messages">
						<p class="chat-sheet__message incoming">
							{''}I scoped the recent prompt for {selectedAgent.name} and queued a follow-up.
						</p>
						<p class="chat-sheet__message outgoing">
							{''}Sending restart signal now to align with the new directive.
						</p>
					</div>
					<button type="button" class="chat-sheet__back" on:click={onDetailClose}>
						Return to contacts
					</button>
				</section>
			{:else}
				<p class="chat-sheet__placeholder">Agent details are unavailable right now.</p>
			{/if}
		{:else}
			<ul class="chat-sheet__list">
				{#each agents as agent (agent.id)}
					<li>
						<button type="button" class="chat-entry" on:click={() => onEntrySelect(agent.id)}>
							<span class="chat-entry__avatar">{formatInitials(agent.name)}</span>
							<div class="chat-entry__content">
								<div class="chat-entry__top">
									<strong>{agent.name}</strong>
									<span>{formatTime(agent.lastActive)}</span>
								</div>
								<p>{agent.recentAlerts[0] ?? agent.topPrompts[0] ?? 'Awaiting activity…'}</p>
							</div>
							<span
								class="chat-entry__indicator"
								style={`background:${statusPalette[agent.status]};`}
							></span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>


<style>
	.chat-sheet {
		position: fixed;
		bottom: clamp(0.75rem, 3vw, 1.75rem);
		right: clamp(0.75rem, 3vw, 1.5rem);
		width: min(420px, calc(100vw - 2rem));
		max-height: 80vh;
		background: var(--chat-panel-bg);
		color: var(--chat-panel-text);
		border-radius: 24px;
		padding: 1rem 1.1rem;
		box-shadow: var(--chat-panel-shadow);
		transform: translateY(110%);
		transition: transform 0.3s ease;
		z-index: 30;
		border: 1px solid var(--chat-panel-border);
		backdrop-filter: blur(18px);
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.chat-sheet.open {
		transform: translateY(0);
	}

	.chat-sheet__header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.4rem;
	}

	.chat-sheet__title {
		margin: 0;
		font-weight: 700;
		font-size: 1rem;
	}

	.chat-sheet__subtitle {
		margin: 0;
		font-size: 0.75rem;
		color: var(--chat-panel-muted);
	}

	.chat-sheet__last-action {
		margin: 0;
		font-size: 0.75rem;
		color: var(--chat-panel-muted);
	}

	.chat-sheet__mini {
		padding: 0.35rem 0.7rem;
		border-radius: 999px;
		border: 1px solid var(--navigation-link-border);
		background: var(--card-background);
		color: var(--text-color);
		font-size: 0.75rem;
		cursor: pointer;
		font-weight: 600;
	}

	.chat-sheet__mini.ghost {
		background: transparent;
		color: var(--chat-panel-muted);
	}

	.chat-sheet__body {
		max-height: 60vh;
		overflow: hidden;
	}

	.chat-sheet__list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
		max-height: 55vh;
		overflow-y: auto;
	}

	.chat-entry {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.4rem;
		border-radius: 14px;
		background: var(--chat-entry-bg);
		border: 1px solid var(--chat-entry-border);
		cursor: pointer;
		transition: transform 0.2s ease;
	}

	.chat-entry:hover {
		transform: translateX(3px);
	}

	.chat-entry__avatar {
		width: 44px;
		height: 44px;
		border-radius: 12px;
		background: var(--chat-avatar-bg);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		letter-spacing: 0.08em;
	}

	.chat-entry__content {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.chat-entry__top {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: var(--chat-panel-text);
	}

	.chat-entry__top span {
		font-size: 0.7rem;
		color: var(--chat-panel-muted);
	}

	.chat-entry__content p {
		margin: 0;
		font-size: 0.75rem;
		color: var(--chat-panel-muted);
	}

	.chat-entry__indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid var(--chat-entry-border);
	}

	.chat-sheet__detail {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.chat-sheet__detail-meta {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.chat-sheet__status {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid var(--chat-entry-border);
	}

	.chat-sheet__messages {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.chat-sheet__message {
		margin: 0;
		padding: 0.65rem 0.8rem;
		border-radius: 18px;
		font-size: 0.8rem;
		max-width: 85%;
	}

	.chat-sheet__message.incoming {
		background: rgba(37, 99, 235, 0.12);
		color: var(--text-color);
	}

	.chat-sheet__message.outgoing {
		background: rgba(15, 23, 42, 0.08);
		align-self: flex-end;
		color: var(--text-color);
	}

	.chat-sheet__back {
		border: none;
		background: var(--primary);
		color: #fff;
		padding: 0.55rem 0.9rem;
		border-radius: 999px;
		cursor: pointer;
		font-weight: 600;
		align-self: flex-start;
	}

	.chat-sheet__placeholder {
		margin: 0;
		color: var(--chat-panel-muted);
	}

	@media (max-width: 780px) {
		.chat-sheet {
			right: 0.5rem;
			bottom: 0.5rem;
			width: calc(100vw - 1rem);
		}

	}
</style>
