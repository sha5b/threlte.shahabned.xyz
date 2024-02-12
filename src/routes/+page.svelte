<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	import { writable } from 'svelte/store';
	export let data;

	let selectedCategoryId = null;
	let selectedWorkId = null;
	let currentId = null;


	function handleBoxClick(event) {
		const { position , newCameraPosition, id } = event.detail;
		selectedCategoryId = id;
		console.log('+page recvied', selectedCategoryId);
	}

	function handleWorkClick(event) {
		const { id, absolutePosition, newCameraPosition } = event.detail;
		selectedWorkId = id;
		console.log('+page recvied', selectedWorkId);

		// Handle work ID as needed
	}
	
	function setId(id) {
		currentId = id
		console.log("Button clicked", currentId)
	}
</script>

<nav>
	<h1>shahab nedaei</h1>
	{#each data.categories as category}
		<button on:click={(setId(category.id))}>{category.title} {category.id}</button>
	{/each}
	<h1>{selectedCategoryId}</h1>
	<h1>{selectedWorkId}</h1>

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
		background: rgb(255, 255, 255);
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
</style>
