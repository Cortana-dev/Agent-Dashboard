<script lang="ts">
	export let healthyPct = 0.6;
	export let warningPct = 0.25;
	export let dangerPct = 0.15;

	const clamp = (value: number) => Math.max(0, Math.min(1, value));

	const toDegree = (value: number) => clamp(value) * 360;

	$: healthyDeg = toDegree(healthyPct);
	$: warningDeg = toDegree(warningPct);
	$: dangerDeg = toDegree(dangerPct);
	$: gradient = `conic-gradient(var(--pulse-healthy) 0 ${healthyDeg}deg, var(--pulse-warning) ${healthyDeg}deg ${healthyDeg + warningDeg}deg, var(--pulse-danger) ${healthyDeg + warningDeg}deg 360deg)`;
	$: healthyLabel = `${Math.round(clamp(healthyPct) * 100)}% healthy`;
</script>

<div class="pulse" role="img" aria-label={healthyLabel} style={`background:${gradient};`}>
	<div class="pulse__inner">
		<strong>{healthyLabel}</strong>
		<p>LLM health</p>
	</div>
</div>

<style>
	:global(:root) {
		--pulse-healthy: #22d3ee;
		--pulse-warning: #fcd34d;
		--pulse-danger: #fb7185;
	}

	.pulse {
		width: 82px;
		height: 82px;
		border-radius: 50%;
		padding: 0.6rem;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.01));
		box-shadow: 0 0 20px rgba(59, 130, 246, 0.45);
		display: grid;
		place-items: center;
		position: relative;
	}

	.pulse::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70%;
		height: 70%;
		border-radius: 50%;
		background: #0f172a;
		box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.4);
		z-index: 0;
	}

	.pulse__inner {
		position: relative;
		z-index: 1;
		text-align: center;
		font-size: 0.7rem;
		line-height: 1.3;
		color: #e0e7ff;
	}

	.pulse__inner strong {
		display: block;
		font-size: 0.9rem;
	}

	.pulse__inner p {
		margin: 0;
		font-size: 0.6rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: rgba(226, 232, 240, 0.7);
	}
</style>
