import {
  Engine,
  Scene,
  Vector3,
  HemisphericLight,
  FollowCamera,
  ActionManager,
  KeyboardEventTypes
} from "@babylonjs/core";

import { createCar } from "./car";
import { createRoad, updateRoad } from "./road";
import { handleInput } from "./input";
import { createSkyDome } from "./sky";
import { loadCrystalObstacle, updateObstacles } from "./obstacles";
import { UIManager } from "./ui";
import { loadBonus, updateBonuses } from "./bonus";

let uiManager: UIManager;

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
  const scene = new Scene(engine);

  uiManager = new UIManager(scene, () => location.reload());

  new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  createSkyDome(scene);

  const car = await createCar(scene);

  const camera = new FollowCamera("carCam", new Vector3(0, 7, -14), scene);
  camera.lockedTarget = car;
  camera.heightOffset = 5;
  camera.radius = 14;
  camera.rotationOffset = 180;
  camera.cameraAcceleration = 0.1;
  camera.maxCameraSpeed = 100;
  camera.attachControl();
  camera.inputs.clear();

  const road = createRoad(scene);

  const inputMap: { [key: string]: boolean } = {};
scene.actionManager = scene.actionManager || new ActionManager(scene);
scene.onKeyboardObservable.add((kbInfo) => {
  const key = kbInfo.event.key.toLowerCase();
  inputMap[key] = kbInfo.type === KeyboardEventTypes.KEYDOWN;
});


  await loadCrystalObstacle(scene);
  await loadBonus(scene);

  let score = 0;
  scene.onBeforeRenderObservable.add(() => {
    handleInput(car, scene);
    updateRoad(road, car);
  
    updateObstacles(scene, () => {
      uiManager.showGameOver(score, getBestScore());
      scene.getEngine().stopRenderLoop();
    });
  
    updateBonuses(scene, car);
  
    score += car.metadata?.usingNitro ? 10 : 1;
    uiManager.updateScore(score, getBestScore());
  
    if (car.metadata?.recenter) {
      car.position.x *= 0.85;
      if (Math.abs(car.position.x) < 0.05) {
        car.position.x = 0;
        car.metadata.recenter = false;
      }
    }
  });

  return scene;
}

function getBestScore(): number {
  return parseInt(localStorage.getItem("bestScore") || "0");
}

