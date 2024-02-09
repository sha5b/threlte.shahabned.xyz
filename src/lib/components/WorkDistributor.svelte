<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import WorkBox from '$lib/components/WorkBox.svelte';
	import {
		countWorksPerCategory,
		calculateScaledSize,
		createWorkClickHandler,
		generateUniquePositions
	} from '$lib/utils/utils';
	import { PlaneGeometry, Vector3 } from 'three';
	import * as THREE from 'three';
	import { createEventDispatcher } from 'svelte';
	import { OrbitControls, Grid, useTexture } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { getImageURL } from '$lib/utils/getURL';

	export let works;
	export let cellSize;
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

	function setActiveBoxId(id) {
		activeBoxId = id;
	}
	const handleBoxClick = createWorkClickHandler(dispatch, setActiveBoxId);

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
	// Snap each work position to the grid cell to ensure no overlap
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

	function handleMeshClick(event) {
		event.stopPropagation();
		// Handle the mesh click event, if necessary
	}
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
			on:workclick={handleBoxClick}
		>
			{#if texture}
				{@const textureAspectRatio = texture.source.data.height / texture.source.data.width}
				{@const geometryWidth = Math.min(cellSize, texture.source.data.width) * 0.75}
				{@const geometryHeight = geometryWidth * textureAspectRatio}
				<T.Mesh
					on:click={handleMeshClick}
					rotation={[
						0,
						Math.random() * Math.PI * 2,
						0
					]}
				>q
					<T.PlaneGeometry args={[geometryWidth, geometryHeight]} />
					<T.MeshBasicMaterial side={THREE.DoubleSide} map={texture} opacity={1} flatShading={true} /></T.Mesh
				>
			{/if}</WorkBox
		>
	{/await}
{/each}

<!-- src={getImageURL(work.collectionId, work.id, work.file)} -->
