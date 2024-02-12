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
		generateUniquePositions
	} from '$lib/utils/utils';

	export let categories = [];
	export let works = [];
	export let size = new Vector3(500, 500, 500);
	let color = 'white';
	const spacingFactor = 2; // 2 will double the size, providing ample space
	let cellSize = 500;

	// Event Dispatcher
	const dispatch = createEventDispatcher();
	let activeBoxId = null; // This will store the ID of the currently active box

	function handleBoxClick(event) {
		const { id } = event.detail;
		activeBoxId = id;
		dispatch('boxclick', event.detail);
	}

	function handleWorkClick(event) {
		// Re-dispatch the event with the same detail
		dispatch('workclick', event.detail);
		console.log(event.detail);
	}

	// Updated Category function
	function calculateCategorySize(workCount) {
		if (workCount === 0) return new Vector3();

		const baseSize = Math.ceil(Math.sqrt(workCount));
		return new Vector3(
			baseSize * cellSize * spacingFactor,
			baseSize * cellSize * spacingFactor,
			baseSize * cellSize * spacingFactor
		);
	}

	function updateCategoriesWithSizeAndWorks() {
		return categories.map((category) => {
			const categoryWorks = works.filter((work) => work.category === category.id);
			const workCount = categoryWorks.length;
			return { ...category, works: categoryWorks, size: calculateCategorySize(workCount) };
		});
	}

	const updatedCategories = updateCategoriesWithSizeAndWorks();
	const categoryPositions = new Map();

	function calculateMaxScaledSize(categories) {
		return categories.reduce((maxSize, category) => {
			const workCount = countWorksPerCategory(works, category.id);
			const scaleFactor = workCount; // change the value to bring them closer toegehtrer
			const scaledSize = calculateScaledSize(size.clone(), scaleFactor);
			return {
				x: Math.max(maxSize.x, scaledSize.x),
				y: Math.max(maxSize.y, scaledSize.y),
				z: Math.max(maxSize.z, scaledSize.z)
			};
		}, new Vector3());
	}
	function calculateRange(categories, maxScaledSize, padding = 0) {
		const numBoxesPerSide = Math.ceil(Math.cbrt(categories.length));
		const paddedSize = (size, numBoxes) => size * numBoxes + (numBoxes - 1) * padding;
		const volume = ['x', 'y', 'z'].reduce(
			(vol, axis) => vol * paddedSize(maxScaledSize[axis], numBoxesPerSide),
			1
		);
		const sideLength = Math.cbrt(volume);
		return new Vector3(sideLength, sideLength, sideLength);
	}

	const maxScaledSize = calculateMaxScaledSize(updatedCategories, size);
	const dynamicRange = calculateRange(updatedCategories, maxScaledSize);
	generateUniquePositions(updatedCategories, dynamicRange, categoryPositions, cellSize);
</script>

{#each updatedCategories as category (category.id)}
	<T.Group>
		<CategoryBox
			position={categoryPositions.get(category.id)}
			size={category.size}
			{cellSize}
			id={category.id}
			active={activeBoxId === category.id}
			on:boxclick={handleBoxClick}
			workCount={countWorksPerCategory(works, category.id)}
			{color}
		>
			<T.Mesh
				position={[
					category.size.x / 2 + 125, // Half the size to the right
					-category.size.y / 2 - 125, // Half the size down
					category.size.z / 2 // Assuming you want it aligned with the front of the box
				]}
			>
				<Text text={category.title} fontSize={400} anchorX="left" anchorY="bottom" {color} />
			</T.Mesh></CategoryBox
		>
		<T.Mesh>
			<WorkDistributor
				{color}
				categoryPosition={categoryPositions.get(category.id)}
				works={category.works}
				categorySize={category.size}
				{cellSize}
				active={activeBoxId === category.id}
				on:workclick={handleWorkClick}
			/>
		</T.Mesh>
	</T.Group>
{/each}
