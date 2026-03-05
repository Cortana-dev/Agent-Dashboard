<script lang="ts">
	import { onMount } from 'svelte';
	import { initTheme } from '$lib/stores/theme';

	onMount(initTheme);
</script>

<svelte:head>
	<title>Agent dashboard</title>
	<meta
		name="description"
		content="Mobile-first dashboard showing LLM agent health, usage, and actionable context."
	/>
</svelte:head>

<div class="page-shell">
	<header class="page-shell__header">
		<div>
			<p class="eyebrow">Agent dashboard</p>
			<h1>Agent console</h1>
		</div>
	</header>

	<main>
		<slot />
	</main>
</div>

<style>
	:global(:root) {
		color-scheme: light;
		--page-bg: radial-gradient(circle at 20% -10%, #eef2ff 0%, #f8fafc 40%, #ffffff 100%);
		--canvas: #f6f7fb;
		--text-color: #0f172a;
		--muted-text: #6b7280;
		--card-background: #ffffff;
		--card-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
		--primary: #2563eb;
		--primary-muted: #f0f5ff;
		--guide-bg: #11182714;
		--border-color: rgba(15, 23, 42, 0.08);
		--surface-bg: #ffffff;
		--surface-border: rgba(15, 23, 42, 0.08);
		--surface-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
		--sidebar-bg: rgba(255, 255, 255, 0.96);
		--sidebar-text: #0f172a;
		--sidebar-border: rgba(15, 23, 42, 0.08);
		--sidebar-shadow: 20px 0 60px rgba(15, 23, 42, 0.2);
		--navigation-link-bg: rgba(148, 163, 184, 0.08);
		--navigation-link-border: rgba(148, 163, 184, 0.25);
		--navigation-link-hover: rgba(148, 163, 184, 0.16);
		--chat-panel-bg: rgba(255, 255, 255, 0.94);
		--chat-panel-border: rgba(15, 23, 42, 0.12);
		--chat-panel-shadow: 0 20px 45px rgba(15, 23, 42, 0.15);
		--chat-panel-text: #0f172a;
		--chat-panel-muted: rgba(15, 23, 42, 0.6);
		--chat-entry-bg: rgba(15, 23, 42, 0.04);
		--chat-entry-border: rgba(15, 23, 42, 0.08);
		--chat-entry-active-bg: rgba(37, 99, 235, 0.12);
		--chat-avatar-bg: rgba(148, 163, 184, 0.3);
	}

	:global(:root[data-theme='dark']) {
		color-scheme: dark;
		--page-bg: radial-gradient(circle at 15% -5%, rgba(59, 130, 246, 0.25) 0%, #020617 55%, #020617 100%);
		--canvas: #020617;
		--text-color: #e2e8f0;
		--muted-text: #cbd5f5;
		--card-background: rgba(15, 23, 42, 0.85);
		--card-shadow: 0 8px 20px rgba(0, 0, 0, 0.65);
		--primary: #60a5fa;
		--primary-muted: rgba(59, 130, 246, 0.15);
		--guide-bg: rgba(148, 163, 184, 0.2);
		--border-color: rgba(148, 163, 184, 0.4);
		--surface-bg: rgba(15, 23, 42, 0.9);
		--surface-border: rgba(148, 163, 184, 0.4);
		--surface-shadow: 0 15px 35px rgba(2, 6, 23, 0.9);
		--sidebar-bg: rgba(2, 6, 23, 0.95);
		--sidebar-text: #e2e8f0;
		--sidebar-border: rgba(148, 163, 184, 0.4);
		--sidebar-shadow: 20px 0 60px rgba(2, 6, 23, 0.9);
		--navigation-link-bg: rgba(148, 163, 184, 0.12);
		--navigation-link-border: rgba(148, 163, 184, 0.25);
		--navigation-link-hover: rgba(148, 163, 184, 0.2);
		--chat-panel-bg: rgba(2, 6, 23, 0.9);
		--chat-panel-border: rgba(148, 163, 184, 0.3);
		--chat-panel-shadow: 0 20px 45px rgba(2, 6, 23, 0.6);
		--chat-panel-text: #e2e8f0;
		--chat-panel-muted: rgba(148, 163, 184, 0.85);
		--chat-entry-bg: rgba(148, 163, 184, 0.12);
		--chat-entry-border: rgba(148, 163, 184, 0.3);
		--chat-entry-active-bg: rgba(37, 99, 235, 0.2);
		--chat-avatar-bg: rgba(148, 163, 184, 0.2);
	}

	:global(body) {
		margin: 0;
		font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
		background: var(--page-bg);
		color: var(--text-color);
		min-height: 100vh;
		transition: background 0.4s ease, color 0.4s ease;
	}

	.page-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 1rem 2rem;
		max-width: 1100px;
		margin: 0 auto;
	}

	.page-shell__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem 0 0rem;
	}

	.page-shell__header h1 {
		margin: 0;
		font-size: clamp(1.6rem, 3vw, 2.2rem);
	}

	.page-shell__header .eyebrow,
	.eyebrow {
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-size: 0.6rem;
		color: var(--muted-text);
	}

	main {
		flex: 1;
		padding: 0;
	}

	@media (max-width: 768px) {
		.page-shell {
			padding: 0 1rem 2rem;
		}

		.page-shell__header {
			flex-direction: column;
			align-items: flex-start;
		}

	}
</style>
