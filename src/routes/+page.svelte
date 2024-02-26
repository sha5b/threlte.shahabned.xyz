<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	export let data;
	import Navigation from '$lib/components/Navigation.svelte';
	import DetailInformation from '$lib/components/DetailInformation.svelte';

	let selectedCategoryId = null;
	let selectedWorkId = null;
	let currentId = null;

	function handleBoxClick(event) {
		const { position, newCameraPosition, id } = event.detail;
		selectedCategoryId = id;
		selectedWork = null;
	}

	function handleWorkClick(event) {
		const { id, absolutePosition, newCameraPosition } = event.detail;
		selectedWorkId = id;

		// Handle work ID as needed
	}

	function setCategoryId(id) {
		currentId = id;
		selectedCategoryId = id;
		selectedWork = null;
	}
	function setWorkId(id) {
		if (selectedWorkId !== id) {
			currentId = id;
			selectedWorkId = id;
		}
	}

	// This computed variable will reactively update whenever `selectedCategoryId` or `data.works` changes.
	$: filteredWorks = selectedCategoryId
		? data.works.filter((work) => work.category === selectedCategoryId)
		: [];

	let showDropdown = false;

	let selectedWork = selectedWorkId ? data.works.find((work) => work.id === selectedWorkId) : null;

	// Make sure to update selectedWork whenever selectedWorkId changes
	$: if (selectedWorkId) {
		selectedWork = data.works.find((work) => work.id === selectedWorkId);
	} else {
		selectedWork = null;
	}

	function formatDate(dateString) {
		const options = {
			year: 'numeric',
			month: 'long'
		};
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, options);
	}
</script>

<svelte:head>
    <title>shahabverse</title>
	<link rel="canonical" href="https://shahabned.xyz/" />
    
</svelte:head>
<Navigation
	{selectedCategoryId}
	{selectedWorkId}
	{data}
	{filteredWorks}
	{setCategoryId}
	{setWorkId}
	{formatDate}
/>

<flex>
	<scene>
		<App
			{data}
			{currentId}
			{selectedCategoryId}
			{selectedWorkId}
			on:boxclick={handleBoxClick}
			on:workclick={handleWorkClick}
		/>
	</scene>
</flex>

<style>
	:global(body) {
		margin: 0px;
	}

	scene {
		position: fixed;
		z-index: -1;
		display: block;
		flex-grow: 1;
		width: 100%;
		height: 100%;
		background: rgb(13, 19, 32);
		background: radial-gradient(circle at center, rgb(206, 37, 88) 0%, rgb(16, 129, 110) 100%);
	}
</style>
