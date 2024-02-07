<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity, Grid } from '@threlte/extras';
	import { createEventDispatcher, onMount } from 'svelte';

	export let position = new Vector3(0, 0, 0);
	export let size = new Vector3(500, 500, 500);
	export let cellSize = 500;
	export let width = 25;
	export let color = 'white';
	export let workCount;
	let rotation = [0, 0, 0]; // Rotation as an array [x, y, z]

	onMount(() => {
		// Set rotation to 0, 90, 180, or 270 degrees (in radians) for each axis
		rotation = [
			(Math.floor(Math.random() * 4) * Math.PI) / 2,
			(Math.floor(Math.random() * 4) * Math.PI) / 2,
			(Math.floor(Math.random() * 4) * Math.PI) / 2
		];
	});

	const roundToCellSize = (value) => Math.round(value / cellSize) * cellSize;
	$: size.set(roundToCellSize(size.x), roundToCellSize(size.y), roundToCellSize(size.z));

	const createBoxLines = (size) => {
		const halfSize = size.clone().multiplyScalar(0.5);
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

	// Calculate the number of cells in each dimension
	$: cellCount = {
		x: Math.floor(size.x / cellSize),
		y: Math.floor(size.y / cellSize),
		z: Math.floor(size.z / cellSize)
	};

	// Create grid lines based on the calculated cell count
	function createGridLines(cellCount, cellSize) {
		const lines = [];
		const halfSize = size.clone().multiplyScalar(0.5);

		// Add lines along the X axis
		for (let x = 0; x <= cellCount.x; x++) {
			for (let y = 0; y < cellCount.y; y++) {
				lines.push([
					new Vector3(-halfSize.x + x * cellSize, -halfSize.y + y * cellSize, -halfSize.z),
					new Vector3(-halfSize.x + x * cellSize, -halfSize.y + y * cellSize, halfSize.z)
				]);
			}
		}

		// Add lines along the Y axis
		for (let y = 0; y <= cellCount.y; y++) {
			for (let z = 0; z < cellCount.z; z++) {
				lines.push([
					new Vector3(-halfSize.x, -halfSize.y + y * cellSize, -halfSize.z + z * cellSize),
					new Vector3(halfSize.x, -halfSize.y + y * cellSize, -halfSize.z + z * cellSize)
				]);
			}
		}

		// Add lines along the Z axis
		for (let z = 0; z <= cellCount.z; z++) {
			for (let x = 0; x < cellCount.x; x++) {
				lines.push([
					new Vector3(-halfSize.x + x * cellSize, -halfSize.y, -halfSize.z + z * cellSize),
					new Vector3(-halfSize.x + x * cellSize, halfSize.y, -halfSize.z + z * cellSize)
				]);
			}
		}

		return lines;
	}

	$: gridLines = createGridLines(cellCount, cellSize);

	export let id; // Export id to set it from the parent component
	export let active; // Add this line to accept an 'active' prop

	// Handling the Interactivity of the CategoryBox
	const { target } = interactivity();

	const dispatch = createEventDispatcher();

	function handleClick(event) {
		if (!active) {
			event.stopPropagation();
			dispatch('boxclick', { position, size, rotation, id, active: false });
		}
	}
</script>

<T.Group {target} position={[position.x, position.y, position.z]} on:click={handleClick} {rotation}>
	<T.Mesh renderOrder={1}>
		{#each lines as points}
			<T.Mesh>
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
	{#if !active}
		<T.Mesh>
			<T.BoxGeometry args={[size.x, size.y, size.z]} />
			<T.MeshBasicMaterial
				opacity={1}
				transparent={true}
				doubleSided={true}
				color="white"
				wireframe
			/>
		</T.Mesh>
	{/if}
	{#if active}
		{#each gridLines as line}
			<T.LineSegments renderOrder={0}>
				<MeshLineGeometry points={line} />
				<MeshLineMaterial {color} opacity={.25} width={1} transparent={true} />
			</T.LineSegments>
		{/each}
	{/if}
</T.Group>
