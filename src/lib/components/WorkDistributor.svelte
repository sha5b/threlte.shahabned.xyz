<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import WorkBox from '$lib/components/WorkBox.svelte';
	import WorkDisplay from './WorkDisplay.svelte';
	import { generateUniquePositions } from '$lib/utils/utils';
	import { Vector3 } from 'three';
	import * as THREE from 'three';
	import { createEventDispatcher } from 'svelte';
	import { useTexture, Text } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { getImageURL } from '$lib/utils/getURL';

	export let works;
	export let cellSize;
	export let color = '#c8aaad';
	export let categorySize = new Vector3(500, 500, 500); // Assuming categorySize should be a Vector3
	export let active;
	export let categoryPosition;
	const absoluteWorkPositions = new Map();


	function loadTextureForWork(work) {
		const imageUrl = getImageURL(work.collectionId, work.id, work.thump);
		return useTexture(imageUrl);
	}

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
		console.log('Dispatched')
	});
	onMount(() => {
		
	});

</script>

{#each works as work (work.id)}
	{#await loadTextureForWork(work) then texture}
		<WorkBox
			absolutePosition={absoluteWorkPositions.get(work.id)}
			{categoryPosition}
			position={absoluteWorkPositions.get(work.id)}
			{cellSize}
			activeCategory={active}
			activeWork={activeBoxId === work.id}
			id={work.id}
			on:workclick={handleWorkClick}
			{color}
		>
			{#if texture}
				<WorkDisplay {work} {texture} {rotation} {cellSize} {color} />
			{/if}</WorkBox
		>
	{/await}
{/each}

<!-- src={getImageURL(work.collectionId, work.id, work.file)} -->
