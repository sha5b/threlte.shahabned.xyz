<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';


	export let data; //Pasted data from the Database


	let cameraPosition = writable([-5000, 5000, 5000]); // Store for camera position
	let cameraTarget = writable([0, 0, 0]); // Store for camera targets
	let cameraFOV = 25;


	// Handle Mouse Events

	function onBoxClick(event) {
		const { position, size } = event.detail; // Listen for the 'boxclick' that is Propagated from the CategoryDistributor
		console.log('position:' + position);
		console.log('size:', size);
		cameraTarget.set(position);

		const randomOffset = () => Math.random() * 3000 - 2000; // Random number

		// Calculate new camera position to zoom in, for example, move 1000 units closer on all axes.
		const zoomPosition = [
			position.x + randomOffset(),
			position.y + randomOffset(),
			position.z + randomOffset()
		];
		cameraPosition.set(zoomPosition);
	}


</script>

{console.log(data.works)}
<T.PerspectiveCamera bind:position={$cameraPosition} makeDefault fov={cameraFOV} far={500000}>
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

<CategoryDistributor categories={data.categories} works={data.works} on:boxclick={onBoxClick} />
