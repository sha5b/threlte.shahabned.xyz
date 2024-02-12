<script>
	//@ts-nocheck

	import { T } from '@threlte/core';
	import { createEventDispatcher } from 'svelte';
	import { OrbitControls, Grid, interactivity } from '@threlte/extras';
	import { Vector3, MathUtils, Quaternion, Euler } from 'three';
	import CategoryDistributor from '$lib/components/CategoryDistributor.svelte';
	import { writable } from 'svelte/store';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { get } from 'svelte/store';

	export let data; //Pasted data from the Database

	export let cameraPosition = tweened([-25000, 25000, 25000], {
		duration: 2500,
		easing: cubicOut
	});
	export let cameraTarget = tweened([0, 0, 0], {
		duration: 2500,
		easing: cubicOut
	});

	let cameraFOV = 25;
	let cameraRotation = writable([0, 0, 0]);
	let camera;
	let orbitControls;
	let tweenDuration = 2500;

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
		event.stopPropagation();

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

	function handleCategoryPositions(event) {
		categoryPositions = event.detail;
		console.log('i reached to here Category Position', categoryPositions);
	}

	$: if (currentId !== previousId && currentId !== null && data && categoryPositions) {
		previousId = currentId; // Update the previousId to the new value

		const categoryPosition = categoryPositions.get(currentId);
		if (categoryPosition) {
			console.log(`Category Position for ${currentId}:`, categoryPosition);

			// If you want to see the entire item, you may want to adjust the camera distance
			// based on the size of the item or a fixed distance that works well for your scene.
			const targetDistance = 1000; // Adjust this value as needed
			const direction = new Vector3(...$cameraPosition).sub(categoryPosition).normalize();
			const newCameraPosition = direction.multiplyScalar(-targetDistance).add(categoryPosition);

			// Set the camera position and target to center on the categoryPosition
			cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
			cameraTarget.set([categoryPosition.x, categoryPosition.y, categoryPosition.z]);
		}
	}
</script>

<!-- <T.PointLight position={$cameraPosition} cas	$: if (currentId !== null && data && categoryPositions) {
		const category = data.categories.find((c) => c.id === currentId);
		if (category) {
			const categoryPosition = categoryPositions.get(currentId);
			if (categoryPosition) {
				console.log(`Category Position for ${currentId}:`, categoryPosition);
				const extraSpaceFactor = 1.2;
				const direction = new Vector3(...$cameraPosition).sub(categoryPosition).normalize();

				const adjustedDistance = Math.tan((cameraFOV * Math.PI) / 360) * extraSpaceFactor;
				const newCameraPosition = direction.multiplyScalar(-adjustedDistance).add(categoryPosition);
				newCameraPosition.x += Math.random() - 0.5;
				newCameraPosition.y += Math.random() - 0.5;
				newCameraPosition.z += Math.random() - 0.5;
				cameraPosition.set([newCameraPosition.x, newCameraPosition.y, newCameraPosition.z]);
				cameraTarget.set([categoryPosition.x, categoryPosition.y, categoryPosition.z]);
			}
		}
	}tShadow intensity={0.8} distance={0} /> -->
<T.PerspectiveCamera
	bind:this={camera}
	bind:position={$cameraPosition}
	makeDefault
	fov={cameraFOV}
	far={75000}
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
	on:boxclick={onBoxClick}
	on:workclick={onWorkClick}
	on:categorypositions={handleCategoryPositions}
/>

<!-- <T.Mesh position={$cameraTarget}>
	<T.BoxGeometry args={[250, 250, 250]} />
	<T.MeshBasicMaterial opacity={0.25} transparent={true} doubleSided={true} color="red" />
</T.Mesh> -->
