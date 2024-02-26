<script>
	//@ts-nocheck
	export let selectedCategoryId;
	export let selectedWorkId;
	export let data;
	export let filteredWorks;
	export let setCategoryId;
	export let setWorkId;
	export let formatDate;
	import { writable } from 'svelte/store';

	import { getImageURL } from '$lib/utils/getURL';

	import { slide, fly, fade } from 'svelte/transition';

	// Define selectedWork reactively based on selectedWorkId and data.works
	$: selectedWork = selectedWorkId ? data.works.find((work) => work.id === selectedWorkId) : null;

	$: if (selectedCategoryId !== null) {
		selectedWorkId = null; // Reset selected work
		// Reset any other state related to the work information
	}

	let navElement;
	let buttonStyle = ''; // We will use this to bind to the button's style attribute
	// Reactive variable to keep track of nav visibility
	let isNavOpen = false;

	// Function to toggle the navigation visibility
	function toggleNav() {
		isNavOpen = !isNavOpen;
	}
	$: if (navElement) {
		if (isNavOpen) {
			// Button should align with the left edge of the nav element
			buttonStyle = `left: ${navElement.getBoundingClientRect().left}px; top: 1rem;`;
		} else {
			// Button should be 1rem from the right edge of the viewport
			buttonStyle = 'right: 1rem; top: 1rem;';
		}
	}
</script>

<button on:click={toggleNav} class="toggle-nav" style={buttonStyle}>
	{isNavOpen ? 'close' : 'open navigation'}
</button>
<nav bind:this={navElement} class={isNavOpen ? 'open' : 'closed'}>
	{#if isNavOpen}
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
		{#if selectedWork && selectedWork.id !== null}
			<div class="dashed-line"></div>
			{#if selectedWork.reference && selectedWork.reference.length > 0}
				<div class="work-info">
					<div class="info-item">
						<span class="info-title">reference:</span>
						<div class="info-content">
							{#each selectedWork.reference as referenceId}
								{#each data.works as work}
									{#if work.id === referenceId}
										<button class="list-item" on:click={() => setWorkId(work.id)} transition:slide>
											{work.title}
										</button>
									{/if}
								{/each}
							{/each}
						</div>
					</div>
				</div>
			{/if}
			<div class="work-details">
				<div class="work-info">
					{#if selectedWork.dimension}
						<div class="info-item">
							<span class="info-title">dimension:</span>
							<span class="info-content">{selectedWork.dimension}</span>
						</div>
					{/if}
					{#if selectedWork.format}
						<div class="info-item">
							<span class="info-title">format:</span>
							<span class="info-content">{selectedWork.format}</span>
						</div>
					{/if}
					{#if selectedWork.format}
						<div class="info-item">
							<span class="info-title">media:</span>
							<span class="info-content">{selectedWork.type}</span>
						</div>
					{/if}
				</div>
				<div class="work-info">
					{#if selectedWork.editions > 0}
						<div class="info-item">
							<span class="info-title">editions:</span>
							<span class="info-content">{selectedWork.editions}</span>
						</div>
					{/if}
					<div class="info-item">
						<span class="info-title">date:</span>
						<span class="info-content">{formatDate(selectedWork.date)}</span>
					</div>
				</div>
				{#if selectedWork.expand && selectedWork.expand.colab && selectedWork.expand.colab.length > 0}
					<div class="work-info">
						<div class="info-item">
							<span class="info-title">collaborations:</span>
							<div class="info-content">
								{#each selectedWork.expand.colab as colab}
									<a href={colab.link} class="list-item" target="_blank">{colab.title}</a>
								{/each}
							</div>
						</div>
					</div>
				{/if}
				{#if selectedWork.expand.exhibitions && selectedWork.exhibitions.length > 0}
					<div class="work-info">
						<div class="info-item">
							<span class="info-title">exhibitions:</span>
							<div class="info-content">
								{#each selectedWork.expand.exhibitions as exhibition}
									<div>
										<a class="list-item" href={exhibition.link} target="_blank"
											>{exhibition.title}</a
										>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
			{#if selectedWork.synopsis}
				<div class="info-content">
					{@html selectedWork.synopsis}
				</div>
			{/if}
		{/if}
	{/if}
</nav>

<style>
	buttonflex {
		padding-top: 1rem;
		padding-bottom: 1rem;
		display: flex;
		flex-direction: row;
		grid-gap: 12.5px;
		text-align: left;
		/* Align text to the left */
		flex-wrap: wrap;
		justify-content: right;
	}

	.selected-category {
		flex-basis: 100%;
		flex-grow: 1;
		font-size: 1.5rem;
		/* Larger font size */
		font-weight: bold;
		/* Bold font weight */
		color: white;
	}

	.selected-work {
		flex-basis: 100%;
		flex-grow: 1;
		font-size: 1.5rem;
		/* Larger font size */
		font-weight: bold;
		/* Bold font weight */
		color: white;
	}

	.dashed-line {
		border-top: 2px solid transparent;
		border-image: repeating-linear-gradient(
				to right,
				white,
				white 10px,
				transparent 10px,
				transparent 20px
			)
			1;
		margin: 20px -50px;
	}

	nav {
		backdrop-filter: blur(2px);

		padding-top: 1rem;
		padding-right: 2rem;
		padding-left: 2rem;
		scrollbar-width: none;
		-ms-overflow-style: none;
		box-sizing: border-box; /* Include padding and border in the width */
		/* Hide scrollbar for IE and Edge */
		width: 20%;
		position: absolute;
		right: 0;
		/* Align to the bottom right corner */
		top: 0;
		/* Align to the bottom right corner */
		overflow-x: hidden;
		/* Hide horizontal scrollbar */
		overflow-y: auto;
		/* Enable vertical scrolling if needed */
		max-height: 100vh;
		/* Maximum height */
		overflow-y: auto;
		/* Scroll vertically if content overflows */
		/* Grid background styles */
		/* background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);

		background-size: 25px 25px; */
	}

	nav::-webkit-scrollbar {
		display: none;
	}

	.toggle-nav {
		position: fixed; /* Fixed position relative to the viewport */
		padding: 0.5rem 1rem;
		z-index: 10; /* To ensure it's above other elements */
		/* Other styles for your button */
	}
	.work-details {
		/* Style for the work details container */
	}

	.work-info {
		display: flex;
		justify-content: flex-end;
		/* Align flex container items to the right */
		flex-wrap: wrap;
		margin-bottom: 1rem;
		/* Space between rows */
	}

	.info-item {
		color: white;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		/* Align info item content to the right */
		margin-left: 2rem;
		/* Space between items, now on the left */
	}

	.info-title {
		color: white;
		font-size: 0.8rem;
		font-weight: bold;
		/* Optional: make the content bold */
		margin-bottom: 0.25rem;
	}

	.info-content {
		text-align: right;
		/* Align text to the right */
		color: white;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.list-item {
		display: block;
		text-align: right;
		/* Each exhibition item fills a row */
		margin-bottom: 0.5rem;
		align-items: flex-end;
		/* Space between exhibition items, if needed */
	}

	a {
		display: block;
		transition:
			background-color 0.3s ease,
			color 0.3s ease; /* Smooth transition for background and text color */
		background-color: rgba(255, 255, 255, 0);
		/* Make the link fill the exhibition item's row */
		text-decoration: none;
		/* Optional: Removes underline from links */
		color: inherit;
		/* Optional: Inherits color from parent */
	}

	button {
		transition:
			background-color 0.3s ease,
			color 0.3s ease; /* Smooth transition for background and text color */
		background-color: rgba(255, 255, 255, 0);
		padding: 0;
		background: none;
		border: none;
		color: inherit;
		font: inherit;
		cursor: pointer;
		color: white;
		margin: 0;
		text-decoration: none;
		/* Optional to remove underline from links if used as buttons */
		justify-self: start;
		/* Align grid items to the start (left) */
		text-align: right;
	}

	.selected-work:hover {
		background-color: rgba(255, 255, 255, 0); /* Or any desired color for hover state */
		filter: none; /* Remove the invert filter effect on hover */
	}

	.selected-category:hover {
		background-color: rgba(255, 255, 255, 0); /* Or any desired color for hover state */
		filter: none; /* Remove the invert filter effect on hover */
	}
	button:hover {
		background-color: rgba(0, 0, 0, 1);
		filter: invert(100%); /* Invert colors on hover */
	}

	a:hover {
		background-color: rgba(0, 0, 0, 1);
		filter: invert(100%); /* Invert colors on hover */
	}

	@media (max-width: 767px) {
		/* Adjust breakpoint as needed */
		nav {
			width: 100%; /* Full width on mobile */
			/* Other mobile-specific styles... */
		}
	}
</style>
