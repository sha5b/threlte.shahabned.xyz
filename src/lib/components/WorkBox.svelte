<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Group, Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';

	export let position = new Vector3(0, 0, 0);
	export let cellSize = 500;
	export let size = new Vector3(cellSize, cellSize, cellSize);
	export let width = 5;
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

</script>

<T.Group position={[position.x, position.y, position.z]} >
	<T.Mesh renderOrder={2}>
		{#each lines as points}
			<T.Mesh>
				<MeshLineGeometry {points} />
				<MeshLineMaterial {width} {color} opacity={1} transparent={true}  />
			</T.Mesh>
		{/each}
	</T.Mesh>
	<T.Mesh>
		<slot />
	</T.Mesh>
</T.Group>
