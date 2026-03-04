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
		height: 0.55rem;
		border-radius: 999px;
		background: rgba(59, 130, 246, 0.15);
		overflow: hidden;
		box-shadow: inset 0 0 10px rgba(2, 6, 23, 0.8);
	}

	.usage-meter__fill {
		height: 100%;
		border-radius: inherit;
		transition: width 0.4s ease;
		box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
	}

	.usage-meter__fill.success {
		background: linear-gradient(90deg, #34d399, #10b981);
		box-shadow: 0 0 18px rgba(16, 185, 129, 0.7);
	}

	.usage-meter__fill.warning {
		background: linear-gradient(90deg, #fcd34d, #f97316);
		box-shadow: 0 0 18px rgba(249, 115, 22, 0.7);
	}

	.usage-meter__fill.danger {
		background: linear-gradient(90deg, #fb7185, #ef4444);
		box-shadow: 0 0 18px rgba(248, 113, 113, 0.7);
	}

	.usage-meter__meta {
		display: flex;
		justify-content: space-between;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #cbd5f5;
	}

	.usage-meter--monthly .usage-meter__track {
		background: rgba(59, 130, 246, 0.2);
	}
</style>
