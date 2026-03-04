export type AgentStatus = 'online' | 'idle' | 'paused' | 'error';

export interface AgentSummary {
	id: string;
	name: string;
	status: AgentStatus;
	dailyUsagePercent: number;
	monthlyUsagePercent: number;
	dailyTokens: number;
	monthlyTokens: number;
	lastActive: string;
	recentAlerts: string[];
	topPrompts: string[];
}
