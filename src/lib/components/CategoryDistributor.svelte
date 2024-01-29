<script>
	//@ts-nocheck
	import { Vector3 } from 'three';

	import CategoryBox from '$lib/components/CategoryBox.svelte';
	import WorkDistributor from './WorkDistributor.svelte';

	export let categories = [];
	export let size = new Vector3(500, 500, 500);
	let cellSize = 500;

	// Define the range for each axis and the step size.
	const range = new Vector3(5000, 5000, 5000);

	// Helper function to generate a random position on the grid.
	function getRandomGridPosition(range, size) {
		// Calculate the step size based on the size of the current box.
		const step = Math.max(size.x, size.y, size.z);

		return new Vector3(
			Math.floor(Math.random() * ((range.x - size.x) / step)) * step - (range.x - size.x) / 2,
			Math.floor(Math.random() * ((range.y - size.y) / step)) * step - (range.y - size.y) / 2,
			Math.floor(Math.random() * ((range.z - size.z) / step)) * step - (range.z - size.z) / 2
		);
	}

	function isOverlapping(position, size) {
		for (let [_, otherPosition] of categoryPositions) {
			if (
				position.x < otherPosition.x + size.x &&
				position.x + size.x > otherPosition.x &&
				position.y < otherPosition.y + size.y &&
				position.y + size.y > otherPosition.y &&
				position.z < otherPosition.z + size.z &&
				position.z + size.z > otherPosition.z
			) {
				// There is an overlap
				return true;
			}
		}
		// No overlap with any other boxes
		return false;
	}

	// Generate random positions for each category and store them in a map.
	const categoryPositions = new Map();
	categories.forEach((category) => {
		// Assume each category has a 'size' property with x, y, and z dimensions.
		let pos = getRandomGridPosition(range, size);
		while (isOverlapping(pos, size)) {
			// If overlap detected, generate a new position.
			pos = getRandomGridPosition(range, size);
		}
		categoryPositions.set(category.id, pos);
	});


</script>

{#each categories as category (category.id)}
	<CategoryBox
		position={categoryPositions.get(category.id)}
		{size}
		{cellSize}

	>
		<WorkDistributor />
	</CategoryBox>
{/each}
