<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	import { writable } from 'svelte/store';
	export let data;

	let selectedCategoryId = null;
	let selectedWorkId = null;
	let currentId = null;

	function handleBoxClick(event) {
		const { position, newCameraPosition, id } = event.detail;
		selectedCategoryId = id;
	}

	function handleWorkClick(event) {
		const { id, absolutePosition, newCameraPosition } = event.detail;
		selectedWorkId = id;

		// Handle work ID as needed
	}

	function setCategoryId(id) {
		currentId = id;
		selectedCategoryId = id

	}
	function setWorkId(id) {
		currentId = id;
		selectedWorkId = id;
		
	}


	// This computed variable will reactively update whenever `selectedCategoryId` or `data.works` changes.
	$: filteredWorks = selectedCategoryId
		? data.works.filter((work) => work.category === selectedCategoryId)
		: [];


</script>

<nav>
	<h1>shahab nedaei</h1>
	{#each data.categories as category}
		<button on:click={setCategoryId(category.id)}>{category.title} </button>
	{/each}
	{#if selectedCategoryId}
		<h2>Works for Selected Category:</h2>
		{#each filteredWorks as work}
			<button on:click={setWorkId(work.id)}>
				{work.title}
				<!-- Render additional work details here -->
			</button>
		{/each}
	{/if}
</nav>

<flex>
	<scene>
		<App {data} {currentId} {selectedCategoryId} {selectedWorkId} on:boxclick={handleBoxClick} on:workclick={handleWorkClick} />
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
		display: block;
		flex-grow: 1;
		min-height: 95vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgb(8, 18, 31) 0%, rgb(4, 12, 19) 100%);
	}

	nav {
		padding: 25px;
		width: 500px;
		background: rgb(255, 255, 255);
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
</style>
