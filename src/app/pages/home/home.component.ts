import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../players/players.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PlayersService] // Ensure PlayersService is provided
})
export class HomeComponent implements OnInit {

  playersService = inject(PlayersService);

  ngOnInit(): void {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
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
