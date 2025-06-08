import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Raid } from '../../../../backend/models/raid';
import { RaidsComponent } from '../../components/raids/raids.component';
import { MatIconModule } from '@angular/material/icon'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-raids-listing',
  imports: [CommonModule, RaidsComponent, RouterModule, MatIconModule],
  standalone: true,
  templateUrl: './raids-listing.component.html',
  styleUrl: './raids-listing.component.scss'
})
export class RaidsListingComponent {
  public RaidsList: Raid[] = [];

  constructor(private http: HttpClient) {
    this.http.get<Raid[]>('http://localhost:3000/api/raids')
      .subscribe(data => this.RaidsList = data);
  }

}
