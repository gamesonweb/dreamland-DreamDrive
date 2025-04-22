import { Engine } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";
import { createGameScene } from "./scene";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const engine = new Engine(canvas, true);

createGameScene(engine, canvas).then((scene) => {
  engine.runRenderLoop(() => {
    scene.render();
  });
});

window.addEventListener("resize", () => {
  engine.resize();
});