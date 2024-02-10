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
	// Refactored function to create box lines with reduced redundancy
	const createBoxLines = (size) => {
		const halfSize = size.clone().multiplyScalar(0.5);
		const corners = [
			new Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, -halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, -halfSize.y, halfSize.z),
			new Vector3(-halfSize.x, -halfSize.y, halfSize.z),
			new Vector3(-halfSize.x, halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, halfSize.y, halfSize.z),
			new Vector3(-halfSize.x, halfSize.y, halfSize.z)
		];

		const pairs = [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0],
			[4, 5],
			[5, 6],
			[6, 7],
			[7, 4],
			[0, 4],
			[1, 5],
			[2, 6],
			[3, 7]
		];

		return pairs.map(([start, end]) => [corners[start], corners[end]]);
	};

	$: lines = createBoxLines(size);

	// Function to create buffer geometry for a 3D grid with fixed cell size steps
	function createGridLinesGeometry(size, cellSize) {
		const points = [];
		const halfSize = size.clone().divideScalar(2);
		const divisions = size.clone().divideScalar(cellSize).floor();

		const addLine = (start, end) => {
			points.push(start.x, start.y, start.z, end.x, end.y, end.z);
		};

		// Lines parallel to X-axis
		for (let y = 0; y <= divisions.y; y++) {
			for (let z = 0; z <= divisions.z; z++) {
				addLine(
					new Vector3(-halfSize.x, y * cellSize - halfSize.y, z * cellSize - halfSize.z),
					new Vector3(halfSize.x, y * cellSize - halfSize.y, z * cellSize - halfSize.z)
				);
			}
		}

		// Lines parallel to Y-axis
		for (let x = 0; x <= divisions.x; x++) {
			for (let z = 0; z <= divisions.z; z++) {
				addLine(
					new Vector3(x * cellSize - halfSize.x, -halfSize.y, z * cellSize - halfSize.z),
					new Vector3(x * cellSize - halfSize.x, halfSize.y, z * cellSize - halfSize.z)
				);
			}
		}

		// Lines parallel to Z-axis
		for (let x = 0; x <= divisions.x; x++) {
			for (let y = 0; y <= divisions.y; y++) {
				addLine(
					new Vector3(x * cellSize - halfSize.x, y * cellSize - halfSize.y, -halfSize.z),
					new Vector3(x * cellSize - halfSize.x, y * cellSize - halfSize.y, halfSize.z)
				);
			}
		}

		return new BufferGeometry().setAttribute('position', new Float32BufferAttribute(points, 3));
	}

	const gridGeometry = createGridLinesGeometry(size, cellSize);
	const gridMaterial = new LineBasicMaterial({
		color: color,
		transparent: true,
		opacity: 0.2,
		linewidth: 1
	});

	export let id; // Export id to set it from the parent component
	export let active; // Add this line to accept an 'active' prop
	export let activeWork;

	// Handling the Interactivity of the CategoryBox
	const { target } = interactivity();

	const dispatch = createEventDispatcher();

	function handleClick(event) {
		if (!active) {
			dispatch('boxclick', { position, size, rotation, id, active: false });
		}
	}
</script>

<T.Group position={[position.x, position.y, position.z]} on:click={handleClick} {rotation}>
	<T.LineSegments geometry={gridGeometry} material={gridMaterial} />
	<T.Mesh>
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
		<T.Mesh renderOrder={1} {target}>
			<T.BoxGeometry args={[size.x, size.y, size.z]} />
			<T.MeshBasicMaterial opacity={0.5} transparent={true} {color} />
		</T.Mesh>
	{/if}
</T.Group>
