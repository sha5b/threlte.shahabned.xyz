<script>
	//@ts-nocheck
	import App from '$lib/components/App.svelte';
	export let data;
	

	function handleBoxClick(event) {
    const categoryId = event.detail.id;
	console.log("+page recvied", categoryId)
    // Handle category ID as needed
  }

  function handleWorkClick(event) {
    const workId = event.detail.id;
	console.log("+page recvied", workId)
    // Handle work ID as needed
  }

</script>

<flex>
	<div>
		<App {data}  on:boxclick={handleBoxClick} on:workclick={handleWorkClick}/>
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
