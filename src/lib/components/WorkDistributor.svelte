<script>
	//@ts-nocheck
	import WorkBox from '$lib/components/WorkBox.svelte';
	import {
		getRandomGridPosition,
		isOverlapping,
		generateUniquePositions
	} from '$lib/utils/categoryUtils';
	import { Vector3 } from 'three';

	export let works;
	export let cellSize;
	export let categorySize = new Vector3(500, 500, 500); // Assuming categorySize should be a Vector3
	

	// Define the range within which you want to place the WorkBoxes
	const range = categorySize.clone();

	// Create a Map to store the positions of the WorkBoxes
	let workPositions = new Map();

	// Generate unique positions for each work
	// Assuming works have an 'id' property
	// We are using a size object with the same dimensions as cellSize for all works
	const workSize = new Vector3(cellSize, cellSize, cellSize);
	generateUniquePositions(works.map(work => ({ ...work, size: workSize })), range, workPositions);

</script>

{#each works as work (work.id)}
	<WorkBox position={workPositions.get(work.id)} {cellSize}/>
{/each}
