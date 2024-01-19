<script>
	import { Vector3 } from 'three';

	import CategoryBox from '$lib/components/CategoryBox.svelte';
	import { addSyntheticLeadingComment } from 'typescript';
	export let categories = [];

	// Define the range for each axis and the step size.
	const range = new Vector3(2000, 2000, 2000);
	const step = 50; // This should be the minimum size or a common factor of sizes.

	// Helper function to generate a random position on the grid.
	function getRandomGridPosition(range, step) {
		// ... calculations for x, y, z
		return new Vector3(
			Math.floor(Math.random() * (range.x / step)) * step - range.x / 2,
			Math.floor(Math.random() * (range.y / step)) * step - range.y / 2,
			Math.floor(Math.random() * (range.z / step)) * step - range.z / 2
		);
	}

	// Generate random positions for each category and store them in a map.
	const categoryPositions = new Map(
		categories.map((category) => [category.id, getRandomGridPosition(range, step)])
	);
</script>

{#each categories as category (category.id)}
	<CategoryBox position={categoryPositions.get(category.id)} />
{/each}


