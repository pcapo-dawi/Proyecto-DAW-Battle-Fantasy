import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BattleStateService {
  private turnSubject = new BehaviorSubject<number>(1);
  turn$ = this.turnSubject.asObservable();

  setTurn(turn: number) {
    this.turnSubject.next(turn);
  }
}
