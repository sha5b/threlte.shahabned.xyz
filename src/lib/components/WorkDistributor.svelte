<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import WorkBox from '$lib/components/WorkBox.svelte';
	import WorkDisplay from './WorkDisplay.svelte';
	import { generateUniquePositions } from '$lib/utils/utils';
	import { Vector3 } from 'three';

	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';

	export let works;
	export let cellSize;
	export let color = '#c8aaad';
	export let categorySize = new Vector3(500, 500, 500); // Assuming categorySize should be a Vector3
	export let active;
	export let categoryPosition;
	const absoluteWorkPositions = new Map();
	export let selectedWorkId;

	// Dispatcher
	const dispatch = createEventDispatcher();
	let activeBoxId = null; // This will store the ID of the currently active box
	let categoryPositions = null;

	function handleWorkClick(event) {
		const { id } = event.detail;
		activeBoxId = id;
		dispatch('workclick', event.detail);
	}

	const range = categorySize.clone();

	let workPositions = new Map();

	const workSize = new Vector3(cellSize, cellSize, cellSize);

	generateUniquePositions(
		works.map((work) => ({ ...work, size: workSize })),
		range,
		workPositions,
		cellSize
	);

	works.forEach((work) => {
		const position = workPositions.get(work.id);
		// Align position to the bottom-left corner of the grid cell
		position.x = Math.floor(position.x / cellSize) * cellSize;
		position.y = Math.floor(position.y / cellSize) * cellSize;
		position.z = Math.floor(position.z / cellSize) * cellSize;
		// Offset by half the cell size to center within the cell
		position.add(new Vector3(cellSize / 2, cellSize / 2, cellSize / 2));
		const absolutePosition = position.clone().add(categoryPosition);
		absoluteWorkPositions.set(work.id, absolutePosition);
		workPositions.set(work.id, position);
	});

	let rotation = [0, 0, 0];

	onMount(() => {
		rotation = [0, (Math.floor(Math.random() * 4) * Math.PI) / 2, 0];
		dispatch('workpositions', { absoluteWorkPositions });
	});
</script>

{#each works as work (work.id)}
	<WorkBox
		absolutePosition={absoluteWorkPositions.get(work.id)}
		{categoryPosition}
		{works}
		position={absoluteWorkPositions.get(work.id)}
		{cellSize}
		activeCategory={active}
		activeWork={selectedWorkId === work.id}
		id={work.id}
		on:workclick={handleWorkClick}
		{color}
	>
		<WorkDisplay activeCategory={active} {work} {rotation} {cellSize} {color} />
	</WorkBox>
{/each}

<!-- src={getImageURL(work.collectionId, work.id, work.file)} -->
