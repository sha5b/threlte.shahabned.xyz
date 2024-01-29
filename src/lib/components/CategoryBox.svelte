<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { BoxGeometry, Group, Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity } from '@threlte/extras';

	export let position = new Vector3(0, 0, 0);
	export let size = new Vector3(500, 500, 500);
	export let cellSize;
	export let width = 15;
	export let color = 'lightblue';

	const { target } = interactivity();

	function handleClick() {
		console.log('CategoryBox clicked');
	}

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
					attenuate={true}
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
		<T.BoxGeometry args={[size.x, size.y, size.z]} />
	</T.Mesh>
</T.Group>
