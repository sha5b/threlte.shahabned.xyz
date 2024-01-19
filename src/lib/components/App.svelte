<script>
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	export let data;
</script>

<Canvas>
	<Scene {data} />
</Canvas>
