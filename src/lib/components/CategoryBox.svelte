<script>
	
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';

	export let position = new Vector3(0, 0, 0);
	export let size = new Vector3(250, 250, 250);
	export let cellSize = 250;
	export let width = 10;
	export let color = '#4b6e84';

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

</script>

<T.Mesh position={[position.x, position.y, position.z]}>
	{#each lines as points}
		<T.Mesh>
			<MeshLineGeometry {points} />
			<MeshLineMaterial {width} {color} opacity={1} transparent attenuate={true} />
		</T.Mesh>
	{/each}
	<slot />
</T.Mesh>
