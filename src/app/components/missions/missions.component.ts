import { Component, Input } from '@angular/core';
import { Mission } from '../../../../backend/models/mission';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-missions',
  imports: [CommonModule, MatCardModule, RouterModule],
  standalone: true,
  templateUrl: './missions.component.html',
  styleUrl: './missions.component.scss'
})
export class MissionsComponent {
  @Input() Mission!: Mission;

}
