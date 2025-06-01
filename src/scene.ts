import {
    Engine,
    Scene,
    Vector3,
    HemisphericLight,
    FollowCamera,
    ActionManager,
    KeyboardEventTypes,
    CubeTexture, // Conservé car utilisé pour environmentTexture
    // Sound // Retiré car nous utilisons l'audio HTML5
} from "@babylonjs/core";

import { createCar } from "./car";
import { createRoad, updateRoad } from "./road";
import { handleInput } from "./input";
// import { createSkyDome } from "./sky"; // Vous l'aviez commenté, je le laisse ainsi
import { loadCrystalObstacle, updateObstacles } from "./obstacles";
import { UIManager } from "./ui";
import { loadBonus, updateBonuses } from "./bonus";

let uiManager: UIManager;
let htmlAudioPlayer: HTMLAudioElement | null = null; // Référence pour le lecteur audio HTML5

export async function createGameScene(engine: Engine, canvas: HTMLCanvasElement): Promise<Scene> {
    const scene = new Scene(engine);

    uiManager = new UIManager(scene, () => {
        // Nettoyage de l'audio HTML avant de recharger
        if (htmlAudioPlayer) {
            htmlAudioPlayer.pause();
            if (htmlAudioPlayer.parentNode) {
                htmlAudioPlayer.parentNode.removeChild(htmlAudioPlayer);
            }
            htmlAudioPlayer = null;
        }
        location.reload();
    });

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const environmentTexture = CubeTexture.CreateFromImages(
        [
            "/assets/skybox/skybox_px.png",
            "/assets/skybox/skybox_py.png",
            "/assets/skybox/skybox_pz.png",
            "/assets/skybox/skybox_nx.png",
            "/assets/skybox/skybox_ny.png",
            "/assets/skybox/skybox_nz.png"
        ],
        scene
    );
    scene.environmentTexture = environmentTexture;
    scene.createDefaultSkybox(environmentTexture, true, 1000, 0.3);

    // --- Ajout de la musique de fond via HTML5 Audio ---
    if (!document.getElementById("backgroundMusicPlayer_html5")) {
        htmlAudioPlayer = document.createElement("audio");
        htmlAudioPlayer.id = "backgroundMusicPlayer_html5";
        htmlAudioPlayer.src = "/assets/theme.mp3"; // Chemin vers votre fichier theme.mp3
        htmlAudioPlayer.loop = true;
        htmlAudioPlayer.preload = "auto";
        htmlAudioPlayer.volume = 0.2; // Volume initial

        document.body.appendChild(htmlAudioPlayer);
        console.log("Élément audio HTML5 créé et ajouté au DOM.");

        const playPromise = htmlAudioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log("Musique HTML5 démarrée (ou tentative d'autoplay).");
            }).catch(error => {
                console.warn("Lecture automatique de l'audio HTML5 bloquée : ", error);
                console.log("La musique démarrera après la première interaction utilisateur.");
                
                const startAudioOnFirstInteraction = () => {
                    if (htmlAudioPlayer && htmlAudioPlayer.paused) {
                        htmlAudioPlayer.play().then(() => {
                            console.log("Musique HTML5 démarrée après interaction.");
                        }).catch(err => {
                            console.error("Erreur en jouant la musique HTML5 après interaction : ", err);
                        });
                    }
                    document.removeEventListener('click', startAudioOnFirstInteraction, true);
                    document.removeEventListener('touchend', startAudioOnFirstInteraction, true);
                };
                
                document.addEventListener('click', startAudioOnFirstInteraction, true);
                document.addEventListener('touchend', startAudioOnFirstInteraction, true);
            });
        }
    }
    // --- Fin de la section musique HTML5 ---

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
            if (htmlAudioPlayer) { // Arrêter la musique HTML5
                htmlAudioPlayer.pause();
            }
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