<script>
	//@ts-nocheck
	import { T } from '@threlte/core';
	import { Vector3 } from 'three';
	import CategoryBox from '$lib/components/CategoryBox.svelte';
	import WorkDistributor from './WorkDistributor.svelte';
	import WorkCombiner from './WorkCombiner.svelte';
	import { Text, HTML } from '@threlte/extras';
	import { createEventDispatcher } from 'svelte';
	import {
		countWorksPerCategory,
		calculateScaledSize,
		generateUniquePositions
	} from '$lib/utils/utils';
	import { onMount } from 'svelte';

	export let categories = [];
	export let works = [];
	export let size = new Vector3(500, 500, 500);

	let color = 'snow';
	const spacingFactor = 2; // Used to scale the size
	let cellSize = 500;

	const dispatch = createEventDispatcher();
	export let activeBoxId = null; // This will store the ID of the currently active box
	export let selectedCategoryId;
	export let selectedWorkId;

	function handleBoxClick(event) {
		const { id, position } = event.detail;
		activeBoxId = id;
		dispatch('boxclick', event.detail);
	}

	function handleWorkClick(event) {
		const { id, position } = event.detail;
		activeBoxId = id;
		dispatch('workclick', event.detail);
	}

	function calculateScaledCategorySize(workCount) {
		if (workCount === 0) return new Vector3();
		const baseSize = Math.ceil(Math.sqrt(workCount));
		return new Vector3(
			baseSize * cellSize * spacingFactor,
			baseSize * cellSize * spacingFactor,
			baseSize * cellSize * spacingFactor
		);
	}

	function enrichCategories(categories, works) {
		return categories.map((category) => {
			const categoryWorks = works.filter((work) => work.category === category.id);
			const workCount = categoryWorks.length;
			return { ...category, works: categoryWorks, size: calculateScaledCategorySize(workCount) };
		});
	}

	function getMaxScaledSize(categories) {
		return categories.reduce((maxSize, category) => {
			const scaleFactor = countWorksPerCategory(works, category.id);
			const scaledSize = calculateScaledSize(size.clone(), scaleFactor);
			return {
				x: Math.max(maxSize.x, scaledSize.x),
				y: Math.max(maxSize.y, scaledSize.y),
				z: Math.max(maxSize.z, scaledSize.z)
			};
		}, new Vector3());
	}

	function calculateContainerRange(categories, maxScaledSize, padding = 0.1) {
		const numCategoriesPerSide = Math.ceil(Math.cbrt(categories.length) / 2); // Halving the number of categories per side
		const paddedSize = (dimension, numBoxes) => dimension * numBoxes + (numBoxes + 1) * padding; // Adjusted formula
		const volume = ['x', 'y', 'z'].reduce(
			(vol, axis) => vol * paddedSize(maxScaledSize[axis], numCategoriesPerSide),
			1
		);
		return new Vector3(...Array(3).fill(Math.cbrt(volume)));
	}

	const updatedCategories = enrichCategories(categories, works);
	const categoryPositions = new Map();
	const maxScaledSize = getMaxScaledSize(updatedCategories);
	const dynamicRange = calculateContainerRange(updatedCategories, maxScaledSize);
	generateUniquePositions(updatedCategories, dynamicRange, categoryPositions, cellSize);

	let combinedWorkPositions = new Map();

	onMount(() => {
		dispatch('categorypositions', { categoryPositions, size: maxScaledSize });
	});

	function handleWorkPositions(event) {
		const newPositions = event.detail.absoluteWorkPositions;

		// Merge the new positions into the combinedWorkPositions map
		newPositions.forEach((position, id) => {
			combinedWorkPositions.set(id, position);
		});

		// Optionally, you can dispatch an event with the updated combined map
		dispatch('combinedWorkpositions', { combinedWorkPositions });
	}
</script>

{#each updatedCategories as category (category.id)}
	<T.Group>
		<CategoryBox
			position={categoryPositions.get(category.id)}
			size={category.size}
			{cellSize}
			id={category.id}
			active={selectedCategoryId === category.id}
			on:boxclick={handleBoxClick}
			{color}
		>
			<T.Mesh
				position={[
					-category.size.x / 2, // Half the size to the right
					-category.size.y / 2, // Half the size down
					category.size.z / 2 // Assuming you want it aligned with the front of the box
				]}
			>
				<Text text={category.title} fontSize={300} anchorX="left" anchorY="bottom" />
			</T.Mesh></CategoryBox
		>
		<T.Mesh renderOrder={2}>
			<WorkDistributor
				{selectedWorkId}
				{color}
				categoryPosition={categoryPositions.get(category.id)}
				works={category.works}
				categorySize={category.size}
				{cellSize}
				active={selectedCategoryId === category.id}
				on:workclick={handleWorkClick}
				on:workpositions={handleWorkPositions}
			/>
		</T.Mesh>
		<WorkCombiner {cellSize} {color} {works} {combinedWorkPositions} />
	</T.Group>
{/each}
