import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../../../backend/models/player';
import { MatCardModule } from '@angular/material/card';
import { PlayersService } from '../../players/players.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon'

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  player: any;
  abilities: any[] = [];
  uniqueAbility: any = null;

  constructor(
    private playersService: PlayersService,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.player = data.player;
        this.http.get<any[]>(`http://localhost:3000/api/abilities/by-job/${this.player.ID_Job}`).subscribe({
          next: (abilities) => {
            this.abilities = abilities;
          }
        });
        // Cargar UniqueAbility
        if (this.player.ID_UniqueAbility) {
          this.http.get<any>(`http://localhost:3000/api/unique-abilities/${this.player.ID_UniqueAbility}`).subscribe({
            next: (uniqueAbility) => {
              this.uniqueAbility = uniqueAbility;
            }
          });
        }
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.http.delete(`http://localhost:3000/api/players/${this.player.ID}`).subscribe({
        next: () => {
          // Borra las cookies relevantes
          this.cookieService.deleteAll();
          // Redirige al login
          this.router.navigate([{ outlets: { primary: 'register', header: 'login' } }]);
        }
      });
    }
  }
}
