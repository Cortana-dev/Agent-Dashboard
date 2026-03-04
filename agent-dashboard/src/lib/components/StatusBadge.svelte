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
		padding: 0.2rem 0.75rem;
		border-radius: 999px;
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 700;
		color: var(--muted-text, #374151);
	}

	.status-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
	}

	.status-badge.success {
		background: rgba(34, 197, 94, 0.14);
		color: #15803d;
	}

	.status-badge.warning {
		background: rgba(251, 191, 36, 0.18);
		color: #92400e;
	}

	.status-badge.danger {
		background: rgba(248, 113, 113, 0.2);
		color: #b91c1c;
	}

	.status-badge.neutral {
		background: rgba(148, 163, 184, 0.18);
		color: #475569;
	}
</style>
