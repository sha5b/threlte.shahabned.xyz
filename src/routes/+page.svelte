<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	export let data;
</script>

<flex>
	<div>
		<App {data} />
	</div>
</flex>

<style>
	:global(body) {
		margin: 0px;
	}
	flex {
		padding: 25px;
		display: flex;
		align-items: stretch;
		justify-content: center;
		flex-direction: column;
	}
	div {
		flex-grow: 1;
		min-height: 95vh;
		background: rgb(13, 19, 32);
		background: linear-gradient(180deg, rgb(229, 65, 80) 0%, rgb(199, 57, 69) 100%);
	}
</style>
