import * as PIXI from "pixi.js";

import { Key, contain } from "../utils/helper";
import { CurrentFigure } from "./CurrentFigure";
import { Figure } from "./Figure";
import { AxieDirection, Mixer } from "./types";

class ContainerWithVelocity extends PIXI.Container {
  vx?: number;
}

export class PlaygroundGame extends PIXI.Application {
  offsetWidth: number;
  offsetHeight: number;
  keys: Record<string, Key>;
  axieContainer: ContainerWithVelocity;
  axieDirection: AxieDirection;
  currentFigure: CurrentFigure;
  axieContiner: PIXI.Container;

  constructor(options) {
    super(options);
    this.offsetWidth = options.width;
    this.offsetHeight = options.height;
    this.keys = null;
    this.axieDirection = AxieDirection.Left;
  }

  startGame() {
    this.stage.interactive = true;
    this.renderer.view.style.touchAction = "auto";
    this.renderer.plugins.interaction.autoPreventDefault = false;
    this.view.style.width = `${this.offsetWidth}px`;
    this.view.style.height = `${this.offsetHeight}px`;

    let state;

    this.loader.load(async () => {
      const currentFigure = new CurrentFigure();
      const figure = await Figure.fromGenes(
        this.loader,
        "0x82818021041000000001028810804104000102942880850a0001028c286180080001028c282101080001029420614508000102941800410a"
      );
      currentFigure.currentSpine = figure;
      currentFigure.addChild(figure);
      currentFigure.changeCurrentAnimation("draft/run-origin", true);
      currentFigure.vx = 1;
      currentFigure.position.set(this.offsetWidth / 2, this.offsetHeight - 130);
      contain(currentFigure, { width: 300, height: 300 });

      this.stage?.addChild(currentFigure);
      this.currentFigure = currentFigure;
      this.currentFigure.registerKeyBoardController();

      // Enable dragging for the current figure
      this.setupDragAndDrop(currentFigure);
    });

    // Pointer down event to change animation and stop movement
    this.stage?.on("pointerdown", () => {
      this.currentFigure.changeCurrentAnimation("action/idle/random-02", false);
      this.currentFigure.changeCurrentAnimation("action/idle/normal", true, 1);
      this.currentFigure.vx = 0; // Stop movement when tapped
    });

    const play = (delta) => {
      if (this.currentFigure) {
        this.currentFigure.x += this.currentFigure.vx;

        // Check if the figure has reached the screen boundary, and reverse direction
        if (
          this.currentFigure.x >=
          this.offsetWidth - this.currentFigure.width + 100
        ) {
          this.currentFigure.vx = -Math.abs(this.currentFigure.vx); // Move left
          this.currentFigure.currentSpine.scale.x = 0.18 * AxieDirection.Left;
          this.currentFigure.changeCurrentAnimation("draft/run-origin", true);
        } else if (this.currentFigure.x <= 0) {
          this.currentFigure.vx = Math.abs(this.currentFigure.vx); // Move right
          this.currentFigure.currentSpine.scale.x = 0.18 * AxieDirection.Right;
          this.currentFigure.changeCurrentAnimation("draft/run-origin", true);
        }

        // Simulate falling if the figure is not at the ground level
        if (this.currentFigure.y < this.offsetHeight - 130) {
          this.currentFigure.y += 1; // Adjust this value to control the fall speed
        }
      }
    };

    state = play;
    const gameLoop = (delta) => state(delta);
    this?.ticker?.add((delta) => gameLoop(delta));
    this.start();
  }

  // Setup drag-and-drop functionality for the figure
  setupDragAndDrop(figure) {
    figure.interactive = true;

    // Event listeners for drag-and-drop
    figure.on("pointerdown", this.onDragStart);
    figure.on("pointerup", this.onDragEnd);
    figure.on("pointerupoutside", this.onDragEnd);
    figure.on("pointermove", this.onDragMove);
  }

  // Drag start function
  onDragStart(event) {
    this.data = event.data; // Store pointer data
    this.alpha = 0.5; // Change transparency when dragging
    this.dragging = true; // Set dragging state to true
  }

  // Drag end function
  onDragEnd() {
    this.alpha = 1; // Reset transparency
    this.dragging = false; // Set dragging state to false
    this.data = null; // Clear pointer data

    // Initiate falling after drag ends
    this.startFalling();
  }

  // Start the falling sequence
  startFalling() {
    const fall = () => {
      if (this.y < this.parent.height - this.height) {
        this.y += 2; // Adjust fall speed as needed
      } else {
        // Stop falling when the figure reaches the ground
        this.y = this.parent.height - this.height;
        return; // Exit the function
      }

      // Continue the fall animation
      requestAnimationFrame(fall);
    };

    fall();
  }

  // Drag move function
  onDragMove() {
    if (this.dragging) {
      const newPosition = this.data.getLocalPosition(this.parent); // Get the new position of the pointer
      this.x = newPosition.x; // Update sprite position
      this.y = newPosition.y; // Update sprite position
    }
  }

  changeSpine(axieId: string) {
    return this.currentFigure.changeSpine(this.loader, axieId);
  }

  changeSpineFromMixer(mixer: Mixer) {
    return this.currentFigure.changeSpineFromMixer(this.loader, mixer);
  }
}
