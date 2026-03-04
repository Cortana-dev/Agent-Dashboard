<div class="skeleton-card" aria-hidden="true">
	<div class="skeleton-head">
		<div class="skeleton-title"></div>
		<div class="skeleton-badge"></div>
	</div>
	<div class="skeleton-bar"></div>
	<div class="skeleton-bar short"></div>
	<div class="skeleton-tokens"></div>
</div>

<style>
	.skeleton-card {
		border-radius: 1rem;
		background: rgba(15, 23, 42, 0.03);
		padding: 1.25rem;
		box-shadow: 0 6px 15px rgba(15, 23, 42, 0.04);
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.skeleton-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.skeleton-title,
	.skeleton-bar,
	.skeleton-badge,
	.skeleton-tokens {
		background: rgba(15, 23, 42, 0.12);
		border-radius: 999px;
	}

	.skeleton-title {
		width: 45%;
		height: 1rem;
	}

	.skeleton-badge {
		width: 20%;
		height: 0.8rem;
	}

	.skeleton-bar {
		height: 0.5rem;
	}

	.skeleton-bar.short {
		width: 60%;
	}

	.skeleton-tokens {
		height: 0.75rem;
		width: 70%;
	}
</style>
