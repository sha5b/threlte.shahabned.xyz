<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Float, Grid, OrbitControls } from '@threlte/extras';
	import CategoryDistribution from '$lib/components/CategoryDistribution.svelte';

	export let data; //Pasted data from the Database
	console.log(data);
</script>

<T.PerspectiveCamera makeDefault position={[-500, 500, 500]} fov={45} far={10000}>
	<OrbitControls autoRotate enableZoom={true} enableDamping autoRotateSpeed={0.5} target.y={1.5} />
</T.PerspectiveCamera>

<T.DirectionalLight intensity={0.8} position.x={5} position.y={10} />
<T.AmbientLight intensity={0.2} />

<CategoryDistribution categories={data.categories} />