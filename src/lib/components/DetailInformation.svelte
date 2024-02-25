<script>
    export let selectedWork;

    // We'll assume the synopsis is a property of selectedWork
    // and that it contains HTML content to be rendered.
</script>

{#if selectedWork && selectedWork.synopsis}
    <aside class="work-synopsis">
        <div class='text'>
        {@html selectedWork.synopsis}
    </div>
    </aside>
{/if}

<style>
    .work-synopsis {
		backdrop-filter: blur(2px);

		padding-top: 1rem;
		padding-left: 2rem;
        padding-right: 2rem;
		scrollbar-width: none;
		-ms-overflow-style: none;
		/* Hide scrollbar for IE and Edge */
		width: 25%;
		position: absolute;
		left: 0;
		/* Align to the bottom right corner */
		bottom: 0;
		/* Align to the bottom right corner */
		overflow-x: hidden;
		/* Hide horizontal scrollbar */
		overflow-y: auto;
		/* Enable vertical scrolling if needed */
		max-height: 100vh;
		/* Maximum height */
		overflow-y: auto;
		/* Scroll vertically if content overflows */
		/* Grid background styles */
    }

    .text {
        color: white;
        text-align: left;

    }


    /* Add any additional styles you need here */
</style>