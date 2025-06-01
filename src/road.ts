import {
    Scene,
    MeshBuilder,
    Mesh,
    PBRMaterial,
    Texture,
    Vector3,
    Nullable
} from "@babylonjs/core";

interface RibbonSection {
    mesh: Mesh;
    zStart: number;
}

let roadSections: RibbonSection[] = [];

// --- Paramètres de la route exportés ---
export const ROAD_WIDTH = 12;
export const CURVE_AMPLITUDE = 1.5;
export const CURVE_FREQUENCY = 0.05;

const numRibbonSections = 3;
const ribbonSectionLength = 200;
const pointsPerRibbonSection = 75;
const initialSegmentsBehindCar = 1;
const RECYCLE_THRESHOLD_OFFSET = 50;

/**
 * Fonction utilitaire exportée pour obtenir la position X centrale de la route à un Z donné.
 */
export function getRoadCenterXAtZ(worldZ: number): number {
    if (CURVE_AMPLITUDE > 0) { // S'assurer que l'amplitude n'est pas nulle pour éviter NaN avec Math.sin(X)*0
        return Math.sin(worldZ * CURVE_FREQUENCY) * CURVE_AMPLITUDE;
    }
    return 0;
}

function calculatePathArrayForRibbon(
    zStart: number,
    length: number,
    numPoints: number
): Vector3[][] {
    const leftPath: Vector3[] = [];
    const rightPath: Vector3[] = [];

    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const currentZ_inSection = t * length;
        const worldZ = zStart + currentZ_inSection;

        const worldX_center = getRoadCenterXAtZ(worldZ); // Utilisation de la fonction pour la cohérence
        const P_center = new Vector3(worldX_center, 0, worldZ);

        const dXdz = CURVE_AMPLITUDE * CURVE_FREQUENCY * Math.cos(worldZ * CURVE_FREQUENCY);
        
        let normal = new Vector3(1, 0, -dXdz);
        normal.normalize();
        
        const halfRoadWidth = ROAD_WIDTH / 2; // Utilisation de la constante

        rightPath.push(P_center.subtract(normal.scale(halfRoadWidth)));
        leftPath.push(P_center.add(normal.scale(halfRoadWidth)));
    }
    return [leftPath, rightPath];
}


export function createRoad(scene: Scene): Mesh[] {
    const roadMat = new PBRMaterial("roadMatPBR", scene);
    roadMat.albedoTexture = new Texture("/assets/road.png", scene);

    if (roadMat.albedoTexture) {
        roadMat.albedoTexture.wAng = Math.PI / 2;
    }

    roadMat.roughness = 0.8;
    roadMat.metallic = 0;
    roadMat.backFaceCulling = false;

    roadSections = [];
    for (let i = 0; i < numRibbonSections; i++) {
        const zStart = (i - initialSegmentsBehindCar) * ribbonSectionLength;
        const pathArray = calculatePathArrayForRibbon(zStart, ribbonSectionLength, pointsPerRibbonSection);

        const ribbonMesh = MeshBuilder.CreateRibbon(`roadRibbon_${i}`, {
            pathArray: pathArray,
            updatable: true,
            closePath: false,
            closeArray: false,
        }, scene);
        ribbonMesh.material = roadMat;

        roadSections.push({ mesh: ribbonMesh, zStart: zStart });
    }
    return roadSections.map(rs => rs.mesh);
}


export function updateRoad(meshesNotUsed: Mesh[], car: Mesh): void {
    const speed = 0.5;

    for (const section of roadSections) {
        section.zStart -= speed;

        const sectionEnd_Z = section.zStart + ribbonSectionLength;
        if (sectionEnd_Z < -RECYCLE_THRESHOLD_OFFSET) {
            section.zStart += numRibbonSections * ribbonSectionLength;
        }

        const newPathArray = calculatePathArrayForRibbon(section.zStart, ribbonSectionLength, pointsPerRibbonSection);
        MeshBuilder.CreateRibbon(null, {
            pathArray: newPathArray,
            instance: section.mesh
        });
    }
}