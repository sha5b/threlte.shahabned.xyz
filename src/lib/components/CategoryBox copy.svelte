<script>
	import { T } from '@threlte/core';
	import { MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
	import { Vector3 } from 'three';

	export let boxSize = { x: 10, y: 10, z: 10 };

	const createCorners = (halfSize) => {
		return [
			new Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, -halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, -halfSize.y, halfSize.z),
			new Vector3(-halfSize.x, -halfSize.y, halfSize.z),
			new Vector3(-halfSize.x, halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, halfSize.y, -halfSize.z),
			new Vector3(halfSize.x, halfSize.y, halfSize.z),
			new Vector3(-halfSize.x, halfSize.y, halfSize.z)
		];
	};
	const createPoints = (corners) => {
		const points = [];

		// Bottom square
		for (let i = 0; i < 4; i++) {
			points.push([corners[i], corners[(i + 1) % 4]]);
		}

		// Top square
		for (let i = 4; i < 8; i++) {
			if (i < 7) {
				points.push([corners[i], corners[i + 1]]);
			} else {
				points.push([corners[i], corners[4]]);
			}
		}

		return points;
	};
	let points = createPoints(
		createCorners({ x: boxSize.x / 2, y: boxSize.y / 2, z: boxSize.z / 2 })
	).flat();
</script>

<T.Mesh>
	<MeshLineGeometry {points} />
	<MeshLineMaterial width={10} color="#fe3d00" transparent attenuate={false} flatShading={true} />
</T.Mesh>
