<script>
	//@ts-nocheck

	import { T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { Vector3 } from 'three';
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
	let cameraFOV = 45;
	let cameraRotation = writable([0, 0, 0]);

	// Handle Mouse Events

	function onBoxClick(event) {


		const { position, size, rotation } = event.detail;
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

<CategoryDistributor categories={data.categories} works={data.works} on:boxclick={onBoxClick} />
