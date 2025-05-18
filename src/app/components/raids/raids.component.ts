import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Raids } from '../../../../backend/models/raids';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-raids',
  imports: [CommonModule, MatCardModule],
  standalone: true,
  templateUrl: './raids.component.html',
  styleUrl: './raids.component.scss'
})
export class RaidsComponent {
  @Input() Raids!: Raids;

}
