<script>
	//@ts-nocheck
	import { Vector3 } from 'three';
	import CategoryBox from '$lib/components/CategoryBox.svelte';
	import WorkDistributor from './WorkDistributor.svelte';
	import { Text } from '@threlte/extras';
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
	const range = new Vector3(25000, 25000, 25000);

	// Event Dispatcher
	const dispatch = createEventDispatcher();
	let activeBoxId = null; // This will store the ID of the currently active box

	function setActiveBoxId(id) {
		activeBoxId = id;
	}
	const handleBoxClick = createBoxClickHandler(dispatch, setActiveBoxId);

	// Updated Category function
	const updatedCategories = categories.map((category) => {
		const workCount = countWorksPerCategory(works, category.id);
		const scaleFactor = 1 + workCount;
		const scaledSize = calculateScaledSize(size.clone(), scaleFactor);
		return { ...category, size: roundVectorToCellSize(scaledSize, cellSize) };
	});

	// Generate random positions for each category and store them in a map.
	const categoryPositions = new Map();
	generateUniquePositions(updatedCategories, range, categoryPositions);

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
