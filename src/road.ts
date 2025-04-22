import {
    Scene,
    MeshBuilder,
    Mesh,
    StandardMaterial,
    Texture,
    Color3
  } from "@babylonjs/core";
  
  let roadSegments: Mesh[] = [];
  const segmentLength = 10;
  const totalSegments = 20;
  
  /**
   * Crée une route droite avec segments que l'on animera ensuite
   */
  export function createRoad(scene: Scene): Mesh[] {
    const roadMat = new StandardMaterial("roadMat", scene);
    roadMat.diffuseTexture = new Texture("/assets/road.png", scene);
    roadMat.specularColor = Color3.Black();
  
    for (let i = 0; i < totalSegments; i++) {
      const segment = MeshBuilder.CreateGround(`roadSegment_${i}`, {
        width: 12,
        height: segmentLength
      }, scene);
  
      segment.position.z = i * segmentLength;
      segment.material = roadMat;
      roadSegments.push(segment);
    }
  
    return roadSegments;
  }
  
  /**
   * Déplace les segments pour simuler un défilement + virages
   */
  export function updateRoad(road: Mesh[], car: Mesh): void {
    const speed = 0.5;
    const curveAmplitude = 3;
  
    for (const segment of road) {
      segment.position.z -= speed;
  
      // Recyclage de segment
      if (segment.position.z < -segmentLength) {
        segment.position.z += segmentLength * totalSegments;
  
        // Ajoute un virage aléatoire
        const curve = Math.sin(segment.position.z * 0.05) * curveAmplitude;
        segment.position.x = curve;
      }
    }
  }
  