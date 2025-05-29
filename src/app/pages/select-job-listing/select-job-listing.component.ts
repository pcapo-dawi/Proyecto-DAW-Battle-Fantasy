import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Jobs } from '../../../../backend/models/jobs';
import { SelectJobComponent } from '../../components/select-job/select-job.component';
import { RouterModule } from '@angular/router';
import { PlayersService } from '../../players/players.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-select-job-listing',
  imports: [CommonModule, SelectJobComponent, RouterModule],
  standalone: true,
  templateUrl: './select-job-listing.component.html',
  styleUrl: './select-job-listing.component.scss'
})
export class SelectJobListingComponent implements OnInit {
  public JobsList: Jobs[] = [];
  public playerId: number = 0; // Obtén el ID del usuario logueado

  constructor(
    private http: HttpClient,
    private router: Router,
    private playersService: PlayersService
  ) {
    // You can choose which API endpoint to use, or combine them as needed.
    // Example: Use the first endpoint
    //this.http.get<Jobs[]>('http://localhost:3000/api/jobs')
    //.subscribe(data => this.JobsList = data);

    // If you want to use the second endpoint instead, comment the above and uncomment below:
    this.http.get<Jobs[]>('http://localhost:3000/api/jobs-aspect-ids')
      .subscribe(data => this.JobsList = data);

    // Obtén el ID del usuario logueado (puedes guardarlo al hacer login)
    const player = JSON.parse(localStorage.getItem('player') || '{}');
    this.playerId = player.ID;
  }

  ngOnInit() {
    this.playersService.getPlayerLogged().subscribe({
      next: (data) => {
        this.playerId = data.player.ID;
      }
    });
  }

  onSelectAspect(job: Jobs, aspectId: number) {
    console.log('Enviando a backend:', this.playerId, job.ID, aspectId);
    this.playersService.assignJob(this.playerId, job.ID, aspectId).subscribe({
      next: () => {
        // Redirige o muestra mensaje de éxito
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Error al asignar job');
      }
    });
  }

}
