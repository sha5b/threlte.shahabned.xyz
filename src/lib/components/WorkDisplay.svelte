<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { useTexture, Text } from '@threlte/extras';
	import * as THREE from 'three';
	export let work;
	export let texture;
	export let rotation;
	export let cellSize;
	export let color;

	// Calculate aspect ratio and geometry dimensions
	const textureAspectRatio = texture.source.data.height / texture.source.data.width;
	const geometryWidth = Math.min(cellSize, texture.source.data.width) * 0.75;
	const geometryHeight = geometryWidth * textureAspectRatio;

	function handleMeshClick(event) {
		event.stopPropagation();
		// Handle the mesh click event, if necessary
	}
</script>

<T.Group on:workclick={handleMeshClick}>
	<T.Group {rotation}>
		<T.Mesh rotation={[0, Math.random() * Math.PI * 4, 0]}>
			<T.PlaneGeometry args={[geometryWidth, geometryHeight]} />
			<T.MeshBasicMaterial billboard={true} side={THREE.DoubleSide} map={texture} opacity={1} />
		</T.Mesh>
		<T.Group>
			<T.Mesh	
				on:workclick={handleMeshClick}
				position={[
					-225, // Half the size to the right
					225, // Half the size down
					225 // Assuming you want it aligned with the front of the box
				]}
				overflowWrap={'break-word'}
				maxWidth={cellSize}
			>
				<Text text={work.title} fontSize={40} {color} />
			</T.Mesh>
			<T.Mesh
				on:workclick={handleMeshClick}
				position={[
					-225, // Half the size to the right
					-225, // Half the size down
					225 // Assuming you want it aligned with the front of the box
				]}
			>
				<Text
					text={work.expand.category.title}
					fontSize={20}
					{color}
					anchorX="left"
					anchorY="bottom"
				/>
			</T.Mesh>
			<T.Mesh
				on:workclick={handleMeshClick}
				position={[
					225, // Half the size to the right
					-225, // Half the size down
					225 // Assuming you want it aligned with the front of the box
				]}
			>
				<Text text={work.type} fontSize={20} {color} anchorX="right" anchorY="bottom" />
			</T.Mesh>
		</T.Group>
		<!-- Add more text or other elements as needed -->
	</T.Group>
</T.Group>
