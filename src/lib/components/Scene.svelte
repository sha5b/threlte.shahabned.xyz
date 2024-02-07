<script>
	//@ts-nocheck

	import { T } from '@threlte/core';
	import { OrbitControls, Grid } from '@threlte/extras';
	import { Vector3 } from 'three';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let data; //Pasted data from the Database
	let cellSize = 1000;
	let gridSize = 75000;
	const worldPosition = writable(new Vector3()); // Store for world position

	let cameraPosition = tweened([-25000, 25000, 25000], {
		duration: 2500,
		easing: cubicOut
	});
	let cameraTarget = tweened([0, 0, 0], {
		duration: 2500,
		easing: cubicOut
	});
	let cameraFOV = 45;
	let cameraRotation = writable([0, 0, 0]);

	// Handle Mouse Events

	function onBoxClick(event) {
		const { position, size, rotation, id } = event.detail;
		const extraSpaceFactor = 1.2;
		const direction = new Vector3(...$cameraPosition).sub(position).normalize();
		const adjustedDistance = (size.y / Math.tan((cameraFOV * Math.PI) / 360)) * extraSpaceFactor;
		const newCameraPosition = direction.multiplyScalar(-adjustedDistance).add(position);
		newCameraPosition.x += (Math.random() - 0.5) * 6000;
		newCameraPosition.y += (Math.random() - 0.5) * 6000;
		newCameraPosition.z += (Math.random() - 0.5) * 6000;

		cameraTarget.set([position.x, position.y, position.z]);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
		cameraRotation.set(rotation);
		console.log(
			'Clicked on CategoryBox with id:',
			id,
			'position:',
			position,
			'size:',
			size,
			'rotation:',
			rotation
		);
	}

	function onWorkClick(event) {
		const { position, size, id } = event.detail;

		// Set the new camera target to the work item's position (the center of the item)
		const newCameraTarget = new Vector3(position.x, position.y, position.z);

		// Calculate the distance required to view the entire work item
		// This distance calculation ensures the entire height of the item fits in view
		// If the width or depth is larger, you might need to take those into account separately
		const distance = size.y / (2 * Math.tan((cameraFOV * Math.PI) / 360));

		// Calculate the new position relative to the current camera position
		// The new position should be on the line from the camera through the target, at the calculated distance
		const direction = new Vector3(...$cameraPosition).sub(newCameraTarget).normalize();
		const newCameraPosition = direction.multiplyScalar(-distance).add(newCameraTarget);

		// Set the new camera target and position
		cameraTarget.set([newCameraTarget.x, newCameraTarget.y, newCameraTarget.z]);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);

		// Log the action
		console.log('Camera target and position set to center and zoom out to view the work item:', id);
	}
</script>

<T.PerspectiveCamera bind:position={$cameraPosition} makeDefault fov={cameraFOV} far={75000}>
	<OrbitControls
		bind:target={$cameraTarget}
		autoRotate
		enableZoom={true}
		enableDamping
		autoRotateSpeed={0.25}
	/>
</T.PerspectiveCamera>
<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<CategoryDistributor
	categories={data.categories}
	works={data.works}
	on:boxclick={onBoxClick}
	on:workclick={onWorkClick}
/>

<!-- <T.Group >
	<Grid
		plane="xz"
		cellColor="white"
		opacity={0.2}
		cellThickness={0.25}
		{cellSize}
		sectionColor="white"
		sectionThickness={0.5}
		sectionSize={cellSize * 5}
		infiniteGrid
		fadeDistance={75000}
		followCamera
	/>
	<Grid
		plane="xy"
		cellColor="white"
		opacity={0.2}
		cellThickness={0.25}
		{cellSize}
		sectionColor="white"
		sectionThickness={0.5}
		sectionSize={cellSize * 5}
		infiniteGrid
		fadeDistance={75000}
		followCamera
	/>
	<Grid
		plane="zy"
		cellColor="white"
		opacity={0.2}
		cellThickness={0.25}
		{cellSize}
		sectionColor="white"
		sectionThickness={0.5}
		sectionSize={cellSize * 5}
		infiniteGrid
		fadeDistance={75000}
		followCamera
	/>
</T.Group> -->
