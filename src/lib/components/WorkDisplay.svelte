<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { useTexture, Text, HTML } from '@threlte/extras';
	import * as THREE from 'three';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount, onDestroy } from 'svelte';

	const Oxanium = '/fonts/Oxanium_ExtraLight_Regular.json';
	export let work;
	export let texture;
	export let rotation;
	export let cellSize;
	export let color;
	export let activeCategory;

	// Calculate aspect ratio and geometry dimensions
	const textureAspectRatio = texture.source.data.height / texture.source.data.width;
	const geometryWidth = Math.min(cellSize, texture.source.data.width);
	const geometryHeight = geometryWidth * textureAspectRatio;

	function stopPropagation(event) {
		event.stopPropagation();
	}
	let planeRotation = [0, 0, 0];
	let interval;

	// Start the rotation when the component is first added to the DOM
	onMount(() => {
		interval = setInterval(() => {
			// Update Y rotation over time
			planeRotation = [0, planeRotation[1] + 0.001, 0];
		}, 20); // Adjust time here to control the speed of rotation
	});

	// Clean up the interval when the component is destroyed
	onDestroy(() => {
		clearInterval(interval);
	});

	const meshTextMaterial = new THREE.MeshBasicMaterial({
		color: 'white', // Set the color you want
		side: THREE.DoubleSide // Render both sides of the material
	});
	let distanceFactor = 250; // Adjust this value as needed to prevent z-fighting
</script>

<T.Group on:click={stopPropagation}>
	<T.Group {rotation} on:click={stopPropagation}>
		<T.Mesh rotation={planeRotation}>
			<T.PlaneGeometry args={[geometryWidth / 1.5, geometryHeight / 1.5]} />
			<T.MeshBasicMaterial
				side={THREE.DoubleSide}
				map={texture}
				opacity={1}
				transparent={true}
				depthWrite={false}
			/>
		</T.Mesh>

		<!-- Add more text or other elements as needed -->
	</T.Group>
</T.Group>
<T.Group>
	<T.Mesh
		position={[
			-50, // Half the size to the right
			50, // Half the size down
			250 // Assuming you want it aligned with the front of the box
		]}
	>
		<HTML transform {distanceFactor} pointerEvents={'none'}
			><div class="work-html">
				<flex>
				<h1>{work.title}</h1>
				<p>{work.expand.category.title} </p>
				<p>{work.type} media </p>
			</flex>
			</div></HTML
		>
	</T.Mesh>

</T.Group>

<style>
	.work-html {
		pointer-events: none;
		width: 500px;
		height: 500px;
		user-select: none;
		-webkit-user-select: none;
		overflow: hidden;
	}

	h1 {

		font-size: 3rem;
		color: white;
	}
	p {
		font-size: 2rem;
		color: white;
	}

	flex {
		display: flex;
		flex-direction: column;
	}
	
</style>