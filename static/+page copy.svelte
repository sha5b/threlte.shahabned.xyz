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

	function setId(id) {
		currentId = id;
	}

	// This computed variable will reactively update whenever `selectedCategoryId` or `data.works` changes.
	$: filteredWorks = selectedCategoryId
		? data.works.filter((work) => work.categoryId === selectedCategoryId)
		: [];

</script>

<nav>
	<h1>shahab nedaei</h1>
	<h1>{selectedCategoryId}</h1>
	{#each data.categories as category}
		<button on:click={setId(category.id)}>{category.title} {category.id}</button>
	{/each}
	<h1>{selectedWorkId}</h1>
	{#if selectedCategoryId}
		<h2>Works for Selected Category:</h2>
		{#each filteredWorks as work}
			<div>
				{work.title} - {work.id}
				<!-- Render additional work details here -->
			</div>
		{/each}
	{/if}

</nav>

<flex>
	<scene>
		<App {data} {currentId} on:boxclick={handleBoxClick} on:workclick={handleWorkClick} />
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
		padding: 25px;
		width: 500px;
		background: rgb(255, 255, 255);
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
</style>

// Function to be called when a category button is clicked
function setId(id) {
	selectedCategoryId = id;
	currentId = id;
	// Filter works based on the selected category
	filteredWorks = data.works.filter((work) => work.category === selectedCategoryId);
}
</script>

<nav>
<h1>shahab nedaei</h1>
<h1>{selectedCategoryId}</h1>
{#each data.categories as category}
	<button on:click={setId(category.id)}>{category.title} {category.id}</button>
{/each}
<h1>{selectedWorkId}</h1>
{#if selectedCategoryId}
<h2>Works for Selected Category:</h2>
{#each filteredWorks as work}
	<button on:click={() => selectedWorkId = work.id}>
		{work.title} - {work.id}
		<!-- Render additional work details here -->
	</button>
{/each}
{/if}