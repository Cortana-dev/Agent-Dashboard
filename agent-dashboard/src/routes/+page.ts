import type { PageLoad } from './$types';
import type { AgentSummary } from '$lib/types/agent';

const agentSeeds: (Omit<AgentSummary, 'lastActive'> & { lastActiveOffsetMs: number })[] = [
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

export const prerender = false;

export const load: PageLoad = async ({ url }) => {
	const now = Date.now();
	const agents: AgentSummary[] = agentSeeds.map((seed) => ({
		...seed,
		lastActive: new Date(now - seed.lastActiveOffsetMs).toISOString()
	}));

	const errorMessage = url.searchParams.get('errorMessage');

	return {
		agents,
		lastUpdated: new Date(now).toISOString(),
		errorMessage
	};
};
