# 🚗 DreamDrive


**DreamDrive** est un jeu 3D en TypeScript développé avec **Babylon.js**. Le joueur contrôle une voiture qui roule à travers une route onirique, en évitant des obstacles et en collectant des sphères qui déclenchent des bonus ou des malus aléatoires.

*Projet présenté par Malik MOUSSA et Iyed Loghmari*

---

## 🎮 Fonctionnalités

- 🌌 Univers immersif : skybox personnalisée et thème Dreamland
- 🚗 Voiture 3D contrôlable
- 🪨 Obstacles (cristaux) générés dynamiquement
- 🟡 Bonus / malus aléatoires :
  - **🛡️ Shield** : protège d’un choc
  - **🚀 Fast** : jauge de nitro activable avec Espace
  - **🐌 Slow** : ralentit les mouvements
  - **🔁 Swap** : inverse les contrôles
- 🎯 Score basé sur la distance parcourue
- 🏁 Écran de Game Over avec affichage du score et du meilleur score (stocké en `localStorage`)
- 🎰 Animation roulette pour bonus/malus

---

## ⌨️ Contrôles

- **← / → ou Q / D** : déplacer la voiture
- **Espace** : activer la nitro (si disponible)
- **Cliquez** sur l’écran d’accueil pour commencer

---

## 🛠️ Installation

### Prérequis

- [Node.js](https://nodejs.org)
- [Parcel](https://parceljs.org) (ou tout autre bundler moderne)

### Lancer le jeu localement

```bash
npm install
npm run dev

## Jeu en ligne

Vous pouvez jouer à la version hébergée du jeu ici :
https://dreamland-dreamdrive.netlify.app/
