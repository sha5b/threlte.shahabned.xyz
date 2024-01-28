<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Float, Grid, OrbitControls } from '@threlte/extras';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';
	import { onMount, onDestroy } from 'svelte';

	const cameraPosition = writable([-5000, 5000, 5000]); // Store for camera position
	const cameraTarget = writable([0, 0, 0]); // Store for camera targets

	export let data; //Pasted data from the Database

	// Function to handle the change event from OrbitControls
	function handleCameraChange() {
		console.log('Camera Position:', $cameraPosition);
		console.log('Camera Target:', $cameraTarget);
	}

	function handleClick() {
		console.log('Canvas clicked');
	}

	// on:change={handleCameraChange}

	
</script>

<T.PerspectiveCamera bind:position={$cameraPosition} makeDefault fov={25} far={50000}>
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

<CategoryDistributor categories={data.categories} on:click={handleClick} />
