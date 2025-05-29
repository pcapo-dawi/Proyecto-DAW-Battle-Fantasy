import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../players/players.service';
import { Player } from '../../../../backend/models/player'; // Adjust the import path as necessary

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PlayersService] // Ensure PlayersService is provided
})
export class HomeComponent implements OnInit {

  @Input() player!: Player;

  playersService = inject(PlayersService);

  ngOnInit(): void {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.player = data.player; // <-- Asigna aquí el player
        console.log('Usuario autenticado:', data.player);
      },
      error: (err) => {
        if (err.status === 401) {
          //alert('No autenticado');
        }
      }
    });
  }
}
