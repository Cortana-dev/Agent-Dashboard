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
		background: radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.4), transparent 35%),
			linear-gradient(180deg, #020617 0%, #030712 35%, #050b1a 70%, #020617 100%);
		color: #e0e7ff;
		min-height: 100vh;
	}

	.page-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 1rem;
		background: radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.2), transparent 45%);
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
