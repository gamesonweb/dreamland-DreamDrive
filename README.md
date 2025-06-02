# 🚗 DreamDrive

**DreamDrive** est un jeu de course 3D d'arcade en TypeScript développé avec **Babylon.js**. Le joueur contrôle une voiture qui roule à travers une route onirique et sinueuse, devant éviter des obstacles (cristaux) et collecter des sphères qui déclenchent des effets bonus ou malus aléatoires.

*Un projet de Malik MOUSSA et Iyed Loghmari.*

---

## 📺 Démo Vidéo

Découvrez le jeu en action :
[🎬 **Voir la démo de DreamDrive**](https://www.youtube.com/watch?v=_jp1cim6BbI)

Une version jouable est également disponible ici :
[🎮 Jouer à DreamDrive (Netlify)](https://dreamlanddreamdrive.netlify.app/)

---

## 🌟 Fonctionnalités Principales

-   🌌 **Univers Immersif :** Plongez dans une ambiance "Dreamland" avec une skybox personnalisée et un thème visuel onirique.
-   🚗 **Contrôle de Voiture 3D :** Pilotez une voiture réactive sur une route sans fin générée dynamiquement.
-   🪨 **Obstacles Dynamiques :** Des cristaux apparaissent sur votre chemin, testant vos réflexes.
-   🎲 **Bonus et Malus Aléatoires :** Collectez des sphères pour déclencher des effets via une animation de roulette :
    -   **🛡️ Bouclier (Shield) :** Vous protège d'une collision.
    -   **🚀 Nitro (Fast) :** Active une jauge de nitro pour une accélération temporaire.
    -   **🐌 Ralentissement (Slow) :** Réduit la vitesse de déplacement de la voiture.
    -   **🔁 Contrôles Inversés (Swap) :** Inverse temporairement les commandes de direction.
-   🎯 **Score :** Votre score augmente avec la distance parcourue.
-   🏁 **Game Over & Meilleur Score :** Un écran de fin de partie affiche votre score final ainsi que le meilleur score enregistré localement (via `localStorage`).
-   🎰 **Animation Roulette :** Une interface visuelle de type roulette pour la sélection des bonus/malus.

---

## ⌨️ Contrôles

-   **Déplacement latéral :** Touches `←` (Flèche Gauche) / `→` (Flèche Droite) ou `Q` / `D`.
-   **Activer la Nitro :** `Barre Espace` (lorsque la jauge de nitro est disponible).
-   **Démarrer le Jeu :** `Cliquez` sur l'écran d'accueil.

---

## 🛠️ Installation et Lancement Local

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :
-   [Node.js](https://nodejs.org) (version LTS recommandée, inclut npm)
-   [Parcel](https://parceljs.org) (si vous utilisez la configuration de build fournie. D'autres bundlers comme Vite ou Webpack peuvent nécessiter des ajustements dans les commandes).

### Étapes d'Installation

1.  **Clonez le dépôt (si vous partez du code source) :**
    ```bash
    git clone [URL_DE_VOTRE_DEPOT_GIT_ICI]
    cd [NOM_DU_DOSSIER_DU_PROJET]
    ```

2.  **Installez les dépendances :**
    Dans le dossier racine du projet, exécutez :
    ```bash
    npm install
    ```

3.  **Lancez le serveur de développement :**
    Pour compiler le projet et démarrer un serveur local :
    ```bash
    npm run dev
    ```
    Ouvrez ensuite l'URL affichée dans votre terminal (généralement `http://localhost:1234`) dans votre navigateur web.

---
