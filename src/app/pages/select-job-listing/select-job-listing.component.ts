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
  public playerId: number = 0;

  constructor(
    private http: HttpClient,
    private router: Router,
    private playersService: PlayersService
  ) {

    this.http.get<Jobs[]>('http://localhost:3000/api/jobs-aspect-ids')
      .subscribe(data => this.JobsList = data);
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
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Error al asignar job');
      }
    });
  }

}
