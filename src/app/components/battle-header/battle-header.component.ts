import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BattleStateService } from '../../services/battle/battle-state-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-battle-header',
  imports: [CommonModule, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './battle-header.component.html',
  styleUrl: './battle-header.component.scss'
})
export class BattleHeaderComponent implements OnDestroy {
  turn: number = 1;
  private sub: Subscription;

  constructor(private battleState: BattleStateService) {
    this.sub = this.battleState.turn$.subscribe(turn => this.turn = turn);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
