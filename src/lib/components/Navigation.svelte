<script>
	//@ts-nocheck
	export let selectedCategoryId;
	export let selectedWorkId;
	export let data;
	export let filteredWorks;
	export let setCategoryId;
	export let setWorkId;
	export let formatDate;

	import { slide, fly, fade } from 'svelte/transition';

	// Define selectedWork reactively based on selectedWorkId and data.works
	$: selectedWork = selectedWorkId ? data.works.find((work) => work.id === selectedWorkId) : null;
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

	scene {
		position: fixed;
		z-index: -1;
		display: block;
		flex-grow: 1;
		min-width: 100vw;
		min-height: 100vh;
		background: rgb(13, 19, 32);
		background: radial-gradient(circle at center, rgb(206, 37, 88) 0%, rgb(16, 129, 110) 100%);
	}

	nav {
		backdrop-filter: blur(2px);

		padding-top: 1rem;
		padding-right: 2rem;
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
</style>
