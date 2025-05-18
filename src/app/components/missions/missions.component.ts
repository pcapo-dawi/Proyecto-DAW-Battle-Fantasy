import { Component, Input } from '@angular/core';
import { Missions } from '../../../../backend/models/missions';
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

}
