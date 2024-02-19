<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { useTexture, Text, HTML } from '@threlte/extras';
	import * as THREE from 'three';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount, onDestroy } from 'svelte';
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
		color: '#000000', // Set the color you want
		side: THREE.DoubleSide // Render both sides of the material
	});
</script>

<T.Group on:click={stopPropagation}>
	<T.Group {rotation} on:click={stopPropagation}>
		<T.Mesh rotation={planeRotation}>
			<T.PlaneGeometry args={[geometryWidth / 1.5, geometryHeight / 1.5]} />
			<T.MeshBasicMaterial side={THREE.DoubleSide} map={texture} opacity={1}    transparent={true} />
		</T.Mesh>

		<!-- Add more text or other elements as needed -->
	</T.Group>
</T.Group>
<T.Group>
	<T.Mesh
		position={[
			-225, // Half the size to the right
			225, // Half the size down
			250 // Assuming you want it aligned with the front of the box
		]}
		overflowWrap={'break-word'}
		maxWidth={cellSize}
	>
		<Text text={work.title} fontSize={40} {color} material={meshTextMaterial}/>
	</T.Mesh>
	<T.Mesh
		position={[
			-225, // Half the size to the right
			-225, // Half the size down
			250 // Assuming you want it aligned with the front of the box
		]}
	>
		<Text text={work.expand.category.title} fontSize={20} {color} anchorX="left" anchorY="bottom" />
	</T.Mesh>
	<T.Mesh
		position={[
			225, // Half the size to the right
			-225, // Half the size down
			250 // Assuming you want it aligned with the front of the box
		]}
	>
		<Text text={work.type} fontSize={20} {color} anchorX="right" anchorY="bottom" />
	</T.Mesh>
</T.Group>

