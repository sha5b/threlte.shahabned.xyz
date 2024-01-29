<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Float, Grid, OrbitControls } from '@threlte/extras';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';

	let cameraPosition = writable([-5000, 5000, 5000]); // Store for camera position
	let cameraTarget = writable([0, 0, 0]); // Store for camera targets
	let cameraFOV = 25;

	function onBoxClick(event) {
		const { position } = event.detail;
		cameraTarget.set(position);

		const randomOffset = () => Math.random() * 3000 - 2000; // Random number between -1000 and 1000

		// Calculate new camera position to zoom in, for example, move 1000 units closer on all axes.
		const zoomPosition = [
			position.x + randomOffset(),
			position.y + randomOffset(),
			position.z + randomOffset()
		];
		cameraPosition.set(zoomPosition);
	}

	export let data; //Pasted data from the Database

	// Function to handle the change event from OrbitControls
	function handleCameraChange() {
		console.log('Camera Position:', $cameraPosition);
		console.log('Camera Target:', $cameraTarget);
	}

	// on:change={handleCameraChange}
</script>

<T.PerspectiveCamera bind:position={$cameraPosition} makeDefault fov={cameraFOV} far={50000}>
	<OrbitControls
		bind:target={$cameraTarget}
		autoRotate
		enableZoom={true}
		enableDamping
		autoRotateSpeed={0.5}
		target.y={1.5}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<CategoryDistributor categories={data.categories} on:boxclick={onBoxClick} />
