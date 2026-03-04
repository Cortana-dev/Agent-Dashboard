<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let message = 'Unable to load agent data.';

	const dispatch = createEventDispatcher();

	const handleRetry = () => {
		dispatch('retry');
	};
</script>

<section class="error-banner" role="alert">
	<div>
		<p>{message}</p>
	</div>
	<button type="button" on:click={handleRetry}>Retry</button>
</section>

<style>
	.error-banner {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border-radius: 12px;
		background: rgba(248, 113, 113, 0.15);
		border: 1px solid rgba(248, 113, 113, 0.5);
		color: #991b1b;
	}

	.error-banner button {
		border: none;
		background: #991b1b;
		color: #fff;
		padding: 0.4rem 0.9rem;
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
	}
</style>
