import { Scene, Mesh, ActionManager, KeyboardEventTypes } from "@babylonjs/core";

let inputMap: { [key: string]: boolean } = {};
let lateralSpeed = 0;

export function handleInput(car: Mesh, scene: Scene): void {
  if (Object.keys(inputMap).length === 0) {
    scene.actionManager = scene.actionManager || new ActionManager(scene);

    scene.onKeyboardObservable.add((kbInfo) => {
      const key = kbInfo.event.key.toLowerCase();

      if (kbInfo.type === KeyboardEventTypes.KEYDOWN) {
        inputMap[key] = true;
      } else if (kbInfo.type === KeyboardEventTypes.KEYUP) {
        inputMap[key] = false;
      }
    });
  }

  let baseSpeed = 0.15;

  if (car.metadata?.slow) {
    baseSpeed = 0.075; // Si slow actif
  }

  // Inversion des contrôles si "swap"
  let moveLeft = inputMap["arrowleft"] || inputMap["q"];
  let moveRight = inputMap["arrowright"] || inputMap["d"];

  if (car.metadata?.swap) {
    [moveLeft, moveRight] = [moveRight, moveLeft];
  }

  if (moveLeft) {
    lateralSpeed = -baseSpeed;
  } else if (moveRight) {
    lateralSpeed = baseSpeed;
  } else {
    lateralSpeed *= 0.9;
  }

  car.position.x += lateralSpeed;

  const maxX = 5.5;
  if (car.position.x > maxX) car.position.x = maxX;
  if (car.position.x < -maxX) car.position.x = -maxX;
}