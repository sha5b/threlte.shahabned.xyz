<script>
	//@ts-nocheck
	import { Vector3 } from 'three';
	import CategoryBox from '$lib/components/CategoryBox.svelte';
	import WorkDistributor from './WorkDistributor.svelte';
	import { Text } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';

	export let categories = [];
	export let works = [];
	export let size = new Vector3(500, 500, 500);

	let cellSize = 500;
	const range = new Vector3(10000, 10000, 10000);

	// Event Dispatches Start
	const dispatch = createEventDispatcher();
	let activeBoxId = null; // This will store the ID of the currently active box
	function handleBoxClick(event) {
		const { id } = event.detail;
		activeBoxId = id; // Set the active box ID
		dispatch('boxclick', event.detail); // Re-dispatch the event to the Scene
	}

	function countWorksPerCategory(categoryId) {
		return works.filter((work) => work.category === categoryId).length;
	}

	function calculateScaledSize(baseSize, scaleFactor) {
		return baseSize.multiplyScalar(scaleFactor);
	}

	function roundVectorToCellSize(vector) {
		vector.x = roundToCellSize(vector.x);
		vector.y = roundToCellSize(vector.y);
		vector.z = roundToCellSize(vector.z);
		return vector;
	}

	function roundToCellSize(value) {
		return Math.round(value / cellSize) * cellSize;
	}

	// Refactored update categories function
	const updatedCategories = categories.map((category) => {
		const workCount = countWorksPerCategory(category.id);
		const scaleFactor = 1 + workCount;
		const scaledSize = calculateScaledSize(size.clone(), scaleFactor);
		return { ...category, size: roundVectorToCellSize(scaledSize) };
	});

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

{#each updatedCategories as category (category.id)}
	<CategoryBox
		position={categoryPositions.get(category.id)}
		size={category.size}
		{cellSize}
		id={category.id}
		active={activeBoxId === category.id}
		on:boxclick={handleBoxClick}
	>
		<Text text={category.title} fontSize={50} color="black" />
		<WorkDistributor />
	</CategoryBox>
{/each}
