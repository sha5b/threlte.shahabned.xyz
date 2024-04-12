<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { useTexture, Text, HTML } from '@threlte/extras';
	import * as THREE from 'three';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onMount, onDestroy } from 'svelte';
	import { getImageURL } from '$lib/utils/getURL';
	import { Vector3 } from 'three';

	export let work;
	export let rotation;
	export let cellSize;
	export let color;
	export let activeCategory;
	export let selectedWorkId;
	export let activeWork;

	let planeRotation = [0, 0, 0];
	let interval;
	let distanceFactor = 250; // Adjust this value as needed to prevent z-fighting
	let showGallery = false;

	function stopPropagation(event) {
		event.stopPropagation();
	}

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

	async function loadTextureForWork(work) {
		let loadedTexture;
		let textureAspectRatio;
		let loadedGeometryWidth;
		let loadedGeometryHeight;

		const imageUrl = getImageURL(work.collectionId, work.id, work.thump);

		try {
			loadedTexture = await useTexture(imageUrl); // Assuming useTexture is async
			textureAspectRatio = loadedTexture.source.data.height / loadedTexture.source.data.width;
			loadedGeometryWidth = Math.min(cellSize, loadedTexture.source.data.width);
			loadedGeometryHeight = loadedGeometryWidth * textureAspectRatio;
		} catch (error) {
			console.error('Error loading texture:', error);
		}

		return {
			texture: loadedTexture,
			geometryWidth: loadedGeometryWidth,
			geometryHeight: loadedGeometryHeight
		};
	}

	// Reactive statement to load the texture when 'work' changes
	let textureDataPromise;
	$: if (work) {
		textureDataPromise = loadTextureForWork(work);
	}

	function toggleGallery(event) {
		event.stopPropagation();
		showGallery = !showGallery;
	}

	function getRandomPosition(cellSize) {
		return [
			(Math.random() - 0.5) * cellSize,
			(Math.random() - 0.5) * cellSize,
			(Math.random() - 0.5) * cellSize
		];
	}
	function getRandomRotation() {
		// Rotation values are in radians.
		return [
			0, // Random rotation around x-axis
			Math.random() * Math.PI * 2, // Random rotation around y-axis
			0 // Random rotation around z-axis
		];
	}

    $: showGallery = activeWork;



</script>

{#await textureDataPromise then { texture, geometryWidth, geometryHeight }}
	<T.Group on:click={stopPropagation}>
		<T.Group {rotation}>
			<T.Mesh rotation={planeRotation} >
				<T.PlaneGeometry args={[geometryWidth / 1.5, geometryHeight / 1.5]} />
				<T.MeshBasicMaterial
					side={THREE.DoubleSide}
					opacity={1}
					map={texture}
					transparent={true}
					depthTest={true}
				/>
			</T.Mesh>
		</T.Group>
	</T.Group>
{/await}
<T.Group>
	<T.Mesh
		position={[
			0, // Half the size to the right
			0, // Half the size down
			250 // Assuming you want it aligned with the front of the box
		]}
	>
		<HTML transform {distanceFactor} pointerEvents={'none'}
			><div class="work-html">
				<h1>{work.title}</h1>
				<div style="display: flex;justify-content: space-between">
					<p>{work.expand.category.title}</p>
					<p>{work.type} media</p>
				</div>
			</div></HTML
		>
	</T.Mesh>
</T.Group>

{#if showGallery}
	{#each work.gallery as galleryItem, index}
		<T.Group rotation = {getRandomRotation()}>
			<T.Mesh
				position={getRandomPosition(cellSize)}
				on:click={stopPropagation}
				raycast={false}
				rotation={planeRotation}
			>
				<HTML transform distanceFactor={distanceFactor/2}  pointerEvents={'none'}>
					<div>
						<!-- Your HTML content with img tag -->
						<img
							src={getImageURL(work.collectionId, work.id, galleryItem)}
							alt={galleryItem.title}
							style="max-width: {cellSize}px; max-height: {cellSize}px;"
						/>
					</div>
				</HTML>
			</T.Mesh>
		</T.Group>
	{/each}
{/if}

<style>
	.work-html {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 700px; /* Ensure the container stretches full height */
		width: 700px;
		text-align: left;
	}
	.work-html h1 {
		margin-bottom: auto; /* Push all other elements to the bottom */
	}

	h1 {
		font-size: 3rem;
		color: black;
	}
	p {
		font-size: black;
	}

	flex {
		display: flex;
		flex-direction: column;
	}
</style>
