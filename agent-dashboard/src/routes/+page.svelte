<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AgentDashboard from '$lib/components/AgentDashboard.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const agentStore = writable(data.agents);
	$: agentStore.set(data.agents);

	let showSkeleton = true;
	let isRefreshing = false;

	onMount(() => {
		const timer = setTimeout(() => {
			showSkeleton = false;
		}, 420);
		return () => clearTimeout(timer);
	});

	const refreshData = async () => {
		showSkeleton = true;
		isRefreshing = true;
		try {
			const href = `${$page.url.pathname}${$page.url.search}`;
			await invalidate(href);
		} finally {
			isRefreshing = false;
			showSkeleton = false;
		}
	};
</script>

<AgentDashboard
	agents={$agentStore}
	lastUpdated={data.lastUpdated}
	refresh={refreshData}
	isRefreshing={isRefreshing}
	loading={showSkeleton}
	errorMessage={data.errorMessage ?? null}
/>
