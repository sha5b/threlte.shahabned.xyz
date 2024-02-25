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

	let showModal = false;
	let selectedImage = null;

	function handleImageClick(imageFilename) {
		selectedImage = getImageURL(selectedWork.collectionId, selectedWork.id, imageFilename);
		console.log(selectedImage); // For debugging purposes
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	// Store to keep track of the current image index
	const currentImageIndex = writable(0);

	// Increment or decrement the current image index
	function nextImage() {
		currentImageIndex.update((n) => n + 1);
	}

	function previousImage() {
		currentImageIndex.update((n) => n - 1);
	}
</script>

<nav>
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
									<a class="list-item" href={exhibition.link} target="_blank">{exhibition.title}</a>
								</div>
							{/each}
						</div>
					</div>
				</div>
			{/if}
		</div>
		{#if selectedWork.gallery && selectedWork.gallery.length > 0}
			<div class="slider">
				<button class="nav-button prev" on:click={previousImage} disabled={$currentImageIndex === 0}
					>◀</button
				>

				<div
					class="img-container"
					on:click={() => handleImageClick(selectedWork.gallery[$currentImageIndex])}
				>
					<img
						src={getImageURL(
							selectedWork.collectionId,
							selectedWork.id,
							selectedWork.gallery[$currentImageIndex]
						)}
						alt={`Image ${$currentImageIndex + 1} of ${selectedWork.title}`}
					/>
				</div>

				<button
					class="nav-button next"
					on:click={nextImage}
					disabled={$currentImageIndex === selectedWork.gallery.length - 1}>▶</button
				>
			</div>
		{/if}
		{#if selectedWork.synopsis}
			<div class="info-synopsis">
				{@html selectedWork.synopsis}
			</div>
		{/if}
	{/if}
</nav>
{#if showModal}
	<div class="modal" on:click={closeModal}>
		<div class="modal-content" on:click|stopPropagation>
			{#if selectedImage}
				<!-- Debug: Display the image URL on the modal for verification -->
				<img src={selectedImage} alt="Selected image" />
			{/if}
			<button class="close-modal" on:click={closeModal}>×</button>
		</div>
	</div>
{/if}

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
		/* Hide scrollbar for IE and Edge */
		width: 25%;
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
		background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
			linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);

		background-size: 25px 25px;
	}

	nav::-webkit-scrollbar {
		display: none;
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
	.info-synopsis {
		text-align: justify;
		direction: rtl;
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

	.slider {
		position: relative;
		display: flex; /* Use flexbox instead of grid */
		align-items: center; /* Align children vertically */
		justify-content: space-between; /* Distribute space between children */
	}

	.nav-button {
		position: absolute;
		top: 50%; /* Position the button halfway down the container */
		transform: translateY(-50%); /* Offset the button by half its height */
		width: 50px; /* Adjust width as needed */
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
		color: white;
		border: none;
		font-size: 24px; /* Adjust arrow size as needed */
		cursor: pointer;
		z-index: 2; /* Ensure buttons are above the image */
	}

	.nav-button.prev {
		left: 0;
		text-align: center;
		justify-content: center;
		justify-items: center;
	}

	.nav-button.next {
		right: 0;
		text-align: center;
		justify-content: center;
		justify-items: center;
	}
	.img-container {
		position: relative;
		flex-grow: 1; /* Allow image container to fill available space */
		overflow: hidden; /* Ensure the image doesn't escape the container */
		position: relative; /* Needed for absolute positioning of the image */
		width: 100%;
		height: 100%;
	}

	.img-container::before {
		content: '';
		display: block;
		padding-top: 100%; /* This creates an aspect ratio of 1:1 for the container */
	}

	.slider button {
		/* Styles for the previous and next buttons */
		flex: 0 0 auto; /* Do not grow or shrink */
	}

	img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover; /* Cover the container without stretching */
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000; /* Ensures it's above other content */
	}
	.modal-content {
		position: relative;
		max-width: 80vw;
		max-height: 80vh;
	}
	.modal-content img {
		position: relative;
		width: auto; /* Allow the content to size based on its content */
		max-width: 80vw;
		max-height: 80vh;
	}
	.close-modal {
		position: absolute;
		top: 0;
		right: 0;
		background: none;
		border: none;
		color: white;
		font-size: 2rem;
		cursor: pointer;
		padding: 0.5rem;
		margin: 2rem;
	}
</style>
