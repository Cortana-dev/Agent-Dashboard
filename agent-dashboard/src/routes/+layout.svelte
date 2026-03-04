<svelte:head>
	<title>Agent dashboard</title>
	<meta
		name="description"
		content="Mobile-first dashboard showing LLM agent health, usage, and actionable context."
	/>
</svelte:head>

<div class="page-shell">
	<main>
		<slot />
	</main>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
		background: radial-gradient(circle at 20% -10%, #eef2ff 0%, #f8fafc 50%, #ffffff 100%);
		color: #0f172a;
		min-height: 100vh;
	}

	.page-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 1rem;
	}

	main {
		flex: 1;
		padding: 2rem 0;
	}

	@media (min-width: 768px) {
		.page-shell {
			padding: 0 1.5rem;
		}
	}
</style>
