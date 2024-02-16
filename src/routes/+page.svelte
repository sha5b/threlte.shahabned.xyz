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
		selectedCategoryId = selectedCategoryId === id ? null : id;
	}
	function setWorkId(id) {
		currentId = id;
		selectedWorkId = selectedWorkId === id ? null : id;
	}

	// This computed variable will reactively update whenever `selectedCategoryId` or `data.works` changes.
	$: filteredWorks = selectedCategoryId
		? data.works.filter((work) => work.category === selectedCategoryId)
		: [];

	let showDropdown = false;
</script>

<nav>
	<h1 on:click={() => (showDropdown = !showDropdown)}>shahab nedaei</h1>
	{#if showDropdown}
		<div class="dropdown">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
		</div>
	{/if}
	<buttongrid>
		{#if selectedCategoryId}
			<!-- Render the selected category button first -->
			<button class="selected-category" on:click={() => setCategoryId(selectedCategoryId)}>
				{data.categories.find((category) => category.id === selectedCategoryId).title}
			</button>
		{/if}
		{#each data.categories as category}
			{#if category.id !== selectedCategoryId}
				<!-- Render all non-selected categories -->
				<button on:click={() => setCategoryId(category.id)}>
					{category.title}
				</button>
			{/if}
		{/each}
	</buttongrid>
	<!-- Render the filtered works in a similar button grid -->
	<buttongrid>
		{#if selectedWorkId}
			<!-- Render the selected work button first -->
			<button
				class="selected-work"
				on:click={() => setWorkId(selectedWorkId)}>
				{filteredWorks.find((work) => work.id === selectedWorkId).title}
			</button>
		{/if}
		{#each filteredWorks as work}
			{#if work.id !== selectedWorkId}
				<!-- Render all non-selected works -->
				<button on:click={() => setWorkId(work.id)}>
					{work.title}
				</button>
			{/if}
		{/each}
	</buttongrid>
</nav>

<flex>
	<scene>
		<App
			{data}
			{currentId}
			{selectedCategoryId}
			{selectedWorkId}
			on:boxclick={handleBoxClick}
			on:workclick={handleWorkClick}
		/>
	</scene>
</flex>

<style>
	:global(body) {
		margin: 0px;
	}
	buttongrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		grid-gap: 25px;
		text-align: left; /* Align text to the left */
	}
	.selected-category {
		grid-column: 1 / -1; /* Span across all columns */
		font-size: 2rem; /* Larger font size */
		font-weight: bold; /* Bold font weight */
	}

	.selected-work {
        grid-column: 1 / -1; /* Span across all columns */
        font-size: 2rem; /* Larger font size */
        font-weight: bold; /* Bold font weight */
        /* Add any additional styles you want for selected work */
    }

	scene {
		display: block;
		flex-grow: 1;
		min-height: 100vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgb(8, 18, 31) 0%, rgb(4, 12, 19) 100%);
	}

	nav {
		padding: 50px;
		width: 500px;
		background: rgb(255, 255, 255);
		position: absolute;
		right: 0px;
		bottom: 0px;

		/* Grid background styles */
		background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
		background-size: 25px 25px; /* Size of the grid cells */
	}

	.dropdown {
		z-index: 1;
	}

	button {
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
		margin: 0;
		text-decoration: none; /* Optional to remove underline from links if used as buttons */
		justify-self: start; /* Align grid items to the start (left) */
	}

	h1 {
		margin: 0;
	}
</style>
