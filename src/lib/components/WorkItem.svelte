<script>
    import { T } from '@threlte/core';
    import { Vector3 } from 'three';
  
    export let position = new Vector3(0, 0, 0);
    export let color = 'white'; // default color
    // You can add other properties related to the box geometry or material
  </script>
  
  <T.Mesh position={position}>
    <T.BoxGeometry args={[1, 1, 1]} />
    <T.MeshStandardMaterial color={color} />
  </T.Mesh>