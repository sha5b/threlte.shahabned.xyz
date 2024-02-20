<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	import { writable } from 'svelte/store';
	export let data;
	import { slide, fly, fade } from 'svelte/transition';
	import { getImageURL } from '$lib/utils/getURL';
	import { afterUpdate } from 'svelte';

	let selectedCategoryId = null;
	let selectedWorkId = null;
	let currentId = null;

	function handleBoxClick(event) {
		const { position, newCameraPosition, id } = event.detail;
		selectedCategoryId = id;
		selectedWork = null;
	}

	function handleWorkClick(event) {
		const { id, absolutePosition, newCameraPosition } = event.detail;
		selectedWorkId = id;

		// Handle work ID as needed
	}

	function setCategoryId(id) {
		currentId = id;
		selectedCategoryId = id;
		selectedWork = null;
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
	<!-- <button class="main-title" on:click={() => (showDropdown = !showDropdown)}>{data.owner.name}</button>
	{#if showDropdown}
		<div class="dropdown" in:fade={{ delay: 0, duration: 300 }} out:fade={{ duration: 300 }}>
			<p>{@html data.owner.description}</p>
		</div>
	{/if} -->

	<buttonflex>
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
	</buttonflex>
	<div class="dashed-line"></div>
	<!-- Render the filtered works in a similar button grid -->
	<buttonflex>
		{#if selectedWork && selectedWork.id !== null}
			<!-- Render the selected work button only if workId is not null -->
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
	</buttonflex>

	<!-- {#if selectedWork && selectedWork.id !== null}
		<div>
			<img
				src={getImageURL(selectedWork.collectionId, selectedWork.id, selectedWork.thump)}
				alt={`Thumbnail for ${selectedWork.title}`}
			/>
		</div>
	{/if} -->
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
	buttonflex {
		padding-top: 1rem;
		padding-bottom: 1rem;
		display: flex;
		flex-direction: row;
		grid-gap: 12.5px;
		text-align: left; /* Align text to the left */
		flex-wrap: wrap;
		justify-content: right;
	}
	.selected-category {
		flex-basis: 100%;
		flex-grow: 1;
		font-size: 1.5rem; /* Larger font size */
		font-weight: bold; /* Bold font weight */
		color: white;
	}

	.selected-work {
		flex-basis: 100%;
		flex-grow: 1;
		font-size: 1.5rem; /* Larger font size */
		font-weight: bold; /* Bold font weight */
		color: white;
	}
	.dashed-line {
		border-top: 2px dashed #ccc; /* Adjust color and style as needed */
		margin: 20px -50px; /* Adjust spacing as needed */
	}
	scene {
		position: fixed;
		z-index: -1;
		display: block;
		flex-grow: 1;
		min-width: 100vw;
		min-height: 100vh;
		background: rgb(13, 19, 32);
		background: radial-gradient(circle at center, rgb(10, 92, 166) 0%, rgb(71, 16, 134) 100%);
	}

	nav {
		padding-top: 4rem;
		padding-right: 5rem;
		scrollbar-width: none;
		-ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
		width: 25%;
		/* background: rgba(71, 16, 134, 0.5); */
		position: absolute;
		right: 0; /* Align to the bottom right corner */
		top: 0; /* Align to the bottom right corner */
		overflow-x: hidden; /* Hide horizontal scrollbar */
		overflow-y: auto; /* Enable vertical scrolling if needed */
		max-height: 100vh; /* Maximum height */
		overflow-y: auto; /* Scroll vertically if content overflows */
		/* Grid background styles */
		/* background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
		background-size: 25px 25px; */
	}
	nav::-webkit-scrollbar {
		display: none;
	}

	.dropdown {
		z-index: 1;
	}
	.main-title {
		margin-left: 0;
		font-size: 2rem;
		font-weight: bold;
		color: white;
	}

	button {
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
		color: white;
		margin: 0;
		text-decoration: none; /* Optional to remove underline from links if used as buttons */
		justify-self: start; /* Align grid items to the start (left) */
		text-align: right;
	}

	h1 {
		margin: 0;
		color: white;
		font-size: 2rem;
	}
	p {
		color: white;
		font-size: 1rem;
	}

	img {
		max-width: 100%; /* Ensure the image is not wider than the nav */
		max-height: 100%; /* Adjust max height as needed */
		object-fit: contain; /* Ensure the whole image fits within the bounds without cropping */
		display: block; /* Remove extra space below the image */
		margin: 0 auto; /* Center image if it's not as wide as nav */
	}
</style>
