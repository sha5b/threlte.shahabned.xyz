<script>
	//@ts-nocheck
	export let data;
	import { page } from '$app/stores';

	// Access the title parameter from the URL
	let titleParam = $page.params.title;

	// Find the work data that matches the title parameter
	let workData = data.works.find((work) => work.title === titleParam);

	// Now you can access both the title and the id from the workData object
	let workId = workData ? workData.id : null;

	function formatDate(dateString) {
		const options = {
			year: 'numeric',
			month: 'long'
		};
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, options);
	}
</script>

<div>
	{#each data.works as work}
		{#if work.id === workId}
			<h1>{work.title}</h1>
			<p>{formatDate(work.date)}</p>
			<p>{work.expand.category.title}</p>
			<p>{work.type} media</p>
			<p>{work.format}</p>
			<p>{work.dimension}</p>
			{#if work.editions}
				<p>{work.editions}</p>
			{/if}
			{#if work.expand.colab}
				{#each work.expand.colab as colab}
					<p>{colab.title}</p>
				{/each}
			{/if}
			{#if work.synopsis}
				<div>{@html work.synopsis}</div>
			{/if}
			{#if work.expand.exhibitions}
				{#each work.expand.exhibitions as exhibition}
					{#each data.colabs as colab}
						{#if colab.id === exhibition.curator}
							<!-- If a matching id is found, print the colab data -->
                            <p>Exhibition: {exhibition.title} - {formatDate(exhibition.date)} - {colab.title}</p>
							<!-- Add other colab details you want to display -->
						{/if}
					{/each}
				{/each}
			{/if}
			{#if work.expand.reference}
				{#each work.expand.reference as reference}
					<p>{reference.title}</p>
				{/each}
			{/if}
		{/if}
	{/each}
</div>

<style>
    
</style>
