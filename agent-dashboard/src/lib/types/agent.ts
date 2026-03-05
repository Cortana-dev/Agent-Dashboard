export type AgentStatus = 'online' | 'idle' | 'paused' | 'error';

export type AgentActionType = 'inspect' | 'check' | 'restart' | 'stop';

export interface AgentActionEventDetail {
	agentId: string;
	type: AgentActionType;
}

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
