<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	export let data;

	$: selectedCategoryId = null;
	let selectedWorkId = null;

	function handleBoxClick(event) {
		const selectedCategoryId = event.detail.id;
		console.log('+page recvied', selectedCategoryId);
	}

	function handleWorkClick(event) {
		selectedWorkId = event.detail.id;
		console.log('+page recvied', selectedWorkId);
		// Handle work ID as needed
	}
</script>

<nav>
	<h1>shahab nedaei</h1>
	{#each data.categories as category}
		<button>{category.title}</button>
	{/each}
	<h1>{selectedCategoryId}</h1>
	<h1>{selectedWorkId}</h1>
</nav>
<flex>
	<scene>
		<App {data} on:boxclick={handleBoxClick} on:workclick={handleWorkClick} />
	</scene>
</flex>

<style>
	:global(body) {
		margin: 0px;
	}
	flex {

		padding: 25px;
		display: flex;
		align-items: stretch;
		justify-content: center;

	}
	scene {
		flex-grow: 1;
		min-height: 95vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgb(229, 65, 80) 0%, rgb(199, 57, 69) 100%);
	}

	nav {
		background: rgb(255, 255, 255);
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
</style>
