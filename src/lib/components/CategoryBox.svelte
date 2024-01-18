<script>
	import { T } from '@threlte/core';

	export let size = { x: 10, y: 10, z: 10 }; // Size of the box can be set individually for x, y, and z
</script>

<T.Mesh>
	<T.BoxGeometry args={[size.x, size.y, size.z]} />
	<T.MeshBasicMaterial color="#fe3d00" wireframe />
</T.Mesh>
asdasdasd