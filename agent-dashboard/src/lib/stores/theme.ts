import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const THEME_STORAGE_KEY = 'agent-dashboard-theme';

export const theme = writable<'light' | 'dark'>('light');

const applyTheme = (value: 'light' | 'dark') => {
	if (!browser) return;
	document.documentElement.dataset.theme = value;
	localStorage.setItem(THEME_STORAGE_KEY, value);
};

export const initTheme = () => {
	if (!browser) return;
	const stored = localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === 'dark' || stored === 'light') {
		theme.set(stored);
		applyTheme(stored);
		return;
	}
	const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	theme.set(preferred);
	applyTheme(preferred);
};

export const toggleTheme = () => {
	theme.update((current) => {
		const next = current === 'light' ? 'dark' : 'light';
		applyTheme(next);
		return next;
	});
};
