<script setup>
  import { ref } from 'vue';

  import TheCameraRig from './TheCameraRig.vue';
  import '../aframe/shoot-ball.js';
  

  defineProps({
    scale: Number,
    overlaySelector: String,
  });

  const allAssetsLoaded = ref(false);
  const startingSphere = ref(true);
  const timeElapsed = ref(0);
  let timerInterval;

  function startTimer() {
    timerInterval = setInterval(() => {
      timeElapsed.value++;
    }, 1000); 
  }

  function stopTimer() {
    clearInterval(timerInterval);
  }

  function startGame(evt) {
    const hitEl = evt.detail.otherComponent.el;
    if (hitEl.getAttribute('id').includes('hand-right-collider')) {
      const scene = document.querySelector('a-scene');
      const redSphere = document.querySelector('#startgame');
      if (redSphere) {
        if (startingSphere.value) {
          timeElapsed.value = 0; 
          startTimer(); 
          const sound = document.createElement('a-sound');
                sound.setAttribute('src', '#whistle');
                sound.setAttribute('autoplay', true);
                sound.setAttribute('loop', false);
                scene.appendChild(sound);
        }
        startingSphere.value = false;
        const entity = document.createElement('a-entity');
        entity.setAttribute('shoot-ball', '');
        entity.id = "shoot";
        scene.appendChild(entity);
      }
    }
  }

  function unhit(evt) {
    const hitEl = evt.detail.otherComponent.el;
    if (hitEl.getAttribute('id').includes('hand-right-collider')) {
      stopTimer(); 
      startingSphere.value = true;
    }
  }
    

</script>

<template>
  <a-scene
    background="color: black;"
    :webxr="`
      requiredFeatures: local-floor;
      referenceSpaceType: local-floor;
      optionalFeatures: dom-overlay;
      overlayElement: ${overlaySelector};
    `"
    xr-mode-ui="XRMode: xr"
    physx="
      autoLoad: true;
      delay: 1000;
      useDefaultScene: false;
      wasmUrl: lib/physx.release.wasm;
    "
  > 

    <a-assets @loaded="allAssetsLoaded = true">
  
      <a-asset-item id="football_ball" src="assets/low_poly_cartoon_football_ball_free.glb"></a-asset-item>
      <!--
        Title: Low Poly Cartoon Football Ball Free
        Model source: https://sketchfab.com/3d-models/low-poly-cartoon-football-ball-free-259ba8af81484d19861fd5d70e9f5fcc
        Model author: https://sketchfab.com/vendol21
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->

      <a-asset-item id="field" src="assets/stadeSansCage.glb"></a-asset-item>
      <a-asset-item id="cage" src="assets/cageDeFoot.glb"></a-asset-item>
      <!--
        Title: Low Poly Football Stadium
        Model source: https://sketchfab.com/3d-models/low-poly-football-stadium-2ef76246010e435eafb316539cd9c260
        Model author: https://sketchfab.com/Awbmegames
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->

      <a-asset-item id="stars" src="assets/stars.glb"></a-asset-item>
      <!--
        Title: [Extracted] Minecraft Java Edition's Stars
        Model source: https://sketchfab.com/3d-models/extracted-minecraft-java-editions-stars-c8868b7ffc4a473eb5cd9203a59e3650
        Model author: https://sketchfab.com/ajaxgb
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->

      <!--
        Gants de gardien de but dans TheCameraRig.vue
        Title: VR Retro Futuristic Gloves
        Model source: https://sketchfab.com/3d-models/vr-retro-futuristic-gloves-f3e0704e49fb436f838808f495c85edc
        Model author: https://sketchfab.com/Joeyvm
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->

      <a-asset-item id="crowd" response-type="arraybuffer" src="assets/Crowd.mp3" preload="auto"></a-asset-item>
      <!--
        Title: Free Crowd Cheering Sounds
        Model source: https://opengameart.org/content/free-crowd-cheering-sounds
        Model author: https://opengameart.org/users/gregor-quendel
        Model license: CC BY 4.0 ( https://creativecommons.org/licenses/by/4.0/ )
      -->

      <a-asset-item id="whistle" response-type="arraybuffer" src="assets/whistle.mp3" preload="auto"></a-asset-item>
      <!--
        Title: Referee whistle blow, gymnasium
        Model source: https://pixabay.com/fr/sound-effects/referee-whistle-blow-gymnasium-6320/
        Model author: https://pixabay.com/fr/users/pixabay-1/
      -->

    </a-assets>

    <template v-if="allAssetsLoaded">
      <a-sound src="#crowd" autoplay="true" loop="true" volume="0.5"></a-sound>
      <a-entity gltf-model="#field" position="-0.4 -8.610 -24.8" scale="0.4 0.4 0.4" rotation="0 0 0"></a-entity>
      <a-entity gltf-model="#cage" position="0.3 -9.690 -23.658" scale="0.25 0.45 0.4" rotation="0 180 0"></a-entity>
      <a-entity gltf-model="#stars" position="0 0 0" rotation="0 0 0"></a-entity>
      <a-sphere v-if="startingSphere"
     
      id="startgame" color="red" radius="0.2" position="0 1.9 -0.5" physx-body="type: kinematic; emitCollisionEvents: true"  @contactbegin="evt => startGame(evt)" @contactend="evt => unhit(evt)"></a-sphere>

      <a-box id="goal-trigger"
      @game-over="startingSphere=true"
      position="0 1 0.7" width="2.8" height="2" depth="1" material="visible: false;"></a-box>

      <a-text v-if="!startingSphere" id="timer" :value="'Time: ' + timeElapsed + 's'" position="-8.5 24 -66" color="white" scale="20 20 20"></a-text>

      <!-- Sol invisible -->
      <a-plane position="0 0 0" rotation="-90 0 0" width="100" height="100" material="visible: true;"></a-plane> 

    </template>

    <TheCameraRig />

  </a-scene>
</template> 
