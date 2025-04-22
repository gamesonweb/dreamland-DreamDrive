import {
    AdvancedDynamicTexture,
    TextBlock,
    Button,
    Rectangle,
    StackPanel,
    Control
  } from "@babylonjs/gui";
  import { Scene } from "@babylonjs/core";
  
  export class UIManager {
    private ui: AdvancedDynamicTexture;
    private scoreText: TextBlock;
    private bestScoreText: TextBlock;
    private popup: Rectangle | null = null;
    private onRestart: () => void;
  
    constructor(scene: Scene, onRestart: () => void) {
      this.onRestart = onRestart;
  
      this.ui = AdvancedDynamicTexture.CreateFullscreenUI("GameUI", true, scene);
  
      console.log("📺 UI initialisée");
  
      // SCORE ACTUEL
      this.scoreText = new TextBlock("scoreText", "Score : 0");
      this.scoreText.color = "white";
      this.scoreText.fontSize = 28;
      this.scoreText.top = "20px";
      this.scoreText.left = "20px";
      this.scoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      this.scoreText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      this.ui.addControl(this.scoreText);
  
      // BEST SCORE
      this.bestScoreText = new TextBlock("bestScoreText", "Best : 0");
      this.bestScoreText.color = "white";
      this.bestScoreText.fontSize = 20;
      this.bestScoreText.top = "55px";
      this.bestScoreText.left = "20px";
      this.bestScoreText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
      this.bestScoreText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
      this.ui.addControl(this.bestScoreText);
    }
  
    updateScore(score: number, best: number): void {
      this.scoreText.text = `Score : ${score}`;
      this.bestScoreText.text = `Best : ${best}`;
    }
  
    showGameOver(score: number, best: number): void {
      this.saveBestScore(score);
  
      console.log("🖼️ Création de la popup de Game Over");
  
      const overlay = new Rectangle("overlay");
overlay.width = "100%";
overlay.height = "100%";
overlay.background = "rgba(0,0,0,0.6)";
overlay.thickness = 0;
this.ui.addControl(overlay);  // ombre

this.popup = new Rectangle("popup");
this.popup.width = "400px";
this.popup.height = "300px";
this.popup.cornerRadius = 20;
this.popup.color = "white";
this.popup.thickness = 3;
this.popup.background = "#111";
this.popup.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
this.popup.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
this.ui.addControl(this.popup); // popup au-dessus


      const stack = new StackPanel();
      stack.paddingTop = "20px";
      stack.paddingBottom = "20px";
      stack.spacing = 15;
      this.popup.addControl(stack);
  
      const title = new TextBlock();
      title.text = "💀 GAME OVER 💀";
      title.fontSize = 32;
      title.color = "white";
      title.height = "50px";
      stack.addControl(title);
  
      const scoreDisplay = new TextBlock();
      scoreDisplay.text = `Score : ${score}`;
      scoreDisplay.fontSize = 24;
      scoreDisplay.color = "white";
      scoreDisplay.height = "30px";
      stack.addControl(scoreDisplay);
  
      const bestDisplay = new TextBlock();
      bestDisplay.text = `Best : ${this.getBestScore()}`;
      bestDisplay.fontSize = 20;
      bestDisplay.color = "white";
      bestDisplay.height = "30px";
      stack.addControl(bestDisplay);
  
      const restartButton = Button.CreateSimpleButton("restartBtn", "🔁 Rejouer");
      restartButton.width = "160px";
      restartButton.height = "60px";
      restartButton.cornerRadius = 10;
      restartButton.color = "white";
      restartButton.background = "#2ecc71";
      restartButton.fontSize = 22;
      restartButton.onPointerUpObservable.add(() => {
        this.hidePopup();
        this.onRestart();
      });
      stack.addControl(restartButton);
    }
  
    private hidePopup(): void {
      if (this.popup) {
        this.ui.removeControl(this.popup);
        this.popup.dispose();
        this.popup = null;
      }
    }
  
    private getBestScore(): number {
      return parseInt(localStorage.getItem("bestScore") || "0");
    }
  
    private saveBestScore(score: number): void {
      const best = this.getBestScore()
      if (score > best) {
        localStorage.setItem("bestScore", score.toString());
      }
    }
  }
  