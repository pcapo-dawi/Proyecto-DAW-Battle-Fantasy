import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../../../../backend/models/mission';
import { MissionsComponent } from '../../components/missions/missions.component';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../players/players.service';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-missions-listing',
  imports: [CommonModule, MissionsComponent, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './missions-listing.component.html',
  styleUrl: './missions-listing.component.scss'
})
export class MissionsListingComponent implements OnInit {
  public MissionsList: Mission[] = [];

  constructor(private http: HttpClient, private router: Router, private playersService: PlayersService) {
    this.http.get<Mission[]>('http://localhost:3000/api/missions')
      .subscribe(data => this.MissionsList = data);
  }

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
  }

  acceptMission(mission: Mission) {
    this.router.navigate(['/battle', mission.id]);
  }
}
