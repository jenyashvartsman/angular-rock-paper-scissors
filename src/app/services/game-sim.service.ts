import { Injectable } from '@angular/core';
import { IPlayerModel } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class GameSimService {
  private canvas!: HTMLCanvasElement;

  private players: IPlayerModel[] = [];
  private readonly playerWidth = 32;
  private readonly playerHeight = 32;
  private readonly playersTotal = 45;

  init(): void {
    this.canvas = this.createCanvas();
    this.players = this.createPlayers();
    this.update();
  }

  private createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;
    document.body.appendChild(canvas);
    return canvas;
  }

  private createPlayers(): IPlayerModel[] {
    return Array.from({ length: this.playersTotal }, (_elem, index) => {
      const image = new Image();

      if (index % 3 === 2) {
        image.src = 'assets/scissors.svg';
      } else if (index % 3 === 1) {
        image.src = 'assets/paper.svg';
      } else {
        image.src = 'assets/rock.svg';
      }

      return {
        posX: Math.random() * (this.canvas.width - this.playerWidth),
        posY: Math.random() * (this.canvas.height - this.playerHeight),
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        image,
      };
    });
  }

  private update(): void {
    const ctx = this.canvas.getContext('2d');
    ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.players.forEach((player) => {
      player.posX += player.speedX;
      player.posY += player.speedY;

      if (
        player.posX < 0 ||
        player.posX + this.playerWidth > this.canvas.width
      ) {
        player.speedX *= -1; // reverse horizontal direction
      }
      if (
        player.posY < 0 ||
        player.posY + this.playerHeight > this.canvas.height
      ) {
        player.speedY *= -1; // reverse vertical direction
      }

      ctx!.drawImage(
        player.image,
        player.posX,
        player.posY,
        this.playerWidth,
        this.playerHeight
      );
    });

    requestAnimationFrame(() => this.update());
  }
}
