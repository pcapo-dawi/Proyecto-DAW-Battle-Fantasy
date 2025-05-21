import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Mission } from '../../../../backend/models/mission';
import { MissionsComponent } from '../../components/missions/missions.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-missions-listing',
  imports: [CommonModule, MissionsComponent, HttpClientModule, RouterModule],
  standalone: true,
  templateUrl: './missions-listing.component.html',
  styleUrl: './missions-listing.component.scss'
})
export class MissionsListingComponent {
  public MissionsList: Mission[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.http.get<Mission[]>('http://localhost:3000/api/missions')
      .subscribe(data => this.MissionsList = data);
  }

  acceptMission(mission: Mission) {
    this.router.navigate(['/battle', mission.id]);
  }
}
