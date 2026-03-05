<script lang="ts">
	import AgentList from '$lib/components/AgentList.svelte';
	import ChatModePanel from '$lib/components/ChatModePanel.svelte';
	import ErrorBanner from '$lib/components/ErrorBanner.svelte';
	import NavigationPanel from '$lib/components/NavigationPanel.svelte';
	import type { AgentSummary, AgentActionEventDetail, AgentActionType } from '$lib/types/agent';
	import type { NavigationItem } from '$lib/types/navigation';

	export let agents: AgentSummary[] = [];
	export let lastUpdated: string = new Date().toISOString();
	export let refresh: () => Promise<void> = async () => {};
	export let isRefreshing = false;
	export let errorMessage: string | null = null;
	export let loading = false;

	let expandedId: string | null = null;
	let sidebarOpen = false;
	let chatModeActive = false;
	let lastAction: { message: string; timestamp: string } | null = null;

	const navItems: NavigationItem[] = [
		{ label: 'Overview', description: 'Mission-wide telemetry' },
		{ label: 'Agents', description: 'Live agent feed' },
		{ label: 'Chat mode', description: 'WhatsApp-style panel' },
		{ label: 'Settings', description: 'Policy and billing' }
	];

	const toggleCard = (id: string) => {
		expandedId = expandedId === id ? null : id;
	};

	const docLink = '/docs/llms.txt';

	const handleRefresh = async () => {
		await refresh();
	};

	const toggleSidebar = () => {
		sidebarOpen = !sidebarOpen;
	};

	const closeSidebar = () => {
		sidebarOpen = false;
	};

	const handleOverlayKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
			event.preventDefault();
			closeSidebar();
		}
	};

	const toggleChatMode = () => {
		chatModeActive = !chatModeActive;
	};

	const handleNavSelect = (event: CustomEvent<NavigationItem>) => {
		closeSidebar();
	};

	const actionLabels: Record<AgentActionType, string> = {
		inspect: 'viewed the logs',
		check: 'ran a health check',
		restart: 'queued a restart',
		stop: 'sent a stop command'
	};

	const handleCardAction = (event: CustomEvent<AgentActionEventDetail>) => {
		const { type, agentId } = event.detail;
		const agent = agents.find((entry) => entry.id === agentId);
		lastAction = {
			message: `${agent?.name ?? 'Agent'} ${actionLabels[type] ?? type}`,
			timestamp: new Date().toLocaleTimeString('en-GB', {
				hour: '2-digit',
				minute: '2-digit'
			})
		};
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
	<div
		class={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
		role="button"
		tabindex="0"
		aria-label="Close navigation"
		on:click={closeSidebar}
		on:keydown={handleOverlayKeyDown}
	></div>

	<aside class={`sidebar ${sidebarOpen ? 'open' : ''}`}>
		<NavigationPanel items={navItems} on:select={handleNavSelect} />
		<p class="sidebar__note">Tap outside or the close icon to hide the sidebar.</p>
	</aside>

	<div class="dashboard__box">
		<header class="dashboard__header">
			<div class="dashboard__header-left">
				<button
					type="button"
					class="hamburger"
					aria-expanded={sidebarOpen}
					aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
					on:click={toggleSidebar}
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
				<div>
					<p class="eyebrow">Agent console</p>
					<h1>Agents</h1>
				</div>
			</div>
			<div class="dashboard__header-actions">
				<button type="button" class={`chat-toggle ${chatModeActive ? 'active' : ''}`} aria-pressed={chatModeActive} on:click={toggleChatMode}>
					<span aria-hidden="true">💬</span>
					<span>{chatModeActive ? 'Chat mode active' : 'Enter chat mode'}</span>
				</button>

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
			</div>
		</header>

		<p class="last-updated">Last updated {formattedUpdated}</p>

		{#if errorMessage}
			<ErrorBanner message={errorMessage} on:retry={handleRefresh} />
		{/if}

		<AgentList
			agents={agents}
			expandedId={expandedId}
			onToggle={toggleCard}
			onAction={handleCardAction}
			loading={loading || isRefreshing}
		/>

		<div class="llm-guidance">
			<p>
				LLM usage notes live in <a href={docLink} target="_blank" rel="noreferrer">{docLink}</a>.
				Keep prompts scoped, recycle trusted system instructions, and monitor monthly usage so you can act before limits are hit.
			</p>
			<p class="guidance__meta">Key reminders: short prompts, 80% usage alerts, clear system instructions.</p>
		</div>
	</div>

	<ChatModePanel
		agents={agents}
		open={chatModeActive}
		activeAgentId={expandedId}
		lastAction={lastAction}
		onClose={() => (chatModeActive = false)}
	/>
</section>

<style>
	.dashboard {
		position: relative;
		min-height: 100vh;
		padding: clamp(1rem, 3vw, 1.5rem);
		background: var(--canvas, #f6f7fb);
		display: flex;
		justify-content: center;
		color: var(--text-color);
	}

	.dashboard__box {
		width: min(640px, 100%);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.sidebar-overlay {
		position: fixed;
		inset: 0;
		background: rgba(15, 23, 42, 0.65);
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.3s ease;
		z-index: 15;
		cursor: pointer;
		outline: none;
	}

	.sidebar-overlay.visible {
		opacity: 1;
		visibility: visible;
	}

	.sidebar-overlay:focus-visible {
		outline: 2px solid rgba(37, 99, 235, 0.7);
	}

	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: min(280px, 80vw);
		max-width: 320px;
		background: var(--sidebar-bg);
		color: var(--sidebar-text);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		transform: translateX(-110%);
		transition: transform 0.3s ease;
		z-index: 20;
		box-shadow: var(--sidebar-shadow);
		border-right: 1px solid var(--sidebar-border);
	}

	.sidebar.open {
		transform: translateX(0);
	}

	.sidebar__note {
		margin-top: auto;
		font-size: 0.75rem;
		color: var(--muted-text);
		line-height: 1.4;
	}

	.dashboard__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--surface-bg);
		border-radius: 18px;
		box-shadow: var(--surface-shadow);
		border: 1px solid var(--surface-border);
	}

	.dashboard__header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.dashboard__header h1 {
		margin: 0;
		font-size: clamp(1.7rem, 4vw, 2.4rem);
	}

	.hamburger {
		width: 48px;
		height: 48px;
		border-radius: 14px;
		border: 1px solid var(--border-color);
		background: var(--surface-bg);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		padding: 0.4rem;
		cursor: pointer;
		box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
	}

	.hamburger span {
		display: block;
		width: 22px;
		height: 2px;
		border-radius: 999px;
		background: var(--text-color);
	}

	.dashboard__header-actions {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		flex-wrap: wrap;
	}

	.chat-toggle {
		border: none;
		border-radius: 999px;
		padding: 0.55rem 1rem;
		font-weight: 600;
		background: rgba(37, 99, 235, 0.12);
		color: var(--primary, #2563eb);
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		cursor: pointer;
		transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
	}

	.chat-toggle.active {
		background: var(--primary, #2563eb);
		color: #ffffff;
		box-shadow: 0 10px 30px rgba(37, 99, 235, 0.25);
	}

	.chat-toggle:focus-visible,
	.chat-toggle:hover {
		transform: translateY(-1px);
	}

	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-size: 0.7rem;
		color: var(--muted-text, #8a95a1);
	}

	.last-updated {
		margin: 0 1rem;
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
		border: 1px solid var(--surface-border);
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

	@media (max-width: 640px) {
		.dashboard__header {
			flex-direction: column;
			align-items: flex-start;
		}

		.dashboard__header-actions {
			width: 100%;
			justify-content: flex-start;
		}

		.chat-toggle,
		.refresh {
			flex: 1;
			text-align: center;
		}
	}

	@media (max-width: 480px) {
		.dashboard__header {
			padding: 0.8rem 1rem;
		}

		.hamburger {
			width: 42px;
			height: 42px;
		}
	}
</style>
