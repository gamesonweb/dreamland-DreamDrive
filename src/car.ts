import {
  Scene,
  SceneLoader,
  Mesh,
  Vector3,
  MeshBuilder,
  StandardMaterial,
  Color3
} from "@babylonjs/core";

/**
 * Importe une voiture 3D + ajoute un bouclier désactivé
 */
export async function createCar(scene: Scene): Promise<Mesh> {
  const result = await SceneLoader.ImportMeshAsync("", "/assets/", "fantasy_car.glb", scene);
  const car = result.meshes[0] as Mesh;
  car.name = "car";

  car.position = new Vector3(0, 0.2, 0);
  car.scaling.scaleInPlace(1.2);
  car.rotation = new Vector3(0, Math.PI, 0);

  // ✅ Initialiser metadata pour la vitesse
  car.metadata = { speed: 0.05, recenter: false };

  // ✅ Ajout d’un bouclier désactivé au départ
  const shield = MeshBuilder.CreateSphere("shield", { diameter: 3 }, scene);
  shield.parent = car;
  shield.position.y = 1;
  shield.isVisible = false;

  const mat = new StandardMaterial("shieldMat", scene);
  mat.emissiveColor = new Color3(0.5, 1, 1);
  mat.alpha = 0.4;
  shield.material = mat;

  return car;
}