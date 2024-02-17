<script>
	//@ts-nocheck

	import { T } from '@threlte/core';
	import { createEventDispatcher } from 'svelte';
	import { OrbitControls, HTML } from '@threlte/extras';
	import { Vector3, MathUtils, Quaternion, Euler } from 'three';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { get } from 'svelte/store';
	import BackgroundGrid from './BackgroundGrid.svelte';

	export let data; //Pasted data from the Database

	export let cameraPosition = tweened([-2500, 2500, 2500], {
		duration: 2500,
		easing: cubicOut
	});
	export let cameraTarget = tweened([0, 0, 0], {
		duration: 2500,
		easing: cubicOut
	});

	let cameraFOV = 45;
	let cameraRotation = writable([0, 0, 0]);
	let camera;
	let orbitControls;
	let tweenDuration = 2500;
	let color = 'white';

	// Handle Mouse Events

	let workDistance = writable(0);
	let categoryDistance = writable(0);
	const dispatch = createEventDispatcher();

	function onBoxClick(event) {
		const { position, size, rotation, id } = event.detail || {};
		event.stopPropagation();

		const distance = new Vector3(...$cameraPosition).sub(new Vector3(...position)).length(); //
		$categoryDistance = distance;

		const extraSpaceFactor = 1.2;
		const direction = new Vector3(...$cameraPosition).sub(position).normalize();

		const adjustedDistance = (size.y / Math.tan((cameraFOV * Math.PI) / 360)) * extraSpaceFactor;
		const newCameraPosition = direction.multiplyScalar(-adjustedDistance).add(position);
		newCameraPosition.x += Math.random() - 0.5;
		newCameraPosition.y += Math.random() - 0.5;
		newCameraPosition.z += Math.random() - 0.5;

		cameraTarget.set([position.x, position.y, position.z]);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
		cameraRotation.set(rotation);
		dispatch('boxclick', { id });
	}

	function onWorkClick(event) {
		const { position, id, absolutePosition } = event.detail;

		const distance = new Vector3(...$cameraPosition).sub(new Vector3(...position)).length(); //
		$workDistance = distance;

		// Calculate the direction from the camera to the work item
		const direction = new Vector3(...$cameraPosition)
			.sub(new Vector3(...absolutePosition))
			.normalize();

		// Calculate a suitable distance from the camera to the work item
		const zoomDistance = 2000; // Adjust this value as needed
		const newCameraPosition = direction
			.multiplyScalar(-zoomDistance)
			.add(new Vector3(...absolutePosition));

		// Update the camera's target and position
		cameraTarget.set([absolutePosition.x, absolutePosition.y, absolutePosition.z]);
		cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
		// After handling the work click, reset the flag after a delay to allow for any boxclick event to be cancelled

		dispatch('workclick', { id });
	}

	export let currentId;
	let previousId = null;
	let categoryPositions = null;
	let combinedWorkPositions = null;
	export let selectedCategoryId;
	export let selectedWorkId;

	function handleCategoryPositions(event) {
		categoryPositions = event.detail.categoryPositions;
		const size = event.detail.size;
	}
	function handleWorkPositions(event) {
		combinedWorkPositions = event.detail.combinedWorkPositions;
	}

	$: if (currentId !== previousId && currentId !== null && data) {
		previousId = currentId; // Update the previousId to the new value
		let targetDistance = 7500;
		let newPosition;
		if (categoryPositions.has(currentId)) {
			newPosition = categoryPositions.get(currentId);
			targetDistance = 7500;
		} else if (combinedWorkPositions.has(currentId)) {
			newPosition = combinedWorkPositions.get(currentId);
			targetDistance = 1000;
		}

		if (newPosition) {
			// Adjust the camera distance as needed
			const direction = new Vector3(...$cameraPosition).sub(newPosition).normalize();
			const newCameraPosition = direction.multiplyScalar(-targetDistance).add(newPosition);

			// Set the camera position and target to center on the newPosition
			cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
			cameraTarget.set([newPosition.x, newPosition.y, newPosition.z]);
		}
	}
</script>

<T.PerspectiveCamera
	bind:this={camera}
	bind:position={$cameraPosition}
	makeDefault
	fov={cameraFOV}
	near={1}
	far={50000}
	focus={$cameraTarget}
>
	<OrbitControls
		bind:this={orbitControls}
		bind:target={$cameraTarget}
		bind:camera
		autoRotate
		enableZoom={true}
		enableDamping
		autoRotateSpeed={0.5}
		minPolarAngle={0}
		maxPolarAngle={180}
	/>
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<CategoryDistributor
	categories={data.categories}
	works={data.works}
	bind:activeBoxId={currentId}
	{selectedCategoryId}
	{selectedWorkId}
	on:boxclick={onBoxClick}
	on:workclick={onWorkClick}
	on:categorypositions={handleCategoryPositions}
	on:combinedWorkpositions={handleWorkPositions}
/>

<BackgroundGrid size={new Vector3(75000, 75000, 75000)} cellSize={5000} color={'lightgoldenrodyellow'} linewidth={.1} opacity={.1}/>

<!-- <T.Mesh position={$cameraTarget}>
	<T.BoxGeometry args={[250, 250, 250]} />
	<T.MeshBasicMaterial opacity={0.25} transparent={true} doubleSided={true} color="red" />
</T.Mesh> -->
