<script lang="ts">
	import { onDestroy } from 'svelte';
	import AgentList from '$lib/components/AgentList.svelte';
	import ChatSheet from '$lib/components/ChatSheet.svelte';
	import ErrorBanner from '$lib/components/ErrorBanner.svelte';
	import NavigationPanel from '$lib/components/NavigationPanel.svelte';
	import TopNavbar from '$lib/components/TopNavbar.svelte';
	import { theme, toggleTheme } from '$lib/stores/theme';
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
	let lastAction: { message: string; timestamp: string } | null = null;
	let activeNavId = 'agents';
	let chatContactId: string | null = null;
	let chatModeActive = false;
	let currentTheme: 'light' | 'dark' = 'light';

	const docLink = '/docs/llms.txt';

	const navItems: NavigationItem[] = [
		{ id: 'overview', label: 'Overview', description: 'Mission-wide telemetry' },
		{ id: 'agents', label: 'Agents', description: 'Live agent feed' },
		{ id: 'chat', label: 'Chat mode', description: 'WhatsApp-style panel' },
		{ id: 'settings', label: 'Settings', description: 'Policy and billing' }
	];
	const navLinkItems = navItems.filter((item) => item.id !== 'chat');
	const headerNavItems = navLinkItems;

	const unsubscribeTheme = theme.subscribe((value) => {
		currentTheme = value;
	});

	onDestroy(() => {
		unsubscribeTheme();
	});

	const toggleCard = (id: string) => {
		expandedId = expandedId === id ? null : id;
	};

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

	const activateNavItem = (item: NavigationItem) => {
		activeNavId = item.id;
		const isChatMode = item.id === 'chat';
		chatModeActive = isChatMode;
		if (!isChatMode) {
			chatContactId = null;
			expandedId = null;
		}
		closeSidebar();
	};

	const handleNavSelection = (event: CustomEvent<NavigationItem>) => {
		activateNavItem(event.detail);
	};

	const switchToAgentMode = () => {
		const agentItem = navItems.find((entry) => entry.id === 'agents');
		if (agentItem) {
			activateNavItem(agentItem);
		}
	};

	const switchToChatMode = () => {
		const chatItem = navItems.find((entry) => entry.id === 'chat');
		if (chatItem) {
			activateNavItem(chatItem);
		}
	};

	const closeChatPanel = () => {
		chatModeActive = false;
		chatContactId = null;
		expandedId = null;
		activeNavId = 'agents';
	};

	const selectChatContact = (agentId: string) => {
		chatModeActive = true;
		activeNavId = 'chat';
		chatContactId = agentId;
		expandedId = agentId;
	};

	const closeChatDetail = () => {
		chatContactId = null;
		expandedId = null;
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

	$: isChatMode = activeNavId === 'chat';
	$: isAgentMode = !isChatMode;

	$: parsedValue = Date.parse(lastUpdated);
	$: formattedUpdated = !Number.isNaN(parsedValue)
		? new Date(parsedValue).toLocaleString('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit'
			})
		: 'Unknown';

	$: activeNavItem = navItems.find((item) => item.id === activeNavId) ?? navItems[1];
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
		<NavigationPanel items={navLinkItems} activeId={activeNavId} on:select={handleNavSelection}>
			<div slot="header-actions" class="sidebar__header-actions">
				<button
					type="button"
					class="sidebar__theme-mini"
					on:click={toggleTheme}
					aria-label="Toggle light and dark theme"
				>
					{currentTheme === 'dark' ? '☀️' : '🌙'}
				</button>
				<button
					type="button"
					class="sidebar__close-mini"
					on:click={closeSidebar}
					aria-label="Close navigation"
				>
					<span aria-hidden="true">×</span>
				</button>
			</div>
		</NavigationPanel>
		<div class="sidebar__modes" role="group" aria-label="View modes">
			<p class="sidebar__modes-label">View modes</p>
			<div class="sidebar__modes-actions">
				<button
					type="button"
					class="sidebar__mode-button"
					class:active={isAgentMode}
					aria-pressed={isAgentMode}
					on:click={switchToAgentMode}
				>
					Agent mode (default)
				</button>
				<button
					type="button"
					class="sidebar__mode-button"
					class:active={isChatMode}
					aria-pressed={isChatMode}
					on:click={switchToChatMode}
				>
					Chat mode
				</button>
			</div>
		</div>
		<p class="sidebar__note">Tap outside or the close icon to hide the sidebar.</p>
	</aside>


	<div class="dashboard__box">
		<header class="dashboard__header console-card">
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
				<div class="dashboard__branding">
					<p class="eyebrow">Agent console</p>
					<h1>Agents</h1>
				</div>
				<div class="dashboard__mode-indicator">
					<strong>Active mode</strong>
					<span>{activeNavItem.label}</span>
				</div>
			</div>
			<div class="dashboard__header-right">
				<TopNavbar items={headerNavItems} activeId={activeNavId} disabled={isChatMode} on:select={handleNavSelection} />
				<div class="dashboard__header-controls">
					
					<button type="button" class="theme-pill" on:click={toggleTheme}>
						{currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
					</button>
				</div>
			</div>
		</header>

		<main class="dashboard__content">
			<div class="dashboard__status-row">
				<p>Last updated {formattedUpdated}</p>
				<span class="status-chip">Mode: {activeNavItem.label}</span>
			</div>

			{#if errorMessage}
				<ErrorBanner message={errorMessage} on:retry={handleRefresh} />
			{/if}

			{#if activeNavId === 'overview'}
				<section class="overview-panel">
					<h2>Snapshot</h2>
					<p>Overview stats, usage, and mission notes live here. Keep an eye on monthly spend and prompt hygiene.</p>
					<div class="overview-panel__cards">
						<div>
							<p>Monthly spend</p>
							<strong>82%</strong>
						</div>
						<div>
							<p>Live agents</p>
							<strong>{agents.length}</strong>
						</div>
					</div>
					<div class="llm-guidance">
						<p>
							LLM usage notes live in <a href={docLink} target="_blank" rel="noreferrer">{docLink}</a>.
							Keep prompts scoped, recycle trusted system instructions, and monitor monthly usage so you can act before limits are hit.
						</p>
						<p class="guidance__meta">Key reminders: short prompts, 80% usage alerts, clear system instructions.</p>
					</div>
				</section>
			{:else if activeNavId === 'settings'}
				<section class="overview-panel">
					<h2>Settings & policies</h2>
					<p>Placeholder for governance, billing, and plan controls. You can place toggles here later.</p>
				</section>
			{:else}
				<AgentList
					agents={agents}
					expandedId={expandedId}
					onToggle={toggleCard}
					onAction={handleCardAction}
					loading={loading || isRefreshing}
				/>
			{/if}
		</main>
	</div>
	<ChatSheet
		agents={agents}
		open={chatModeActive}
		expandedAgentId={chatContactId}
		lastAction={lastAction}
		onEntrySelect={selectChatContact}
		onDetailClose={closeChatDetail}
		onClose={closeChatPanel}
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
		width: min(720px, 100%);
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
	.sidebar__modes {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.5rem 0;
		border-top: 1px solid var(--navigation-link-border);
		border-bottom: 1px solid var(--navigation-link-border);
	}
	.sidebar__modes-label {
		margin: 0;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--muted-text);
	}
	.sidebar__modes-actions {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}
	.sidebar__mode-button {
		border: 1px solid var(--navigation-link-border);
		border-radius: 999px;
		background: var(--navigation-link-bg);
		color: var(--sidebar-text);
		padding: 0.35rem 0.95rem;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
	}
	.sidebar__mode-button:hover,
	.sidebar__mode-button:focus-visible {
		transform: translateY(-1px);
		border-color: var(--primary);
	}
	.sidebar__mode-button.active {
		background: var(--primary);
		color: #fff;
		border-color: transparent;
	}


	.sidebar__header-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.35rem;
	}

	.sidebar__theme-mini,
	.sidebar__close-mini {
		border: 1px solid var(--navigation-link-border);
		border-radius: 999px;
		padding: 0.35rem 0.85rem;
		font-size: 0.75rem;
		background: var(--navigation-link-bg);
		color: var(--sidebar-text);
		cursor: pointer;
		transition: background 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
	}

	.sidebar__close-mini {
		padding: 0.35rem 0.65rem;
	}

	.dashboard__header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem 1.25rem;
		background: var(--surface-bg);
		border-radius: 18px;
		border: 1px solid var(--surface-border);
		box-shadow: var(--surface-shadow);
	}

	.dashboard__header-left {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.dashboard__branding h1 {
		margin: 0;
		font-size: clamp(1.8rem, 3vw, 2.4rem);
	}

	.dashboard__mode-indicator {
		display: flex;
		flex-direction: column;
		font-size: 0.75rem;
		color: var(--muted-text);
	}

	.dashboard__mode-indicator span {
		font-weight: 600;
		color: var(--text-color);
	}

	.dashboard__header-right {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.dashboard__header-controls {
		display: flex;
		gap: 0.65rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.theme-pill {
		border: 1px solid var(--border-color);
		background: var(--surface-bg);
		color: var(--text-color);
		border-radius: 999px;
		padding: 0.35rem 0.9rem;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
		transition: transform 0.2s ease, border-color 0.2s ease;
	}

	.theme-pill:hover {
		transform: translateY(-1px);
		border-color: var(--primary);
	}

	.dashboard__content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.dashboard__status-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.85rem;
		color: var(--muted-text);
	}

	.status-chip {
		padding: 0.35rem 0.9rem;
		border-radius: 999px;
		border: 1px solid var(--border-color);
	}

	.overview-panel {
		padding: 1rem 1.2rem;
		border-radius: 16px;
		background: var(--surface-bg);
		border: 1px solid var(--surface-border);
		box-shadow: var(--surface-shadow);
	}

	.overview-panel__cards {
		display: flex;
		gap: 1rem;
		margin-top: 0.75rem;
	}

	.overview-panel__cards > div {
		flex: 1;
		border-radius: 14px;
		background: var(--card-background);
		padding: 0.8rem 1rem;
		border: 1px solid var(--border-color);
		box-shadow: var(--card-shadow, 0 12px 30px rgba(15, 23, 42, 0.08));
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
		color: var(--primary);
		text-decoration: underline;
	}

	.guidance__meta {
		margin-top: 0.5rem;
		font-size: 0.8rem;
	}

	@media (min-width: 900px) {
		.dashboard__header {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.dashboard__header-right {
			flex-direction: row;
			align-items: center;
			gap: 1rem;
		}

		.dashboard__header-controls {
			margin-left: auto;
		}
	}

	@media (max-width: 640px) {
		.overview-panel__cards {
			flex-direction: column;
		}
	}
</style>
