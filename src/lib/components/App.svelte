<script>
	//@ts-nocheck
	import { onMount } from 'svelte';
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { createEventDispatcher } from 'svelte';

	export let data;

	const dispatch = createEventDispatcher();

	function handleBoxClick(event) {
		dispatch('boxclick', event.detail);
	}

	function handleWorkClick(event) {
		dispatch('workclick', event.detail);
	}

</script>

<Canvas>
	<Scene {data} on:boxclick={handleBoxClick} on:workclick={handleWorkClick}/>
</Canvas>
