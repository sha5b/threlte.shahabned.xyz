<script>
	//@ts-nocheck
    import { Vector3, BufferGeometry, LineBasicMaterial, Float32BufferAttribute } from 'three';
	import { T } from '@threlte/core';

	export let size = new Vector3(1000, 1000, 1000);
	export let cellSize = 100;
	export let color = '#c8aaad';
    export let linewidth = 3;
    export let opacity = 1;


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
		opacity: opacity,
		linewidth: linewidth,
	});



</script>

<T.LineSegments geometry={gridGeometry} material={gridMaterial} />