<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	export let data;

	let canvasHeight;

	// Update canvasHeight when the window is resized
	function handleResize() {
		canvasHeight = window.innerHeight;
	}

	onMount(() => {
		// Set the initial canvas height to the window's innerHeight
		canvasHeight = window.innerHeight;
		// Add event listener for resize events
		window.addEventListener('resize', handleResize);

		// Return a cleanup function to remove the event listener
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
	
</script>

<flex>
	<flex-item>
		<Canvas size={{ width: 1000, height: canvasHeight }} >
			<Scene {data} />
		</Canvas>
	</flex-item>
	<flex-item style='background-color: white'>
		<p>Hi</p>
	</flex-item>
</flex>

<style>
	flex {
		display: flex;
		align-items: stretch;
		justify-content: space-around;
	}
	flex-item {
		flex: 1;
	}
</style>
