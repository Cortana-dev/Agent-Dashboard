<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	const THEME_STORAGE_KEY = 'agent-dashboard-theme';

	let theme: 'light' | 'dark' = 'light';

	const applyTheme = (value: 'light' | 'dark') => {
		if (!browser) return;
		document.documentElement.dataset.theme = value;
		localStorage.setItem(THEME_STORAGE_KEY, value);
	};

	const toggleTheme = () => {
		theme = theme === 'light' ? 'dark' : 'light';
		applyTheme(theme);
	};

	onMount(() => {
		if (!browser) return;
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === 'dark' || stored === 'light') {
			theme = stored;
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
		}
		applyTheme(theme);
	});
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
		<button
			type="button"
			class="theme-toggle"
			aria-pressed={theme === 'dark'}
			on:click={toggleTheme}
		>
			{#if theme === 'light'}
				<span aria-hidden="true">🌙</span>
				<span>Enable dark mode</span>
			{:else}
				<span aria-hidden="true">☀️</span>
				<span>Enable light mode</span>
			{/if}
		</button>
	</header>

	<main>
		<slot />
	</main>
</div>

<style>
	:global(:root) {
		color-scheme: light;
		--page-bg: radial-gradient(circle at 20% -10%, #eef2ff 0%, #f8fafc 40%, #ffffff 100%);
		--text-color: #0f172a;
		--muted-text: #6b7280;
		--card-background: #ffffff;
		--primary: #2563eb;
		--primary-muted: #f0f5ff;
		--guide-bg: #11182714;
		--border-color: rgba(15, 23, 42, 0.08);
	}

	:global(:root[data-theme='dark']) {
		color-scheme: dark;
		--page-bg: radial-gradient(circle at 15% -5%, rgba(59, 130, 246, 0.25) 0%, #020617 55%, #020617 100%);
		--text-color: #e2e8f0;
		--muted-text: #cbd5f5;
		--card-background: rgba(15, 23, 42, 0.85);
		--primary: #60a5fa;
		--primary-muted: rgba(59, 130, 246, 0.15);
		--guide-bg: rgba(148, 163, 184, 0.2);
		--border-color: rgba(148, 163, 184, 0.4);
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

	.theme-toggle {
		border: 1px solid var(--border-color);
		background: var(--card-background);
		color: var(--text-color);
		border-radius: 999px;
		padding: 0.55rem 1.2rem;
		font-weight: 600;
		font-size: 0.95rem;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		cursor: pointer;
		box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.theme-toggle:hover {
		transform: translateY(-1px);
		box-shadow: 0 12px 25px rgba(15, 23, 42, 0.18);
	}

	@media (max-width: 768px) {
		.page-shell {
			padding: 0 1rem 2rem;
		}

		.page-shell__header {
			flex-direction: column;
			align-items: flex-start;
		}

		.theme-toggle {
			width: 100%;
			justify-content: center;
		}
	}
</style>
