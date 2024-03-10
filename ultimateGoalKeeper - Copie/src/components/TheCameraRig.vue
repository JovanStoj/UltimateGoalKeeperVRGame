<script setup>
import { ref } from 'vue';  
  import '../aframe/disable-in-vr.js';
  import '../aframe/hide-in-vr.js';
  import '../aframe/simple-navmesh-constraint.js';
  import '../aframe/blink-controls.js';
  import '../aframe/physx-grab.js';
  import '../aframe/shoot-ball.js';
  import './TheScene.vue';



  function hit(evt) {
    const hitEl = evt.detail.otherComponent.el;
    if (hitEl.getAttribute('id').includes('hand')) return;


    if(hitEl.getAttribute("id").includes("existing-football-ball")){
        console.log("hitEl", hitEl);  
        const ballEntity = hitEl;
        document.getElementById('shoot').removeAttribute('shoot-ball');
        document.getElementById('shoot').setAttribute('shoot-ball', '');
    }
}




</script>

<template>
  <a-entity
    id="camera-rig"
    movement-controls="camera: #head;"
    disable-in-vr="component: movement-controls;"
  >
      <a-entity
        id="head"
        look-controls="pointerLockEnabled: true"
        simple-navmesh-constraint="navmesh: [data-role='nav-mesh']; height: 1.65;"
        disable-in-vr="component: simple-navmesh-constraint;"
        camera
        position="0 1.65 0"
      >
        <a-entity
          geometry="primitive: circle; radius: 0.0003;"
          material="shader: flat; color: white;"
          cursor
          raycaster="far: 4; objects: [clickable]; showLine: false;"
          position="0 0 -0.1"
          disable-in-vr="component: raycaster; disableInAR: false;"
          hide-in-vr="hideInAR: false"
        ></a-entity>
      </a-entity>

      <a-entity
        id="hand-left"
        oculus-touch-controls="hand: left; model: false"
        blink-controls="
          cameraRig: #camera-rig;
          teleportOrigin: #head;
          collisionEntities: [data-role='nav-mesh'];
          snapTurn: false;
        "
      >
        <a-entity
          id="left-goalkeeper-glove"
          position="0 0 0" 
          rotation="0 90 0"
          scale="0.01 0.01 0.01" 
          gltf-model="url(assets/leftHand2.glb)"
        ></a-entity>
        
        <a-sphere
          id="hand-left-collider"
          radius="0.08"
          visible="false"
          color="red"
          physx-body="type: kinematic; emitCollisionEvents: true"
          @contactbegin="evt => hit(evt)"
        >
        </a-sphere>
       
      </a-entity>

      <a-entity
        id="hand-right"
        oculus-touch-controls="hand: right; model: false"
        raycaster="far: 4; objects: [clickable]; showLine: true;"
      >
        <a-entity
            id="right-goalkeeper-glove"
            position="0 0 0" 
            rotation="0 90 0"
            scale="0.01 0.01 0.01" 
            gltf-model="url(assets/rightHand2.glb)"
        ></a-entity>
        <a-sphere
          id="hand-right-collider"
          radius="0.08"
          visible="true"
          color="green"
          physx-body="type: kinematic; emitCollisionEvents: true"
          @contactbegin="evt => hit(evt)"
        ></a-sphere>
      </a-entity>

  </a-entity>
</template>