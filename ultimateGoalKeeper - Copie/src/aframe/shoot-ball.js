// Définition des limites pour les positions aléatoires
const minX = -1.4; // Limite minimale pour la coordonnée X
const maxX = 1.4; // Limite maximale pour la coordonnée X
const minY = 0.1; // Limite minimale pour la coordonnée Y
const maxY = 2; // Limite maximale pour la coordonnée Y
const minZ = 8; // Limite minimale pour la coordonnée Z (profondeur)
const maxZ = 12; // Limite maximale pour la coordonnée Z (profondeur)

AFRAME.registerComponent('shoot-ball', {
  schema: {
    ballStopped: {type: 'boolean', default: false},
    running: {type: 'boolean', default: true},
    speed: {type: 'number', default: 0.29},
    ballshot: {type: 'number', default: 0} 
  },

  init: function () {
    const hasBall = document.querySelector('#existing-football-ball');
    if (hasBall) {
      hasBall.remove();
    }
    
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;
    const ballEntity = document.createElement('a-entity');
    ballEntity.setAttribute("gltf-model", "#football_ball");
    ballEntity.setAttribute('id', 'existing-football-ball');
    ballEntity.setAttribute('position', '0 0.2 -11');
    ballEntity.setAttribute('scale', '0.0045 0.0045 0.0045');
    ballEntity.setAttribute('physx-body', "type: kinematic; emitCollisionEvents: true")
    ballEntity.setAttribute('visible', true);
    this.running = false;
    this.goalPosition = new THREE.Vector3(randomX, randomY, randomZ);
    this.goalTrigger = document.getElementById('goal-trigger');
    this.startShooting();
    this.el.sceneEl.appendChild(ballEntity);

    this.ballEntity = ballEntity.object3D;

    this.elapsedTime = 0;
  },

  update: function () {
    this.running = this.data.running;
  },

  startShooting: function () {
    this.running = true;
    this.shootRandomBall();
  },

  tick: function () {
    if (!this.running) return;

    const ballPosition = this.ballEntity.position.clone();
    const directionToGoal = this.goalPosition.clone().sub(ballPosition).normalize();
    const newPosition = ballPosition.add(directionToGoal.multiplyScalar(this.data.speed));
    this.ballEntity.position.copy(newPosition);
    if(this.data.ballStopped) {
      this.resetBallPosition();
      this.startShooting();
    }

    if (this.isCollidingWithGoalTrigger()) {
      this.resetBallPosition();
      this.running = false;
      clearInterval(this.speedInterval);
      console.log('Game Over');
      document.querySelector('#goal-trigger').emit("game-over", "null");
    }
  },

  isCollidingWithGoalTrigger: function () {
    const ballPosition = this.ballEntity.position; 
    const goalTriggerPosition = this.goalTrigger.object3D.position;
    const goalTriggerWidth = this.goalTrigger.getAttribute('width');
    const goalTriggerHeight = this.goalTrigger.getAttribute('height');
    const goalTriggerDepth = this.goalTrigger.getAttribute('depth');
  
    const isColliding =
      ballPosition.x >= goalTriggerPosition.x - goalTriggerWidth / 2 &&
      ballPosition.x <= goalTriggerPosition.x + goalTriggerWidth / 2 &&
      ballPosition.y >= goalTriggerPosition.y - goalTriggerHeight / 2 &&
      ballPosition.y <= goalTriggerPosition.y + goalTriggerHeight / 2 &&
      ballPosition.z >= goalTriggerPosition.z - goalTriggerDepth / 2 &&
      ballPosition.z <= goalTriggerPosition.z + goalTriggerDepth / 2;
  
    if (isColliding) {
      this.updateBallshotCounter(); 
      
      const ballEntity = document.querySelector('#existing-football-ball');
      if (ballEntity) {
        ballEntity.remove();
      }
  
      this.running = false;
      clearInterval(this.speedInterval);
      console.log('Game Over');
      document.querySelector('#goal-trigger').emit("game-over", "null");

    }
  
    return isColliding;
  },
  
  resetBallPosition: function () {
    this.ballEntity.position.set(0, 0.2, -11);
    this.updateBallshotCounter(); 
  },

  shootRandomBall: function () {
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;
    const randomZ = Math.random() * (maxZ - minZ) + minZ;

    this.updateBallshotCounter();

    this.goalPosition.set(randomX, randomY, randomZ);
  },

  updateBallshotCounter: function () {
    const counterText = document.querySelector('#ballsShotCounter');
    if (counterText) {
      counterText.setAttribute('value', 'Saves: ' + this.data.ballshot); 
      console.log('Balls Hit:', this.data.ballshot); 
    }
  }
});
