import {
    Scene,
    AbstractMesh,
    MeshBuilder,
    StandardMaterial,
    Color3,
    Vector3,
    KeyboardEventTypes,
    ActionManager,
  } from "@babylonjs/core";
  import { AdvancedDynamicTexture, Rectangle } from "@babylonjs/gui";
  
  let shieldMesh: AbstractMesh | null = null;
  let hasShield = false;
  
  let slowTimeout: any = null;
  let swapTimeout: any = null;
  let fastTimeout: any = null;
  
  let fastActive = false;
  let usingNitro = false;
  let currentNitro = 0;
  let nitroGauge: Rectangle | null = null;
  
  export function applyBonusEffect(type: string, scene: Scene, car: AbstractMesh): void {
    switch (type) {
      case "shield":
        if (shieldMesh) shieldMesh.dispose();
        shieldMesh = MeshBuilder.CreateSphere("shield", { diameter: 2 }, scene);
        shieldMesh.parent = car;
        shieldMesh.position = new Vector3(0, 0.5, 0);
  
        const mat = new StandardMaterial("shieldMat", scene);
        mat.diffuseColor = new Color3(0.2, 0.8, 1);
        mat.alpha = 0.3;
        shieldMesh.material = mat;
  
        hasShield = true;
        break;
  
      case "slow":
        car.metadata = car.metadata || {};
        car.metadata.slow = true;
        if (slowTimeout) clearTimeout(slowTimeout);
        slowTimeout = setTimeout(() => {
          car.metadata.slow = false;
          slowTimeout = null;
        }, 10000);
        break;
  
      case "swap":
        car.metadata = car.metadata || {};
        car.metadata.swap = true;
        if (swapTimeout) clearTimeout(swapTimeout);
        swapTimeout = setTimeout(() => {
          car.metadata.swap = false;
          swapTimeout = null;
        }, 10000);
        break;
  
      case "fast":
        if (fastActive) return;
        fastActive = true;
        currentNitro = 100;
        usingNitro = false;
        setupNitroGauge(scene);
        setupNitroControls(scene, car);
  
        // Timer de 30 secondes
        if (fastTimeout) clearTimeout(fastTimeout);
        fastTimeout = setTimeout(() => {
          console.log("⏳ Nitro expiré !");
          if (currentNitro > 0) {
            currentNitro = 0;
            if (nitroGauge) {
              nitroGauge.dispose();
              nitroGauge = null;
            }
          }
          fastActive = false;
          fastTimeout = null;
        }, 30000);
        break;
    }
  }
  
  function setupNitroGauge(scene: Scene) {
    if (!nitroGauge) {
      const ui = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
      nitroGauge = new Rectangle();
      nitroGauge.width = "200px";
      nitroGauge.height = "20px";
      nitroGauge.cornerRadius = 10;
      nitroGauge.color = "white";
      nitroGauge.background = "#00ffff";
      nitroGauge.horizontalAlignment = Rectangle.HORIZONTAL_ALIGNMENT_CENTER;
      nitroGauge.verticalAlignment = Rectangle.VERTICAL_ALIGNMENT_BOTTOM;
      nitroGauge.top = "-30px";
      ui.addControl(nitroGauge);
    }
  }
  
  function setupNitroControls(scene: Scene, car: AbstractMesh) {
    if (!scene.actionManager) scene.actionManager = new ActionManager(scene);
  
    scene.onKeyboardObservable.add((kbInfo) => {
      if (kbInfo.type === KeyboardEventTypes.KEYDOWN && kbInfo.event.code === "Space") {
        usingNitro = true;
      }
      if (kbInfo.type === KeyboardEventTypes.KEYUP && kbInfo.event.code === "Space") {
        usingNitro = false;
      }
    });
  
    scene.onBeforeRenderObservable.add(() => {
      if (fastActive && currentNitro > 0 && usingNitro) {
        car.position.z += 0.5;
        currentNitro -= 0.5;
        if (nitroGauge) nitroGauge.width = `${2 * currentNitro}px`;
  
        if (currentNitro <= 0) {
            if (nitroGauge) {
              nitroGauge.dispose();
              nitroGauge = null;
            }
          
            usingNitro = false;
            currentNitro = 0;
          
            // Réactiver les bonus
            scene.metadata = scene.metadata || {};
            scene.metadata.bonusDisabled = false;
          
            console.log("🧯 Nitro épuisé, bonus réactivés !");
          }          
      }
    });
  }
  
  export function handleCollisionWithObstacle(): boolean {
    if (hasShield && shieldMesh) {
      shieldMesh.dispose();
      hasShield = false;
      return false;
    }
    return true;
  }
  
  export function isAnyBonusActive(): boolean {
    return hasShield || fastActive || slowTimeout !== null || swapTimeout !== null;
  }
  
  // Utilisé si tu veux forcer la fin de fast depuis l’extérieur
  export function setFastEnded() {
    currentNitro = 0;
    fastActive = false;
    if (nitroGauge) nitroGauge.dispose();
    nitroGauge = null;
  }  