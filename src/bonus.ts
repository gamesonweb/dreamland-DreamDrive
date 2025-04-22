import { Scene, Mesh, Vector3, AbstractMesh, SceneLoader } from "@babylonjs/core";
import { triggerRoulette } from "./roulette";
import { applyBonusEffect, isAnyBonusActive } from "./bonusprocess";

let baseBonus: Mesh | null = null;
const bonusSpeed = 0.4;
const spawnInterval = 200;
let frameCount = 0;
let activeBonuses: Mesh[] = [];

const bonusTypes = ["shield", "slow", "fast", "swap"];

export async function loadBonus(scene: Scene): Promise<void> {
  if (!baseBonus || baseBonus.isDisposed()) {
    const result = await SceneLoader.ImportMeshAsync("", "/assets/", "bonus_sphere.glb", scene);
    baseBonus = result.meshes[0] as Mesh;
    baseBonus.setEnabled(false);
    baseBonus.name = "bonusBase";
    console.log("🔁 baseBonus rechargé.");
  }
}

export function updateBonuses(scene: Scene, car: AbstractMesh): void {
  if (!baseBonus || baseBonus.isDisposed()) return;

  frameCount++;

  if (frameCount % spawnInterval === 0 && !isAnyBonusActive()) {
    const bonus = baseBonus.clone("bonusClone", null);
    if (!bonus) return;

    bonus.setEnabled(true);
    const zOffset = car.position.z + 40;
    bonus.position = new Vector3((Math.random() - 0.5) * 10, 0.5, zOffset);
    bonus.scaling.scaleInPlace(1.2);
    scene.addMesh(bonus);
    activeBonuses.push(bonus);
    console.log("✨ Bonus spawn !");
  }

  for (let i = activeBonuses.length - 1; i >= 0; i--) {
    const b = activeBonuses[i];
    b.position.z -= bonusSpeed;

    const distance = Vector3.Distance(b.position, car.position);
    if (distance < 1.5) {
      const type = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
      console.log("🎁 Bonus obtenu :", type);

      triggerRoulette(type, scene);
      applyBonusEffect(type, scene, car);

      b.dispose();
      activeBonuses.splice(i, 1);
      continue;
    }

    if (b.position.z < -10) {
      b.dispose();
      activeBonuses.splice(i, 1);
    }
  }
}