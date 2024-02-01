<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import CategoryBox from '$lib/components/CategoryBox.svelte';
	import WorkDistributor from './WorkDistributor.svelte';
	import { Text, HTML } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';
	import {
		countWorksPerCategory,
		calculateScaledSize,
		roundVectorToCellSize,
		createBoxClickHandler,
		generateUniquePositions
	} from '$lib/utils/categoryUtils';

	export let categories = [];
	export let works = [];
	export let size = new Vector3(500, 500, 500);

	let cellSize = 500;
	// Event Dispatcher
	const dispatch = createEventDispatcher();
	let activeBoxId = null; // This will store the ID of the currently active box

	function setActiveBoxId(id) {
		activeBoxId = id;
	}
	const handleBoxClick = createBoxClickHandler(dispatch, setActiveBoxId);

	// Updated Category function
	const updatedCategories = categories.map((category) => {
		const categoryWorks = works.filter((work) => work.category === category.id);
		const workCount = countWorksPerCategory(works, category.id);
		const scaleFactor = 1 + workCount;
		const scaledSize = calculateScaledSize(size.clone(), scaleFactor);
		return { ...category, works: categoryWorks, size: roundVectorToCellSize(scaledSize, cellSize) };
	});

	// Generate random positions for each category and store them in a map.
	const categoryPositions = new Map();

	function calculateRange(categories, baseSize, padding = 1.05) {
		// Reduced padding for tighter spacing
		let maxScaledSize = new Vector3();

		// Calculate the maximum scaled size among all categories
		categories.forEach((category) => {
			const workCount = countWorksPerCategory(works, category.id);
			const scaleFactor = 1 + workCount;
			const scaledSize = calculateScaledSize(baseSize.clone(), scaleFactor);
			maxScaledSize.x = Math.max(maxScaledSize.x, scaledSize.x);
			maxScaledSize.y = Math.max(maxScaledSize.y, scaledSize.y);
			maxScaledSize.z = Math.max(maxScaledSize.z, scaledSize.z);
		});

		// Calculate the arrangement of the boxes in a grid layout
		const numBoxesPerSide = Math.ceil(Math.cbrt(categories.length));

		// Calculate total volume needed with padding
		const totalVolume =
			(maxScaledSize.x * numBoxesPerSide + (numBoxesPerSide - 1) * padding) *
			(maxScaledSize.y * numBoxesPerSide + (numBoxesPerSide - 1) * padding) *
			(maxScaledSize.z * numBoxesPerSide + (numBoxesPerSide - 1) * padding);

		// Derive range from total volume (for a cubic distribution)
		const sideLength = Math.cbrt(totalVolume);
		return new Vector3(sideLength, sideLength, sideLength);
	}
	// Use the range for generateUniquePositions
	const dynamicRange = calculateRange(categories, size);

	generateUniquePositions(updatedCategories, dynamicRange, categoryPositions);
</script>

{#each updatedCategories as category (category.id)}
	<CategoryBox
		position={categoryPositions.get(category.id)}
		size={category.size}
		{cellSize}
		id={category.id}
		active={activeBoxId === category.id}
		on:boxclick={handleBoxClick}
		workCount={countWorksPerCategory(works, category.id)}
	>
		<T.Mesh
			position={[
				category.size.x / 2 + 125, // Half the size to the right
				-category.size.y / 2 - 125, // Half the size down
				category.size.z / 2 // Assuming you want it aligned with the front of the box
			]}
		>
			<Text
				text={category.title}
				fontSize={400}
				color="black"
				anchorX="left"
				anchorY="bottom"
			/>
		</T.Mesh>
		{category.works}
		<WorkDistributor works={category.works} categorySize={category.size} {cellSize} />
	</CategoryBox>
{/each}
