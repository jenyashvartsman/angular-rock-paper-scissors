import { Component, OnInit, ViewChild } from '@angular/core';
import { GameSimService } from './services/game-sim.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private gameSimService: GameSimService) {}

  ngOnInit(): void {
    this.gameSimService.init();
  }
}
