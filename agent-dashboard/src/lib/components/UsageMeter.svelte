<script lang="ts">
	export let label = '';
	export let percent = 0;
	export let variant: 'daily' | 'monthly' = 'daily';

	$: clamped = Math.max(0, Math.min(100, percent));
	$: accent = clamped > 90 ? 'danger' : clamped > 80 ? 'warning' : 'success';
</script>

<div
	class={`usage-meter usage-meter--${variant}`}
	role="progressbar"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={clamped}
	aria-label={`${label} usage ${Math.round(clamped)}%`}
>
	<div class="usage-meter__track">
		<div class={`usage-meter__fill ${accent}`} style={`width:${clamped}%`}></div>
	</div>
	<div class="usage-meter__meta">
		<span>{label} usage</span>
		<strong>{Math.round(clamped)}%</strong>
	</div>
</div>

<style>
	.usage-meter {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.usage-meter__track {
		position: relative;
		width: 100%;
		height: 0.5rem;
		border-radius: 999px;
		background: rgba(15, 23, 42, 0.08);
		overflow: hidden;
	}

	.usage-meter__fill {
		height: 100%;
		border-radius: inherit;
		transition: width 0.4s ease;
	}

	.usage-meter__fill.success {
		background: linear-gradient(90deg, #34d399, #10b981);
	}

	.usage-meter__fill.warning {
		background: linear-gradient(90deg, #fcd34d, #f97316);
	}

	.usage-meter__fill.danger {
		background: linear-gradient(90deg, #fb7185, #ef4444);
	}

	.usage-meter__meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted-text, #6b7280);
	}

	.usage-meter--monthly .usage-meter__track {
		background: rgba(37, 99, 235, 0.12);
	}
</style>
