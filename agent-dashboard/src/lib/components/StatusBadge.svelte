<script lang="ts">
	import type { AgentStatus } from '$lib/types/agent';

	const statusMap: Record<AgentStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
		online: { label: 'Online', tone: 'success' },
		idle: { label: 'Idle', tone: 'neutral' },
		paused: { label: 'Paused', tone: 'warning' },
		error: { label: 'Issue', tone: 'danger' }
	};

	export let status: AgentStatus;

	$: current = statusMap[status] ?? statusMap.idle;
</script>

<span class={`status-badge ${current.tone}`}>
	<span class="status-dot" aria-hidden="true"></span>
	{current.label}
</span>

<style>
	.status-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.25rem 0.85rem;
		border-radius: 999px;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		font-weight: 700;
		color: #e2e8f0;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.status-dot {
		width: 0.55rem;
		height: 0.55rem;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 12px currentColor;
	}

	.status-badge.success {
		border-color: rgba(34, 197, 94, 0.6);
		color: #4ade80;
	}

	.status-badge.warning {
		border-color: rgba(251, 191, 36, 0.6);
		color: #facc15;
	}

	.status-badge.danger {
		border-color: rgba(248, 113, 113, 0.7);
		color: #fb7185;
	}

	.status-badge.neutral {
		border-color: rgba(148, 163, 184, 0.5);
		color: #93c5fd;
	}
</style>
