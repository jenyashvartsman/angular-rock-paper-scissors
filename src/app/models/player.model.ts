export interface IPlayerModel {
  index: number;
  type: PlayerType;
  posX: number;
  posY: number;
  speedX: number;
  speedY: number;
  image: HTMLImageElement;
}

export type PlayerType = 'rock' | 'paper' | 'scissors';
