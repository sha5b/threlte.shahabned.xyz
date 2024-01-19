<script>
	import { Vector3 } from 'three';
	import CategoryBox from '$lib/components/CategoryBox.svelte';
	
	export let categories = [];
	export let size = new Vector3(250, 250, 250);
	export let works = [];

	// Define the range for each axis.
	const range = new Vector3(2000, 2000, 2000);

	// Helper function to calculate the size for each category based on the count of works
	const calculateCategorySizes = (works) => {
		const categoryCounts = works.reduce((counts, work) => {
			counts[work.category] = (counts[work.category] || 0) + 1;
			return counts;
		}, {});

		const categorySizes = {};
		for (const category in categoryCounts) {
			categorySizes[category] = size.clone().multiplyScalar(categoryCounts[category]);
		}

		return categorySizes;
	};
	
	// Compute category sizes reactively whenever 'works' changes
	$: categorySizes = calculateCategorySizes(works);
	
	// Categories should be a unique list of categories derived from 'works'
	$: categories = [...new Set(works.map((work) => work.category))].map((cat) => ({ id: cat }));

	// Helper function to generate a non-overlapping position for each category.
	function getNonOverlappingPosition(categorySizes, range) {
		let positions = [];

		for (const [id, catSize] of Object.entries(categorySizes)) {
			let position;
			let collision;
			
			do {
				collision = false;
				// Generate a random position.
				position = new Vector3(
					Math.floor(Math.random() * (range.x / catSize.x)) * catSize.x - range.x / 2,
					Math.floor(Math.random() * (range.y / catSize.y)) * catSize.y - range.y / 2,
					Math.floor(Math.random() * (range.z / catSize.z)) * catSize.z - range.z / 2
				);

				// Check for collisions with existing positions.
				for (const pos of positions) {
					if (position.distanceToSquared(pos) < catSize.lengthSq()) {
						collision = true;
						break;
					}
				}
			} while (collision);

			positions.push(position);
		}

		return positions;
	}

	// Generate non-overlapping positions for each category and store them in a map.
	let categoryPositions = new Map();
	$: {
		const positions = getNonOverlappingPosition(categorySizes, range);
		categories.forEach((category, index) => {
			categoryPositions.set(category.id, positions[index]);
		});
	}
</script>

{#each categories as category (category.id)}
	<CategoryBox position={categoryPositions.get(category.id)} size={categorySizes[category.id]} />
{/each}

