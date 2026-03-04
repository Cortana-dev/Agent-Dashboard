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
		border-radius: 1.25rem;
		background: linear-gradient(135deg, rgba(2, 6, 23, 0.9), rgba(15, 23, 42, 0.9));
		padding: 1.25rem;
		box-shadow: 0 12px 35px rgba(2, 6, 23, 0.6);
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		position: relative;
		overflow: hidden;
	}

	.skeleton-card::after {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 200%;
		height: 100%;
		background: linear-gradient(120deg, transparent, rgba(56, 189, 248, 0.2), transparent);
		animation: shimmer 1.8s infinite;
	}

	@keyframes shimmer {
		0% { transform: translateX(0); }
		100% { transform: translateX(100%); }
	}

	.skeleton-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		z-index: 1;
	}

	.skeleton-title,
	.skeleton-bar,
	.skeleton-badge,
	.skeleton-tokens {
		background: rgba(148, 163, 184, 0.4);
		border-radius: 999px;
		position: relative;
		z-index: 1;
	}

	.skeleton-title {
		width: 45%;
		height: 1.1rem;
	}

	.skeleton-badge {
		width: 20%;
		height: 0.8rem;
	}

	.skeleton-bar {
		height: 0.6rem;
	}

	.skeleton-bar.short {
		width: 60%;
	}

	.skeleton-tokens {
		height: 0.9rem;
		width: 70%;
	}
</style>
