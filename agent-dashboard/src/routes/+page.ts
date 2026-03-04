import type { PageLoad } from './$types';
import type { AgentSummary, TimelineEvent, TimelineSeverity, HealthPulse } from '$lib/types/agent';

const agentSeeds: (Omit<AgentSummary, 'lastActive' | 'activityTimeline' | 'healthPulse'> & { lastActiveOffsetMs: number })[] = [
	{
		id: 'atlas',
		name: 'Atlas',
		status: 'online',
		dailyUsagePercent: 36,
		monthlyUsagePercent: 54,
		dailyTokens: 38_200,
		monthlyTokens: 420_150,
		recentAlerts: [],
		topPrompts: ['Summarize customer sentiment', 'Generate onboarding checklist', 'Plan integrations roadmap'],
		lastActiveOffsetMs: 5 * 60_000
	},
	{
		id: 'lumen',
		name: 'Lumen',
		status: 'paused',
		dailyUsagePercent: 11,
		monthlyUsagePercent: 73,
		dailyTokens: 12_400,
		monthlyTokens: 682_100,
		recentAlerts: ['Paused for maintenance', 'Awaiting new knowledge base sync'],
		topPrompts: ['Review codebase changelog', 'Prepare release notes'],
		lastActiveOffsetMs: 28 * 60_000
	},
	{
		id: 'zenith',
		name: 'Zenith',
		status: 'idle',
		dailyUsagePercent: 62,
		monthlyUsagePercent: 89,
		dailyTokens: 54_700,
		monthlyTokens: 900_230,
		recentAlerts: ['Monthly spending at 89% of limit', 'Suggest throttling digest prompts'],
		topPrompts: ['Draft product summary', 'Suggest outreach cadence', 'Highlight competing differentiators'],
		lastActiveOffsetMs: 3 * 60_000
	},
	{
		id: 'kepler',
		name: 'Kepler',
		status: 'error',
		dailyUsagePercent: 48,
		monthlyUsagePercent: 34,
		dailyTokens: 21_580,
		monthlyTokens: 312_000,
		recentAlerts: ['Model endpoint responded with 503 twice today'],
		topPrompts: ['Triaging incident response', 'Estimate recovery time'],
		lastActiveOffsetMs: 12 * 60_000
	}
];

const timelineSeeds: Record<
	string,
	{
		label: string;
		detail: string;
		severity: TimelineEvent['severity'];
		type: TimelineEvent['type'];
		minutesAgo: number;
	}[]
> = {
	atlas: [
		{ label: 'Model warm-up', detail: 'Auto-scaling warmed the GPU endpoint.', severity: 'success', type: 'status', minutesAgo: 140 },
		{ label: 'Burst of requests', detail: 'Onboarding traffic spiked briefly.', severity: 'warning', type: 'spike', minutesAgo: 95 },
		{ label: 'Sync check', detail: 'Background sync stayed healthy.', severity: 'success', type: 'status', minutesAgo: 60 },
		{ label: 'Latency lull', detail: 'Queue time trimmed by 25ms.', severity: 'success', type: 'status', minutesAgo: 28 },
		{ label: 'Signal steady', detail: 'Response time < 250ms.', severity: 'success', type: 'status', minutesAgo: 6 },
		{ label: 'Fresh data', detail: 'Realtime ingest finished.', severity: 'success', type: 'status', minutesAgo: 1 }
	],
	lumen: [
		{ label: 'Maintenance start', detail: 'Paused for knowledge-base refresh.', severity: 'warning', type: 'alert', minutesAgo: 180 },
		{ label: 'Dry run', detail: 'Warmup prompts keep heartbeats alive.', severity: 'warning', type: 'status', minutesAgo: 150 },
		{ label: 'Sync glitch', detail: 'Retry launched after sync failure.', severity: 'danger', type: 'alert', minutesAgo: 80 },
		{ label: 'Holding pattern', detail: 'Awaiting new dataset unlock.', severity: 'warning', type: 'status', minutesAgo: 20 },
		{ label: 'Paused idle', detail: 'Manual pause still holds.', severity: 'warning', type: 'status', minutesAgo: 2 }
	],
	zenith: [
		{ label: 'Cost alarm', detail: 'Usage jumped 12% inside a window.', severity: 'warning', type: 'alert', minutesAgo: 140 },
		{ label: 'Latency spike', detail: 'Ops reported >1s responses.', severity: 'danger', type: 'alert', minutesAgo: 110 },
		{ label: 'Throttled', detail: 'Auto-throttle engaged at 20%.', severity: 'warning', type: 'status', minutesAgo: 75 },
		{ label: 'Rebalance', detail: 'Temperature reduced for stability.', severity: 'success', type: 'status', minutesAgo: 30 },
		{ label: 'Idle', detail: 'Waiting for next request.', severity: 'success', type: 'status', minutesAgo: 5 }
	],
	kepler: [
		{ label: 'Endpoint error', detail: '503 repeated twice today.', severity: 'danger', type: 'alert', minutesAgo: 110 },
		{ label: 'Retry attempt', detail: 'Fresh API key circulated.', severity: 'warning', type: 'status', minutesAgo: 70 },
		{ label: 'Handshake fail', detail: 'TLS handshake timed out.', severity: 'danger', type: 'spike', minutesAgo: 30 },
		{ label: 'Diagnostics', detail: 'Investigating the root cause.', severity: 'warning', type: 'status', minutesAgo: 10 },
		{ label: 'Offline', detail: 'Service remains offline.', severity: 'danger', type: 'alert', minutesAgo: 1 }
	]
};

const healthPulseSeeds: Record<string, HealthPulse> = {
	atlas: { healthyPct: 0.74, warningPct: 0.19, dangerPct: 0.07 },
	lumen: { healthyPct: 0.51, warningPct: 0.34, dangerPct: 0.15 },
	zenith: { healthyPct: 0.43, warningPct: 0.37, dangerPct: 0.2 },
	kepler: { healthyPct: 0.32, warningPct: 0.28, dangerPct: 0.4 }
};

const buildTimeline = (
	agentId: string,
	now: number,
	events: {
		label: string;
		detail: string;
		severity: TimelineEvent['severity'];
		type: TimelineEvent['type'];
		minutesAgo: number;
	}[]
): TimelineEvent[] =>
	events
		.map((event, index) => ({
			id: `${agentId}-${index}-${event.type}`,
			timestamp: new Date(now - event.minutesAgo * 60_000).toISOString(),
			label: event.label,
			detail: event.detail,
			severity: event.severity,
			type: event.type
		}))
		.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

export const prerender = false;

export const load: PageLoad = async ({ url }) => {
	const now = Date.now();
	const agents: AgentSummary[] = agentSeeds.map((seed) => ({
		...seed,
		lastActive: new Date(now - seed.lastActiveOffsetMs).toISOString(),
		activityTimeline: buildTimeline(seed.id, now, timelineSeeds[seed.id] ?? []),
		healthPulse: healthPulseSeeds[seed.id] ?? { healthyPct: 0.6, warningPct: 0.25, dangerPct: 0.15 }
	}));

	const errorMessage = url.searchParams.get('errorMessage');

	return {
		agents,
		lastUpdated: new Date(now).toISOString(),
		errorMessage
	};
};
