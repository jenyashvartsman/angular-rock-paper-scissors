import { TestBed } from '@angular/core/testing';

import { GameSimService } from './game-sim.service';

describe('GameSimService', () => {
  let service: GameSimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameSimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
