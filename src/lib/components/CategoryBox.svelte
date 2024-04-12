<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3, BufferGeometry, LineBasicMaterial, Float32BufferAttribute } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity, Grid } from '@threlte/extras';
	import { createEventDispatcher, onMount } from 'svelte';
	import BackgroundGrid from './BackgroundGrid.svelte';
	import * as THREE from 'three';

	export let position = new Vector3(0, 0, 0);
	export let size = new Vector3(500, 500, 500);
	export let cellSize = 500;
	export let width = 50;
	export let color = 'black';
	let rotation = [0, 0, 0]; // Rotation as an array [x, y, z]
	export let activeWork; // Accept the prop
	

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

	export let id; // Export id to set it from the parent component
	export let active; // Add this line to accept an 'active' prop

	// Handling the Interactivity of the CategoryBox
	const { target } = interactivity();

	const dispatch = createEventDispatcher();

	function handleClick(event) {
		if (!active && !activeWork) {
			dispatch('boxclick', { position, size, rotation, id });
		}
		event.stopPropagation();
		active = true;
		console.log('Clicked Category');
	}
</script>

<T.Group position={[position.x, position.y, position.z]} {rotation}>
	<T.Mesh renderOrder={1}>
		{#each lines as points}
			<T.Mesh>
				<MeshLineGeometry {points} />
				<MeshLineMaterial
					{width}
					{color}
					opacity={1}
					transparent={true}
					attenuate={true}
					dashArray={0.1}
					dashRatio={0.3}
				/>
			</T.Mesh>
		{/each}
	</T.Mesh>

	<slot />

	{#if !active}
		<T.Mesh renderOrder={1} {target} on:click={handleClick}>
			<T.BoxGeometry args={[size.x, size.y, size.z]} />
			<T.MeshBasicMaterial opacity={0} transparent={true} wireframe  side={THREE.DoubleSide}/>
		</T.Mesh>
	{/if}
	<BackgroundGrid {size} {cellSize} {color} linewidth={0.1} opacity={0.1} />
</T.Group>
