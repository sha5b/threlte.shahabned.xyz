<script>

</script>

<svelte:head>
	<title>Shahabverse</title>
</svelte:head>

<slot />

<style global>
	@import url('https://fonts.googleapis.com/css?family=Inter&display=swap');
	@import url('https://fonts.googleapis.com/css?family=Bitter&display=swap');
	@import url('https://fonts.googleapis.com/css?family=Urbanist&display=swap');
	@import url('https://fonts.googleapis.com/css?family=K2D&display=swap');


	[data-theme='light'],
	:root:not([data-theme='dark']) {
		--primary: #df8766;
		--primary-hover: #df8766;
		--primary-focus: rgba(31, 24, 60, 0.125);
		--primary-inverse: #f4f5f5;
		font-family: 'K2D';
	}
	:root::-webkit-scrollbar {
		width: 0.25rem;
	}

	:root::-webkit-scrollbar-track {
		background: gray;
	}

	:root::-webkit-scrollbar-thumb {
		background: black;
	}
	:global(h1) {
		font-family: 'K2D';
		font-size: 3rem;
	}
	:global(h2) {
		font-family: 'K2D';
	}
	:global(p) {
		font-family: 'K2D';
		font-size: 1rem;
		letter-spacing: 0.1rem;
		line-height: 1.75rem;
	}
	:global(img) {
		
	}
</style>