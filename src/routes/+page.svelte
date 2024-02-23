<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	import { writable } from 'svelte/store';
	export let data;
	import { slide, fly, fade } from 'svelte/transition';
	import { getImageURL } from '$lib/utils/getURL';
	import { afterUpdate } from 'svelte';
	import Navigation from '$lib/components/Navigation.svelte';

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
			closeAllModals(); // Close any existing modals when switching works
			currentId = id;
			selectedWorkId = id;
			const work = data.works.find((w) => w.id === id);
			if (work && work.synopsis) {
				openModal(work.synopsis);
			}
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

	let modals = [];

	function openModal(content) {
		const maxWidthPercentage = 80; // Maximum width of modal in percentage of viewport width
		const maxHeightPercentage = 80; // Maximum height of modal in percentage of viewport height
		const modalWidth = 20; // Approximate width of modal in percentage of viewport width
		const modalHeight = 20; // Approximate height of modal in percentage of viewport height

		const modal = {
			id: Math.random().toString(36).substr(2, 9),
			content,
			x: Math.random() * (maxWidthPercentage - modalWidth), // random X position within viewport bounds
			y: Math.random() * (maxHeightPercentage - modalHeight) // random Y position within viewport bounds
		};
		modals = [...modals, modal];
	}

	function closeModal(id) {
		modals = modals.filter((modal) => modal.id !== id);
	}
	function closeAllModals() {
		modals = [];
	}
</script>

{#each modals as modal (modal.id)}
	<div class="modal" style="left: {modal.x}%; top: {modal.y}%;">
		<button class="close-btn" on:click={() => closeModal(modal.id)}>Close</button>
		<div class="content">
			{@html modal.content}
		</div>
	</div>
{/each}

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
		min-width: 100vw;
		min-height: 100vh;
		background: rgb(13, 19, 32);
		background: radial-gradient(circle at center, rgb(206, 37, 88) 0%, rgb(16, 129, 110) 100%);
	}

	.modal {
		position: absolute;
		width: 500px;
		max-height: 100%;
		background-color: white;
		border: 1px solid #ccc;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
		padding: 10px;
		box-sizing: border-box;
		z-index: 10;
	}
	.close-btn {
		position: absolute;
		top: 0;
		right: 0;
	}
	.content {
		/* Styles for the content area */
	}
</style>
