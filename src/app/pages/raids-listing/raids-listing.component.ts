import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { PlayersService } from '../../players/players.service';
import { Raid } from '../../../../backend/models/raid';
import { RaidsComponent } from '../../components/raids/raids.component';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-raids-listing',
  imports: [CommonModule, RaidsComponent, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './raids-listing.component.html',
  styleUrl: './raids-listing.component.scss'
})
export class RaidsListingComponent implements OnInit {
  public RaidsList: Raid[] = [];

  constructor(
    private playersService: PlayersService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        const playerId = data.player.ID;
        // 1. ¿Está en una raid activa?
        this.http.get<any>(`http://localhost:3000/api/active-raid-player/by-player/${playerId}`)
          .subscribe({
            next: (result) => {
              if (result.activeRaidPlayer) {
                // Redirige a la batalla de la raid (usa el ID_ActiveRaid como id)
                this.router.navigate(
                  ['/', { outlets: { primary: ['battle', result.activeRaidPlayer.ID_ActiveRaid], header: ['battle', result.activeRaidPlayer.ID_ActiveRaid] } }]
                );
              } else {
                // 2. ¿Está en una misión activa?
                this.http.get<any>(`http://localhost:3000/api/active-missions/by-player/${playerId}`)
                  .subscribe({
                    next: (result) => {
                      if (result.activeMission) {
                        this.router.navigate(
                          ['/', { outlets: { primary: ['battle', result.activeMission.ID_Mission], header: ['battle', result.activeMission.ID_Mission] } }]
                        );
                      }
                    }
                  });
              }
            }
          });
      }
    });

    this.http.get<Raid[]>('http://localhost:3000/api/raids')
      .subscribe(data => this.RaidsList = data);
  }

}
