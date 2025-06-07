import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'
import { BattleStateService } from '../../services/battle/battle-state-service.service';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlayersService } from '../../players/players.service';

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
  missionId: number | null = null;
  playerId: number | null = null;

  constructor(
    private battleState: BattleStateService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private playersService: PlayersService
  ) {
    this.sub = this.battleState.turn$.subscribe(turn => this.turn = turn);

    // Obtener missionId de la ruta
    this.route.params.subscribe(params => {
      this.missionId = params['id'] ? +params['id'] : null;
    });

    // Obtener playerId del servicio
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.playerId = data.player.ID;
      }
    });
  }

  createRaid(): void {
    if (!this.missionId || !this.playerId) {
      alert('No se pudo obtener la misión o el jugador.');
      return;
    }
    this.http.post<any>('http://localhost:3000/api/raids/create', {
      missionId: this.missionId,
      playerId: this.playerId
    }).subscribe({
      next: (data) => {
        alert('Raid creada. Otros jugadores pueden unirse.');
        // Aquí puedes redirigir o actualizar la UI si lo deseas
      },
      error: (err) => {
        alert('Error al crear la raid: ' + (err.error?.message || err.message));
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
