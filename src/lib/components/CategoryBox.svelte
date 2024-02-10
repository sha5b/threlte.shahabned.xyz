<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3, BufferGeometry, LineBasicMaterial, Float32BufferAttribute } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity, Grid } from '@threlte/extras';
	import { createEventDispatcher, onMount } from 'svelte';

	export let position = new Vector3(0, 0, 0);
	export let size = new Vector3(500, 500, 500);
	export let cellSize = 500;
	export let width = 25;
	export let color = '#c8aaad';
	export let workCount;
	let rotation = [0, 0, 0]; // Rotation as an array [x, y, z]

	onMount(() => {
		// Set rotation to 0, 90, 180, or 270 degrees (in radians) for each axis
		rotation = [0, (Math.floor(Math.random() * 4) * Math.PI) / 2, 0];
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

	// Function to create buffer geometry for a 3D grid with fixed cell size steps
	function createGridLinesGeometry(size, cellSize) {
		const points = [];
		const divisionsX = Math.floor(size.x / cellSize);
		const divisionsY = Math.floor(size.y / cellSize);
		const divisionsZ = Math.floor(size.z / cellSize);

		// Lines parallel to X-axis
		for (let i = 0; i <= divisionsY; i++) {
			for (let j = 0; j <= divisionsZ; j++) {
				points.push(
					-size.x / 2,
					i * cellSize - size.y / 2,
					j * cellSize - size.z / 2,
					size.x / 2,
					i * cellSize - size.y / 2,
					j * cellSize - size.z / 2
				);
			}
		}

		// Lines parallel to Y-axis
		for (let i = 0; i <= divisionsX; i++) {
			for (let j = 0; j <= divisionsZ; j++) {
				points.push(
					i * cellSize - size.x / 2,
					-size.y / 2,
					j * cellSize - size.z / 2,
					i * cellSize - size.x / 2,
					size.y / 2,
					j * cellSize - size.z / 2
				);
			}
		}

		// Lines parallel to Z-axis
		for (let i = 0; i <= divisionsX; i++) {
			for (let j = 0; j <= divisionsY; j++) {
				points.push(
					i * cellSize - size.x / 2,
					j * cellSize - size.y / 2,
					-size.z / 2,
					i * cellSize - size.x / 2,
					j * cellSize - size.y / 2,
					size.z / 2
				);
			}
		}

		const geometry = new BufferGeometry();
		const vertices = new Float32Array(points);
		geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
		return geometry;
	}

	const gridGeometry = createGridLinesGeometry(size, cellSize);
	const gridMaterial = new LineBasicMaterial({ color: color, transparent: true, opacity: .2, linewidth: 1});

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
	<T.LineSegments geometry={gridGeometry} material={gridMaterial} />
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

	<slot />
	{#if !active}
		<T.Mesh>
			<T.BoxGeometry args={[size.x, size.y, size.z]} />
			<T.MeshBasicMaterial
				opacity={0}
				transparent={true}
				doubleSided={true}
				color={color}
				wireframe
			/>
		</T.Mesh>
	{/if}
	<!-- {#if active}
		{#each gridLines as line}
			<T.LineSegments renderOrder={0}>
				<MeshLineGeometry points={line} />
				<MeshLineMaterial {color} opacity={0.25} width={0.5} transparent={true} />
			</T.LineSegments>
		{/each}
	{/if} -->
</T.Group>
