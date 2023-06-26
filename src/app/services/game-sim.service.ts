import { Injectable } from '@angular/core';
import { PlayerType, IPlayerModel } from '../models/player.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { IPlayersCountModel } from '../models/players-count.model';

@Injectable({
  providedIn: 'root',
})
export class GameSimService {
  private canvas!: HTMLCanvasElement;
  private animation!: number;

  // game configs
  private players: IPlayerModel[] = [];
  private readonly playerWidth = 32;
  private readonly playerHeight = 32;
  private readonly playersTotal = 105;
  private readonly simSpeed = 3;

  // players
  private imageRock = new Image();
  private imagePaper = new Image();
  private imageScissors = new Image();

  // game state
  private paused$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private winner$: BehaviorSubject<PlayerType | null> =
    new BehaviorSubject<PlayerType | null>(null);
  private playersCount$: BehaviorSubject<IPlayersCountModel> =
    new BehaviorSubject({ rocks: 0, pappers: 0, scissors: 0 });

  init(): void {
    this.loadImages();
    this.canvas = this.createCanvas();
    this.players = this.createPlayers();
    this.update();
  }

  restart(): void {
    this.playersCount$.next({ rocks: 0, pappers: 0, scissors: 0 });
    this.players = this.createPlayers();
    this.winner$.next(null);
    this.paused$.next(false);
    cancelAnimationFrame(this.animation);
    this.update();
  }

  getPlayersCount(): Observable<IPlayersCountModel> {
    return this.playersCount$.asObservable();
  }

  togglePaused(): void {
    this.paused$.next(!this.paused$.getValue());
    !this.paused$.getValue() && this.update();
  }

  isPaused(): Observable<boolean> {
    return this.paused$.asObservable();
  }

  getWinner(): Observable<PlayerType | null> {
    return this.winner$.asObservable();
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
    document.querySelector('app-root')?.appendChild(canvas);
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
        speedX: Math.random() * this.simSpeed - 1,
        speedY: Math.random() * this.simSpeed - 1,
        image: playerImage,
      };
    });
  }

  private update(): void {
    if (this.isGameStopped()) {
      return;
    } else {
      const ctx = this.canvas.getContext('2d');
      ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.updatePlayers(ctx);
      this.updateCounters();

      this.animation = requestAnimationFrame(() => this.update());
    }
  }

  private isGameStopped(): boolean {
    if (this.paused$.getValue()) {
      return true;
    } else if (this.playersCount$.getValue().rocks === this.playersTotal) {
      this.winner$.next('rock');
      return true;
    } else if (this.playersCount$.getValue().scissors === this.playersTotal) {
      this.winner$.next('scissors');
      return true;
    } else if (this.playersCount$.getValue().pappers === this.playersTotal) {
      this.winner$.next('paper');
      return true;
    } else {
      return false;
    }
  }

  private updatePlayers(ctx: CanvasRenderingContext2D | null) {
    this.players.forEach((player) => {
      this.updatePlayerPostion(player);
      this.updatePlayerCollistion(player);
      this.updatePlayerPosition(ctx, player);
    });
  }

  private updatePlayerPostion(player: IPlayerModel) {
    player.posX += player.speedX;
    player.posY += player.speedY;

    if (player.posX < 0 || player.posX + this.playerWidth > this.canvas.width) {
      player.speedX *= -1; // reverse horizontal direction
    }
    if (
      player.posY < 0 ||
      player.posY + this.playerHeight > this.canvas.height
    ) {
      player.speedY *= -1;
    }
  }

  private updatePlayerCollistion(player: IPlayerModel) {
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
  }

  private updatePlayerPosition(
    ctx: CanvasRenderingContext2D | null,
    player: IPlayerModel
  ) {
    ctx!.drawImage(
      player.image,
      player.posX,
      player.posY,
      this.playerWidth,
      this.playerHeight
    );
  }

  private updateCounters(): void {
    this.playersCount$.next({
      rocks: this.players.filter((player) => player.type === 'rock').length,
      pappers: this.players.filter((player) => player.type === 'paper').length,
      scissors: this.players.filter((player) => player.type === 'scissors')
        .length,
    });
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
