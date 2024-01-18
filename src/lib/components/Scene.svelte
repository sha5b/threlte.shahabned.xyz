<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Float, Grid, OrbitControls } from '@threlte/extras';
	import CategoryBox from '$lib/components/CategoryBox.svelte';

	export let data; //Pasted data from the Database
</script>

<T.PerspectiveCamera makeDefault position={[-10, 10, 10]} fov={45}>
	<OrbitControls autoRotate enableZoom={true} enableDamping autoRotateSpeed={0.5} target.y={1.5} />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

{#each data.categories as category, i}
	<CategoryBox/>
{/each}
