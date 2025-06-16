import { TestBed } from '@angular/core/testing';
import { BattleStateServiceService } from './battle-state-service.service';

describe('BattleStateServiceService', () => {
  let service: BattleStateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BattleStateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
