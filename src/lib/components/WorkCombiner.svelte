<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { BoxGeometry, Vector3 } from 'three';
	import { MeshLineGeometry, MeshLineMaterial, interactivity } from '@threlte/extras';
	import { onMount } from 'svelte';

	export let works;
	export let combinedWorkPositions;
	export let color;
	export let cellSize;

	let linesToDraw = [];

	onMount(() => {
		calculateLines();
	});

    function calculateLines() {
    works.forEach((work) => {
        if (work.expand && work.expand.reference) {
            work.expand.reference.forEach((ref) => {
                if (combinedWorkPositions.has(ref.id) && combinedWorkPositions.has(work.id)) {
                    let startPos = combinedWorkPositions.get(work.id);
                    let endPos = combinedWorkPositions.get(ref.id);

                    // Calculate the direction for the offset by finding the dominant axis
                    let direction = new Vector3(
                        endPos.x - startPos.x,
                        endPos.y - startPos.y,
                        endPos.z - startPos.z
                    );

                    // Normalize the direction
                    direction.normalize();

                    // Depending on the direction, adjust the startPos and endPos
                    startPos = startPos.clone().addScaledVector(direction, cellSize / 2);
                    endPos = endPos.clone().addScaledVector(direction, -cellSize / 2);

                    linesToDraw.push({ start: startPos, end: endPos });
                    linesToDraw = linesToDraw
                }
            });
        }
    });
}
</script>

{#each linesToDraw as line}
	<T.Mesh>
		<MeshLineGeometry points={[line.start, line.end]} />
		<MeshLineMaterial
			width={50}
			{color}
			opacity={0.5}
			transparent={true}
			dashArray={0.05}
			dashRatio={0.1}
			attenuate={true}
		/>
	</T.Mesh>
{/each}
