import {
    AdvancedDynamicTexture,
    Image,
    Rectangle,
    StackPanel,
    Control
  } from "@babylonjs/gui";
  import { Scene } from "@babylonjs/core";
  
  const bonusImages = ["shield", "swap", "slow", "fast"];
  const imagePath = "/assets/";
  
  let isSpinning = false;
  let container: Rectangle | null = null;
  
  export function triggerRoulette(type: string, scene: Scene): void {
    if (isSpinning) return;
  
    const gui = AdvancedDynamicTexture.CreateFullscreenUI("rouletteUI", true, scene);
    isSpinning = true;
  
    container = new Rectangle(); // Create a new Rectangle for the roulette
    container.width = "200px";
    container.height = "100px";
    container.cornerRadius = 10;
    container.color = "white";
    container.thickness = 2;
    container.background = "black";
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    container.top = "20px";
    container.left = "-20px";
    gui.addControl(container);
  
    const stack = new StackPanel();
    container.addControl(stack);
  
    const displayImage = new Image("bonusImage", "");
    displayImage.width = "80px";
    displayImage.height = "80px";
    stack.addControl(displayImage);
  
    let currentIndex = 0;
    const totalSpins = 20;
    let spinCount = 0;
    const interval = setInterval(() => {
      const imgName = bonusImages[currentIndex % bonusImages.length];
      displayImage.source = `${imagePath}${imgName}.png`;
  
      currentIndex++;
      spinCount++;
  
      if (spinCount >= totalSpins) {
        clearInterval(interval);
        displayImage.source = `${imagePath}${type}.png`;
        isSpinning = false;
  
        // Cache la roulette après 2 secondes
        setTimeout(() => {
          if (container) {
            gui.removeControl(container);
            container.dispose();
            container = null;
          }
        }, 2000);
      }
    }, 100);
  }  