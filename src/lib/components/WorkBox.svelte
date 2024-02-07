<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Group, Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';

	export let position = new Vector3(0, 0, 0);
	export let cellSize = 500;
	export let size = new Vector3(cellSize, cellSize, cellSize);
	export let width = 10;
	export let color = 'white';

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
		event.stopPropagation();
		dispatch('workclick', { position, size, id, active: false });
	}
</script>

<T.Group {target} position={[position.x, position.y, position.z]} on:click={handleClick}>
	<T.Mesh>
		{#each lines as points}
			<T.Mesh>
				<MeshLineGeometry {points} />
				<MeshLineMaterial {width} {color} opacity={1} transparent={true} />
			</T.Mesh>
		{/each}
	</T.Mesh>
	<T.Mesh>
		<slot />
	</T.Mesh>
	{#if activeCategory}
		{#if !activeWork}
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
	{/if}
</T.Group>
