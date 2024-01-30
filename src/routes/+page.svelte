<script>
  //@ts-nocheck
  import App from '$lib/components/App.svelte'
  export let data
</script>

<div>
  <App {data}/>
</div>

<style>
  :global(body) {
    margin: 0;
  }

  div {
    width: 100vw;
    height: 100vh;
    background: rgb(13, 19, 32);
    background: linear-gradient(180deg, rgb(239, 239, 239) 0%, rgb(120, 120, 120) 100%);
  }
</style>
