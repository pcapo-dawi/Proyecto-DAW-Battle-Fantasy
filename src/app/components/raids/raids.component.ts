import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Raid } from '../../../../backend/models/raid';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { PlayersService } from '../../players/players.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-raids',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './raids.component.html',
  styleUrl: './raids.component.scss'
})
export class RaidsComponent {
  @Input() Raid!: Raid;

  constructor(
    private http: HttpClient,
    private playersService: PlayersService,
    private router: Router
  ) { }

  joinRaid() {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        const playerId = data.player.ID;
        this.http.post<any>('http://localhost:3000/api/raids/join', {
          raidId: this.Raid.id,
          playerId: playerId
        }).subscribe({
          next: (res) => {
            // Después de unirse, consulta el ID_ActiveRaid real
            this.http.get<any>(`http://localhost:3000/api/active-raid-player/by-player/${playerId}`)
              .subscribe({
                next: (result) => {
                  if (result.activeRaidPlayer) {
                    // Redirige a la batalla de la raid usando el ID_ActiveRaid
                    this.router.navigate(
                      ['/', { outlets: { primary: ['battle', result.activeRaidPlayer.ID_ActiveRaid], header: ['battle', result.activeRaidPlayer.ID_ActiveRaid] } }]
                    );
                  }
                }
              });
          },
          error: (err) => {
            alert('Error al unirse a la raid: ' + (err.error?.message || err.message));
          }
        });
      }
    });
  }
}
