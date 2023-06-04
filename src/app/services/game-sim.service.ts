import { Injectable } from '@angular/core';
import { PlayerType, IPlayerModel } from '../models/player.model';

@Injectable({
  providedIn: 'root',
})
export class GameSimService {
  private canvas!: HTMLCanvasElement;

  private players: IPlayerModel[] = [];
  private readonly playerWidth = 32;
  private readonly playerHeight = 32;
  private readonly playersTotal = 45;

  private imageRock = new Image();
  private imagePaper = new Image();
  private imageScissors = new Image();

  init(): void {
    this.loadImages();
    this.canvas = this.createCanvas();
    this.players = this.createPlayers();
    this.update();
  }

  private loadImages(): void {
    this.imageRock.src = 'assets/rock.svg';
    this.imagePaper.src = 'assets/paper.svg';
    this.imageScissors.src = 'assets/scissors.svg';
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
      let playerType: PlayerType;
      let playerImage;
      if (index % 3 === 2) {
        playerType = 'scissors';
        playerImage = this.imageScissors;
      } else if (index % 3 === 1) {
        playerType = 'paper';
        playerImage = this.imagePaper;
      } else {
        playerType = 'rock';
        playerImage = this.imageRock;
      }

      return {
        index,
        type: playerType,
        posX: Math.random() * (this.canvas.width - this.playerWidth),
        posY: Math.random() * (this.canvas.height - this.playerHeight),
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        image: playerImage,
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

      this.players.forEach((otherPlayer) => {
        // Check for collision
        if (
          player.index !== otherPlayer.index &&
          this.checkCollision(
            player.posX,
            player.posY,
            this.playerWidth,
            this.playerHeight,
            otherPlayer.posX,
            otherPlayer.posY,
            this.playerWidth,
            this.playerHeight
          )
        ) {
          if (
            (player.type === 'rock' && otherPlayer.type === 'paper') ||
            (player.type === 'paper' && otherPlayer.type === 'scissors') ||
            (player.type === 'scissors' && otherPlayer.type === 'rock')
          ) {
            player.image = otherPlayer.image;
            player.type = otherPlayer.type;
            return;
          }
        }
      });

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

  private checkCollision(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ) {
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }
}
