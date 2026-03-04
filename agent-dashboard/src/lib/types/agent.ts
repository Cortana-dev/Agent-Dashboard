export type AgentStatus = 'online' | 'idle' | 'paused' | 'error';

export type TimelineSeverity = 'success' | 'warning' | 'danger';

export interface TimelineEvent {
	id: string;
	timestamp: string;
	label: string;
	detail: string;
	severity: TimelineSeverity;
	type: 'status' | 'alert' | 'spike';
}

export interface HealthPulse {
	healthyPct: number;
	warningPct: number;
	dangerPct: number;
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
	activityTimeline: TimelineEvent[];
	healthPulse: HealthPulse;
}
