import {
  Scene,
  Mesh,
  SceneLoader,
  Vector3,
  AbstractMesh,
} from "@babylonjs/core";

import { handleCollisionWithObstacle } from "./bonusprocess";

let activeObstacles: Mesh[] = [];
let baseCrystal: Mesh | null = null;
const obstacleSpeed = 0.4;
let simulatedZ = 0;
let lastSpawnZ = 0;
const spawnSpacing = 30;
const obstaclesPerBatch = 3;

export async function loadCrystalObstacle(scene: Scene): Promise<void> {
  if (baseCrystal) return;

  const result = await SceneLoader.ImportMeshAsync(
    "",
    "/assets/",
    "crystal_obstacle.glb",
    scene
  );
  baseCrystal = result.meshes[0] as Mesh;
  baseCrystal.setEnabled(false);
  baseCrystal.name = "crystalBase";
}

export function updateObstacles(scene: Scene, onCollision: () => void): void {
  if (!baseCrystal) return;

  const car = scene.getMeshByName("car") as AbstractMesh;
  if (!car) return;

  car.refreshBoundingInfo({ applySkeleton: false });

  // Simule l'avancée en Z du "monde"
  simulatedZ += obstacleSpeed;

  // Zone de sécurité : pas d’obstacles avant Z = 30
  const safeZone = 30;
  while (simulatedZ + 60 > lastSpawnZ) {
    if (lastSpawnZ < safeZone) {
      lastSpawnZ += spawnSpacing;
      continue; // saute cette ligne d'obstacles
    }
  
    spawnObstacleBatch(scene, lastSpawnZ);
    lastSpawnZ += spawnSpacing;
  }

  for (let i = activeObstacles.length - 1; i >= 0; i--) {
    const obs = activeObstacles[i];
    obs.position.z -= obstacleSpeed;

    const distance = Vector3.Distance(obs.position, car.position);
    if (distance < 1.6) {
      const deadly = handleCollisionWithObstacle();
      if (deadly) {
        console.log("💥 Collision sans bouclier");
        onCollision();
      } else {
        console.log("🛡️ Collision annulée par le bouclier");
      }
      obs.dispose();
      activeObstacles.splice(i, 1);
      return;
    }

    if (obs.position.z < -10) {
      obs.dispose();
      activeObstacles.splice(i, 1);
    }
  }
}

function spawnObstacleBatch(scene: Scene, zBase: number): void {
  for (let i = 0; i < obstaclesPerBatch; i++) {
    const obs = baseCrystal!.clone("crystalClone", null)!;
    obs.setEnabled(true);
    obs.scaling.scaleInPlace(1.2);
    obs.refreshBoundingInfo({ applySkeleton: false });

    const randX = (Math.random() - 0.5) * 11; // Entre -5.5 et +5.5
    const randZ = zBase + Math.random() * spawnSpacing;

    obs.position = new Vector3(randX, 0.5, randZ);
    activeObstacles.push(obs);
  }
}
