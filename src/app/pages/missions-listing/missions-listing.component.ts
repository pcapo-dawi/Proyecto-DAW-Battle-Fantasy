import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Missions } from '../../../../backend/models/missions';
import { MissionsComponent } from '../../components/missions/missions.component';

@Component({
  selector: 'app-missions-listing',
  imports: [CommonModule, MissionsComponent, HttpClientModule],
  standalone: true,
  templateUrl: './missions-listing.component.html',
  styleUrl: './missions-listing.component.scss'
})
export class MissionsListingComponent {
  public MissionsList: Missions[] = [];

  constructor(private http: HttpClient) {
    this.http.get<Missions[]>('http://localhost:3000/api/missions')
      .subscribe(data => this.MissionsList = data);
  }
}
