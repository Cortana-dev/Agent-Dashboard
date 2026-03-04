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
		border-radius: 14px;
		background: rgba(248, 113, 113, 0.15);
		border: 1px solid rgba(248, 113, 113, 0.5);
		color: #fecdd3;
		box-shadow: 0 10px 25px rgba(248, 113, 113, 0.35);
	}

	.error-banner button {
		border: none;
		background: linear-gradient(135deg, #f43f5e, #dc2626);
		color: #fff;
		padding: 0.4rem 0.95rem;
		border-radius: 999px;
		font-weight: 600;
		cursor: pointer;
		box-shadow: 0 8px 18px rgba(220, 38, 38, 0.5);
	}
</style>
