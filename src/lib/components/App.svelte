<script lang='ts'>

  import { Canvas } from '@threlte/core'
  import Scene from './Scene.svelte'
  export let data: any
</script>

<Canvas>
  <Scene {data}/>
</Canvas>
