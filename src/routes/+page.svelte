<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	import { writable } from 'svelte/store';
	export let data;
	import { slide, fly, fade } from 'svelte/transition';

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
		selectedCategoryId = id;
	}
	function setWorkId(id) {
		currentId = id;
		selectedWorkId = id;
	}

	// This computed variable will reactively update whenever `selectedCategoryId` or `data.works` changes.
	$: filteredWorks = selectedCategoryId
		? data.works.filter((work) => work.category === selectedCategoryId)
		: [];

	let showDropdown = false;

	let selectedWork = selectedWorkId ? data.works.find((work) => work.id === selectedWorkId) : null;

	// Make sure to update selectedWork whenever selectedWorkId changes
	$: if (selectedWorkId) {
		selectedWork = data.works.find((work) => work.id === selectedWorkId);
	} else {
		selectedWork = null;
	}
</script>

<nav>
	<h1 on:click={() => (showDropdown = !showDropdown)}>shahab nedaei</h1>
	<div class="dashed-line"></div>
	{#if showDropdown}
		<div class="dropdown" in:fade={{ delay: 0, duration: 300 }}>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
		</div>
		<div class="dashed-line"></div>
	{/if}

	<buttongrid>
		{#if selectedCategoryId}
			<!-- Render the selected category button first -->
			<button
				class="selected-category"
				on:click={() => setCategoryId(selectedCategoryId)}
				transition:slide={{
					delay: 0,
					duration: 300,
					start: 0.5
				}}
			>
				{data.categories.find((category) => category.id === selectedCategoryId).title}
			</button>
		{/if}
		{#each data.categories as category}
			{#if category.id !== selectedCategoryId}
				<!-- Render all non-selected categories -->
				<button
					on:click={() => setCategoryId(category.id)}
					in:fly={{ x: 200, duration: 400 }}
					out:fly={{ x: -200, duration: 400 }}
				>
					{category.title}
				</button>
			{/if}
		{/each}
	</buttongrid>
	<div class="dashed-line"></div>
	<!-- Render the filtered works in a similar button grid -->
	<buttongrid>
		{#if selectedWork}
			<!-- Render the selected work button first -->
			<button class="selected-work" on:click={() => setWorkId(selectedWork.id)} transition:slide>
				{selectedWork.title}
			</button>
		{/if}
		{#each filteredWorks as work}
			{#if work.id !== selectedWorkId}
				<!-- Render all non-selected works -->
				<button
					on:click={() => setWorkId(work.id)}
					in:fly={{ x: 200, duration: 400 }}
					out:fly={{ x: -200, duration: 400 }}
				>
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
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		grid-gap: 12.5px;
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
	.dashed-line {
		border-top: 2px dashed #ccc; /* Adjust color and style as needed */
		margin: 20px -50px; /* Adjust spacing as needed */
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
		overflow-x: hidden; /* Hide horizontal scrollbar */
		overflow-y: auto; /* Enable vertical scrolling if needed *

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
		text-align: left;
	}

	h1 {
		margin: 0;
	}
</style>
