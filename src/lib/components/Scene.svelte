<script>
	//@ts-nocheck

	import { T } from '@threlte/core';
	import { OrbitControls, Grid } from '@threlte/extras';
	import { Vector3, MathUtils, Quaternion, Euler } from 'three';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let data; //Pasted data from the Database

	let cameraPosition = tweened([-25000, 25000, 25000], {
		duration: 2500,
		easing: cubicOut
	});
	let cameraTarget = tweened([0, 0, 0], {
		duration: 2500,
		easing: cubicOut
	});

	let cameraFOV = 25;
	let cameraRotation = writable([0, 0, 0]);
	let camera;
	let orbitControls;
	$: tweenDuration = 2500;

	// Handle Mouse Events

	function onBoxClick(event) {
		const { position, size, rotation, id } = event.detail;
		
		const extraSpaceFactor = 1.2;
		const direction = new Vector3(...$cameraPosition).sub(position).normalize();
		const adjustedDistance = (size.y / Math.tan((cameraFOV * Math.PI) / 360)) * extraSpaceFactor;
		const newCameraPosition = direction.multiplyScalar(-adjustedDistance).add(position);
		newCameraPosition.x += (Math.random() - 0.5) ;
		newCameraPosition.y += (Math.random() - 0.5) ;
		newCameraPosition.z += (Math.random() - 0.5) ;

		cameraTarget.set([position.x, position.y, position.z]);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
		cameraRotation.set(rotation);
	}
	function onWorkClick(event) {
		const { position, id, absolutePosition } = event.detail;

		// Calculate the direction from the camera to the work item
		const direction = new Vector3(...$cameraPosition)
			.sub(new Vector3(...absolutePosition))
			.normalize();

		// Calculate a suitable distance from the camera to the work item
		const distance = 2000; // Adjust this value as needed
		const newCameraPosition = direction
			.multiplyScalar(-distance)
			.add(new Vector3(...absolutePosition));

		// Update the camera's target and position
		cameraTarget.set([absolutePosition.x, absolutePosition.y, absolutePosition.z]);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
	}
</script>

<T.PerspectiveCamera
	bind:this={camera}
	bind:position={$cameraPosition}
	makeDefault
	fov={cameraFOV}
	far={75000}
>
	<OrbitControls
		bind:this={orbitControls}
		bind:target={$cameraTarget}
		bind:camera
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
<!-- <T.Mesh position={$cameraTarget}>
	<T.BoxGeometry args={[250, 250, 250]} />
	<T.MeshBasicMaterial opacity={0.25} transparent={true} doubleSided={true} color="red" />
</T.Mesh> -->
