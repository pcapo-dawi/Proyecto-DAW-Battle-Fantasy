import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Raid } from '../../../../backend/models/raid';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-raids',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './raids.component.html',
  styleUrl: './raids.component.scss'
})
export class RaidsComponent {
  @Input() Raid!: Raid;

}
