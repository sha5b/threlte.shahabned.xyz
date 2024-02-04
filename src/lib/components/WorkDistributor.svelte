<script>
	//@ts-nocheck
	import WorkBox from '$lib/components/WorkBox.svelte';
	import {
		countWorksPerCategory,
		calculateScaledSize,
		createBoxClickHandler,
		generateUniquePositions
	} from '$lib/utils/utils';
	import { Vector3 } from 'three';
	import { createEventDispatcher } from 'svelte';

	export let works;
	export let cellSize;
	export let categorySize = new Vector3(500, 500, 500); // Assuming categorySize should be a Vector3

	// Event Dispatcher
	const dispatch = createEventDispatcher();

	function handleBoxClick(id) {
		// Retrieve the position and size of the work
		const work = works.find((w) => w.id === id);
		const position = workPositions.get(id);
		const size = workSize; // Assuming all WorkBoxes are the same size

		// Dispatch the details
		dispatch('boxclick', { id, position, size });
		console.log(
			'Clicked on WorkBox with id:',
			id,
			'position:',
			position,
			'size:',
			size,
		);
	}

	// Define the range within which you want to place the WorkBoxes
	const range = categorySize.clone();

	// Create a Map to store the positions of the WorkBoxes
	let workPositions = new Map();

	// Generate unique positions for each work
	// Assuming works have an 'id' property
	// We are using a size object with the same dimensions as cellSize for all works
	const workSize = new Vector3(cellSize, cellSize, cellSize);
	generateUniquePositions(
		works.map((work) => ({ ...work, size: workSize })),
		range,
		workPositions,
		cellSize
	);
</script>

{#each works as work (work.id)}
	<WorkBox position={workPositions.get(work.id)} {cellSize} on:boxclick={handleBoxClick} />
{/each}
