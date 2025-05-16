import { Component, Input } from '@angular/core';
import { Missions } from '../../backend/models/missions';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-missions',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './missions.component.html',
  styleUrl: './missions.component.scss'
})
export class MissionsComponent {
  @Input() Missions!: Missions;
  // @Input() missions: Missions[] = [
  //   { id: 1, name: 'Mission 1', description: 'Description 1', time: 10, reward: 100 },
  //   { id: 2, name: 'Mission 2', description: 'Description 2', time: 20, reward: 200 },
  //   { id: 3, name: 'Mission 3', description: 'Description 3', time: 30, reward: 300 },
  // ];

}
