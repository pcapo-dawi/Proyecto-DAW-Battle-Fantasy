import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Raid } from '../../../../backend/models/raid';
import { RaidsComponent } from '../../components/raids/raids.component';

@Component({
  selector: 'app-raids-listing',
  imports: [CommonModule, RaidsComponent, HttpClientModule],
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
