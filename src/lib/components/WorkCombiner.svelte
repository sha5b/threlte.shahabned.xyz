<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { BoxGeometry, Vector3, CatmullRomCurve3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity } from '@threlte/extras';
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	export let works;
	export let combinedWorkPositions;
	export let color;
	export let cellSize;

	let linesToDraw = [];
	let drawnConnections = new Set(); // Track drawn connections to avoid duplicates

	function calculateLines() {
		linesToDraw = []; // Reset the lines to draw
		drawnConnections.clear(); // Reset the drawn connections

		// Check if 'works' is defined and is an array
		if (Array.isArray(works)) {
			works.forEach((work) => {
				if (work.expand && Array.isArray(work.expand.reference)) {
					work.expand.reference.forEach((ref) => {
						// Create a connection string identifier
						const connectionId = [work.id, ref.id].sort().join('-');

						if (
							!drawnConnections.has(connectionId) &&
							combinedWorkPositions.has(ref.id) &&
							combinedWorkPositions.has(work.id)
						) {
							// Mark this connection as drawn
							drawnConnections.add(connectionId);

							let startPos = combinedWorkPositions.get(work.id);
							let endPos = combinedWorkPositions.get(ref.id);

							// Calculate the mid-point
							let midPoint = new Vector3().addVectors(startPos, endPos).multiplyScalar(0.5);

							// Calculate the direction for the offset by finding the dominant axis
							let direction = new Vector3(
								endPos.x - startPos.x,
								endPos.y - startPos.y,
								endPos.z - startPos.z
							);

							// Normalize the direction
							direction.normalize();

							// Depending on the direction, adjust the startPos and endPos
							startPos = startPos.clone().addScaledVector(direction, cellSize / 2);
							endPos = endPos.clone().addScaledVector(direction, -cellSize / 2);

							// Use the cross product to find a perpendicular direction
							let up = new Vector3(0, 1, 0);
							let perpDirection = new Vector3().crossVectors(direction, up).normalize();

							// In case direction is vertical, choose a different up vector
							if (perpDirection.lengthSq() === 0) {
								up.set(1, 0, 0);
								perpDirection.crossVectors(direction, up).normalize();
							}

							// Define a scaling factor for the midPoint displacement
							let midPointScale = 2; // Adjust this value for more or less curvature

							// Displace midPoint by perpDirection scaled by midPointScale and cellSize
							let controlPoint = midPoint
								.clone()
								.addScaledVector(perpDirection, midPointScale * cellSize);

							// Store the points needed for a Quadratic Bezier curve
							linesToDraw.push({ start: startPos, control: controlPoint, end: endPos });
						}
					});
				}
			});
		}
	}

	onMount(() => {
		calculateLines(); // Call this function when the component mounts
	});

	// Reactively create curve geometries based on linesToDraw
	$: curveGeometries = linesToDraw.map((line) => {
		const curve = new THREE.QuadraticBezierCurve3(
			new THREE.Vector3(line.start.x, line.start.y, line.start.z),
			new THREE.Vector3(line.control.x, line.control.y, line.control.z),
			new THREE.Vector3(line.end.x, line.end.y, line.end.z)
		);

		const points = curve.getPoints(50); // Number of points to sample along the curve
		return new THREE.BufferGeometry().setFromPoints(points);
	});
</script>

{#each curveGeometries as geometry, i (i)}
	<T.Mesh>
		<T.Line
			{geometry}
			material={new THREE.LineBasicMaterial({ color: color, linewidth: 0.1, opacity: 0 })}
		/>
	</T.Mesh>
{/each}
