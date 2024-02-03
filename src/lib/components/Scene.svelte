<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Vector3 } from 'three';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';

	export let data; //Pasted data from the Database

	let cameraPosition = writable([-25000, 25000, 25000]); // Store for camera position
	let cameraTarget = writable([0, 0, 0]); // Store for camera targets
	let cameraFOV = 25;
	let cameraRotation = writable([0, 0, 0]);

  // Define your fog color and density
  let fogColor = 'black'; // white fog
  let density = 0.25; // The density of the fog. Default is 0.00025.
	
	// Handle Mouse Events

	function onBoxClick(event) {
		const { position, size, rotation } = event.detail; // Get the position and size of the category box

		// Calculate the distance required to fit the box in view
		const distanceToFitBox = size.y / 2 / Math.tan((cameraFOV * Math.PI) / 180 / 2);
		const extraSpaceFactor = 1.2; // Adjust to give more or less space around the box
		const adjustedDistance = distanceToFitBox * extraSpaceFactor;

		// Calculate the new camera position, maintaining the direction from the camera to the box's center
		const direction = new Vector3(...$cameraPosition).sub(new Vector3(...position)).normalize();
		const newCameraPosition = direction
			.multiplyScalar(-adjustedDistance)
			.add(new Vector3(...position));

		// Apply a random offset to the new camera position
		const randomOffset = () => Math.random() * 6000 - 3000; // Adjust the range as needed
		newCameraPosition.x += randomOffset();
		newCameraPosition.y += randomOffset();
		newCameraPosition.z += randomOffset();

		cameraTarget.set(position);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
		console.log('rotation', rotation.map((r) => (r * 180) / Math.PI).join(', '));
		cameraRotation.set(rotation);
	}
</script>

<T.PerspectiveCamera bind:position={$cameraPosition} makeDefault fov={cameraFOV} far={500000} >
	<OrbitControls
		bind:target={$cameraTarget}
		autoRotate
		enableZoom={true}
		enableDamping
		autoRotateSpeed={0.25}
	/>
</T.PerspectiveCamera>
<T.FogExp2 color={fogColor} density={density} />
<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<CategoryDistributor categories={data.categories} works={data.works} on:boxclick={onBoxClick} />
