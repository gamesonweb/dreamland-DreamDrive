import {
    Scene,
    MeshBuilder,
    StandardMaterial,
    Texture
  } from "@babylonjs/core";
import skyTextureUrl from './assets/sky_dreamland_hd.png';

  
  /**
   * Crée un dôme de ciel pastel onirique
   */
  export function createSkyDome(scene: Scene): void {
    const dome = MeshBuilder.CreateSphere("skyDome", {
      diameter: 1000,
      segments: 32
    }, scene);
  
    dome.scaling.y = 0.7; // légèrement aplati pour l'effet "ciel"
    dome.position.y = -100; // en dessous pour qu'il englobe tout
  
    const domeMat = new StandardMaterial("skyMat", scene);
    domeMat.emissiveTexture = new Texture(skyTextureUrl, scene);
    domeMat.backFaceCulling = false;
    domeMat.disableLighting = true;
  
    dome.material = domeMat;
  }  
