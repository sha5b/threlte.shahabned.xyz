<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';

	export let position = new Vector3(0, 0, 0);
	export let size = new Vector3(500, 500, 500);
	export let cellSize;
	export let width = 5;
	export let color = 'lightblue';


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

	export let id; // Export id to set it from the parent component
	export let active // Add this line to accept an 'active' prop

	// Handling the Interactivity of the CategoryBox
	const { target } = interactivity();
	const dispatch = createEventDispatcher();
	function handleClick() {
        if (!active) {
            dispatch('boxclick', { position: position, id: id });
            console.log('Clicked on CategoryBox with id:', id);
        }
	}
</script>

<T.Group {target} position={[position.x, position.y, position.z]} on:click={handleClick}>
	<T.Mesh >
		{#each lines as points}
			<T.Mesh>
				<MeshLineGeometry {points} />
				<MeshLineMaterial
					{width}
					{color}
					opacity={1}
					transparent={true}
					dashArray={0.1}
					dashRatio={0.5}
				/>
			</T.Mesh>
		{/each}
	</T.Mesh>
	<T.Mesh>
		<slot />
	</T.Mesh>
	<T.Mesh>
		<T.BoxGeometry args={[size.x - 100, size.y - 100, size.z - 100]} />
		<T.MeshBasicMaterial  opacity={0} transparent={true} doubleSided={true}/>
	</T.Mesh>
</T.Group>
