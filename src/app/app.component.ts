import { Component, OnInit } from '@angular/core';
import { GameSimService } from './services/game-sim.service';
import { Observable } from 'rxjs';
import { IPlayersCountModel } from './models/players-count.model';
import { PlayerType } from './models/player.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  playersCount$!: Observable<IPlayersCountModel>;
  winner$!: Observable<PlayerType | null>;

  constructor(private gameSimService: GameSimService) {}

  ngOnInit(): void {
    this.gameSimService.init();
    this.playersCount$ = this.gameSimService.getPlayersCount();
    this.winner$ = this.gameSimService.getWinner();
  }

  restart(): void {
    this.gameSimService.restart();
  }

  togglePaused(): void {
    this.gameSimService.togglePaused();
  }
}
