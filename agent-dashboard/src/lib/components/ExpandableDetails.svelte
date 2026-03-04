<script lang="ts">
	export let id = '';
	export let lastActive = '';
	export let recentAlerts: string[] = [];
	export let prompts: string[] = [];

	$: lastActiveLabel = (() => {
		const parsed = Date.parse(lastActive);
		if (!Number.isNaN(parsed)) {
			return new Date(parsed).toLocaleString('en-GB', {
				timeStyle: 'short',
				dateStyle: 'medium'
			});
		}
		return 'Unknown';
	})();
</script>

<section id={id} class="expandable-details" aria-live="polite">
	<div class="expandable-details__row">
		<p class="expandable-details__label">Last activity</p>
		<p class="expandable-details__value">{lastActiveLabel}</p>
	</div>

	{#if recentAlerts.length}
		<div class="expandable-details__row">
			<p class="expandable-details__label">Recent alerts</p>
			<ul>
				{#each recentAlerts as alert}
					<li>{alert}</li>
				{/each}
			</ul>
		</div>
	{/if}

	{#if prompts.length}
		<div class="expandable-details__row">
			<p class="expandable-details__label">Top prompts</p>
			<ul class="prompts">
				{#each prompts as prompt}
					<li>{prompt}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="expandable-details__actions">
		<slot name="actions" />
	</div>
</section>

<style>
	.expandable-details {
		padding: 0 1.25rem 1.25rem;
		border-top: 1px solid rgba(15, 23, 42, 0.08);
		background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.9));
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.expandable-details__row {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.expandable-details__label {
		margin: 0;
		font-size: 0.85rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--muted-text, #6b7280);
	}

	.expandable-details__value {
		margin: 0;
		font-size: 1rem;
		font-weight: 600;
	}

	.expandable-details ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.prompts li {
		padding-left: 0.75rem;
		position: relative;
	}

	.prompts li::before {
		content: '–';
		position: absolute;
		left: 0;
		color: var(--muted-text, #9ca3af);
	}

	.expandable-details__actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
