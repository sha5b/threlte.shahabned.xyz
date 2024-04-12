<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import BackgroundGrid from './BackgroundGrid.svelte';
	import * as THREE from 'three';

	export let position = new Vector3(0, 0, 0);
	export let cellSize = 500;
	export let size = new Vector3(cellSize, cellSize, cellSize);
	export let width = 5;
	export let color = 'black';
	export let categoryPosition;
	export let absolutePosition;
	export let works;

	let rotation = [0, 0, 0]; // Rotation as an array [x, y, z]

	onMount(() => {
		// Set rotation to 0, 90, 180, or 270 degrees (in radians) for each axis
		rotation = [0, (Math.floor(Math.random() * 4) * Math.PI) / 2, 0];
	});

	const roundToCellSize = (value) => Math.round(value / cellSize) * cellSize;
	$: size.set(roundToCellSize(size.x), roundToCellSize(size.y), roundToCellSize(size.z));

	const createBoxLines = (size) => {
		const halfSize = size.clone().multiplyScalar(0.49);
		const corners = [
			new Vector3(-1, -1, -1),
			new Vector3(1, -1, -1),
			new Vector3(1, -1, 1),
			new Vector3(-1, -1, 1),
			new Vector3(-1, 1, -1),
			new Vector3(1, 1, -1),
			new Vector3(1, 1, 1),
			new Vector3(-1, 1, 1)
		].map((corner) => corner.multiply(halfSize));

		return [
			[corners[0], corners[1]],
			[corners[1], corners[2]],
			[corners[2], corners[3]],
			[corners[3], corners[0]],
			[corners[4], corners[5]],
			[corners[5], corners[6]],
			[corners[6], corners[7]],
			[corners[7], corners[4]],
			[corners[0], corners[4]],
			[corners[1], corners[5]],
			[corners[2], corners[6]],
			[corners[3], corners[7]]
		];
	};

	$: lines = createBoxLines(size);

	export let id; // Export id to set it from the parent component
	export let activeCategory; // Add this line to accept an 'active' prop
	export let activeWork;

	// Handling the Interactivity of the CategoryBox
	const { target } = interactivity();

	const dispatch = createEventDispatcher();

	function handleClick(event) {
		dispatch('workclick', {
			position,
			size,
			id,
			active: false,
			categoryPosition,
			absolutePosition
		});
		console.log('Clicked Work');
	}
</script>

<T.Group position={[position.x, position.y, position.z]} {rotation}>
	<T.Mesh renderOrder={2}>
		{#each lines as points}
			<T.Mesh renderOrder={2}>
				<MeshLineGeometry {points} />
				<MeshLineMaterial
					{width}
					{color}
					opacity={1}
					transparent={true}
					dashArray={0.1}
					dashRatio={0.3}
					attenuate={true}
				/>
			</T.Mesh>
		{/each}
	</T.Mesh>
	<T.Mesh>
		<slot />
	</T.Mesh>
	{#if !activeWork}
		<T.Mesh renderOrder={2} {target} on:click={handleClick}>
			<T.BoxGeometry args={[size.x - 50, size.y - 50, size.z - 50]} />
			<T.MeshBasicMaterial opacity={0} transparent={true} {color} />
		</T.Mesh>
	{:else}
		<BackgroundGrid {size} cellSize={cellSize / 3} {color} linewidth={0.25} opacity={0.25} />
	{/if}
</T.Group>
